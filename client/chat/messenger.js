import React from "react";
import { hot } from "react-hot-loader";

//Material UI
import {
  TextField,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  AppBar,
  InputAdornment,
  IconButton,
  Backdrop
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
  Call as CallIcon,
  VideoCall as VideoCallIcon,
  Send as SendIcon,
  InsertEmoticon as InsertEmoticonIcon,
  AttachFile as AttachFileIcon
} from "@material-ui/icons";

//Extras
import defaultAv from "./../img/icon.png";
import Picker from "emoji-picker-react";
import {Observable} from 'rxjs';
import {AppContext} from "./../../utils/app-context";
import routesApi from "./../../utils/routes-api";
import FileEditor from './fileEditor'

const styles = theme => ({
  channel: {
    display: "flex",
    border: "1px solid #3c4144",
    backgroundColor: "#2a2f32",
    justifyContent: "space-between",
    "& > h6": {
      color: "#c7cccf",
      margin: 5,
      marginLeft: 10,
    },
  },
  input: {
    width: "100%",
    background: "#323739",
    borderRadius: 18,
    padding: "5px 14px",
    alignSelf: "center",
    display: "flex",
    "& > div": {
      backgroundColor: "transparent",
      color: "#a3a8ac",
      "& > textarea": {
        overflowY: "auto !important",
        maxHeight: 200,
      },
    },
    "& .MuiInput-underline:before": {
      display: "none",
    },
    "& .MuiInput-underline:after": {
      display: "none",
    },
  },
  mensajes: {
    listStyle: "none",
    margin: 30,
    marginLeft: 9,
    marginTop: 0,
    padding: 0,
    "& > li": {
      maxWidth: 800,
      color: "#c7cccf",
      padding: 0,
      whiteSpace: "pre-wrap",
      overflowWrap: "break-word",
      "& > img": {
        borderRadius: "50%",
        marginTop: "1%",
        marginLeft: "1%",
        marginRight: 6,
      },
    },
  },
  liMensajes: {
    marginTop: 10,
    marginLeft: 28,
  },
  boxMensajes: {
    border: "2px solid #3c4144",
    minHeight: "92%",
    maxHeight: 210,
    borderBottom: 1,
    borderTop: 1,
    overflowY: "auto",
    display: "grid",
  },
  Typ: {
    margin: 0,
    position: "sticky",
    bottom: 45,
    left: 45,
    top: "0",
    color: "#c0bebe",
  },
  Typer: {
    display: "grid",
    justifyContent: "normal",
    alignItems: "end",
    position: "sticky",
    bottom: "0",
    top: "0",
    backgroundColor: "#1f2428",
    marginLeft: 15,
    marginRight: 15,
    gridAutoRows: "max-content",
    gridRow: 103,
    "&>div": {
      borderRadius: 12,
    },
  },
  tab: {
    display: "flex",
    justifyContent: "center",
    alignItems: "end",
    backgroundColor: "#1f2428",
    borderRadius: "50%",
    //border: "1px solid #3c4144",
    maxHeight: 400,
    width: "100%",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  }
});
class Messenger extends React.Component {
  observable;
  constructor(props, context) {
    super(props);
    this.state = {
      ShowEmojis: false,
      isTyping: false,
      fileEditorOptions: {isOpen: false}
    };
    const {socket, user} = context;
    const {updateFriendsPosition, friends, friendData} = this.props
    this.submitMessage = (e) => {
      e.preventDefault();
      let valInput = document.querySelector("#message")
      if (valInput.value !== "") {
        let messageSubmit = valInput.value
            .split("\n")
            .join(" ")
            .replaceAll(/"/g, '"'),
          data = {
            user: user,
            message: messageSubmit,
            type: "text",
            date: new Date().toISOString(),
          };
        valInput.value = "";
        updateFriendsPosition()
        .then(newFriendsPosition => {
          socket.emit("updatePositionFriends", newFriendsPosition)
          this.observable.subscribe();
        }) 

        socket.emit("sendMessage", data);
        const chatBox = document.querySelector("#mensajes");
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    };

    socket.on("sendMessage", (msg) => {
      this.props.updateNewMessage(msg)
      const chatBox = document.querySelector("#boxMensajes");
      chatBox.scrollTop = chatBox.scrollHeight;
      this.NoTyp();
    });

    this.NoTyp = () => {
      if (document.querySelector("#message").value === "") {
        this.setState({ isTyping: false });
        socket.emit("noTyping");
      }
    };
    socket.on("noTyping", () => {
      document.querySelector("#istyping").textContent = "";
    });
    this.NoTypInterval = () => {
      this.setState({ isTyping: false });
      socket.emit("noTyping");
    };
    socket.on("noTyping", () => {
      document.querySelector("#istyping").textContent = "";
    });
    this.Typing= () => {
      if (document.querySelector("#message").value != "") {
        this.setState({ isTyping: true });
        socket.emit("typing");
        setTimeout(this.NoTypInterval, 5000);
      }
    };
    socket.on("typing", (nickname) => {
      document.querySelector(
        "#istyping"
      ).textContent = `${nickname} esta escribiendo...`;
    });

    this.TyperHandler = (e) => {
      if (this.state.isTyping) 
        return this.NoTyp();
      this.setState({ isTyping: true });
      this.Typing();
    };
    this.onEmojiClick = (e, emojiObject) => {
      let chosenEmoji = null;
      chosenEmoji = emojiObject;
      const inputMessage = document.querySelector("#message")
      const inputValue = inputMessage.value
      const positionCursor = inputMessage.selectionStart
      const newMessage = 
      inputValue.slice(0, positionCursor) + 
      chosenEmoji.emoji + 
      inputValue.slice(positionCursor);
      
      inputMessage.value = newMessage
      this.TyperHandler()
    };
    this.readFileAsBuffer = (file) => {
      return new Promise((resolve, reject) => {
        const fileBuffer = new FileReader()
        fileBuffer.onload = () => {
          resolve(fileBuffer.result)
        }
        fileBuffer.readAsArrayBuffer(file)
      })
    }
    this.handleUploadImage = async (event) => {
      const file = event.target.files[0]
      if(!file) 
        return;
      const size = parseFloat(file.size / (1024 * 1024)).toFixed(2);
      if(size > 5) 
        return alert("The image is over 5MB!");
      const fileReader = new FileReader();
      const fileReaderBuffer = await this.readFileAsBuffer(file)
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        this.setState({
          fileEditorOptions: {
            isOpen: true, 
            friendName: this.props.friendData.nickname,
            name:file.name, 
            url: fileReader.result,
            buffer: fileReaderBuffer
          }
        })
     }
 
    }
    this.saveFile = () => {
      const {fileEditorOptions} = this.state
      updateFriendsPosition()
      .then(newFriendsPosition => {
        socket.emit("updatePositionFriends", newFriendsPosition)
        this.observable.subscribe();
      }) 
      socket.emit("sendMessageFile", {buffer: fileEditorOptions.buffer, url: fileEditorOptions.url})
      this.setState({fileEditorOptions: {isOpen: false}})
    }
    socket.on("sendMessageFile", (msg) => {
      this.props.updateNewMessage(msg)
      const chatBox = document.querySelector("#boxMensajes");
      chatBox.scrollTop = chatBox.scrollHeight;
    })
  }
  componentDidMount() {
    console.log(this.props)
    this.observable = new Observable(subscriber => {
      subscriber.next(this.props.sendNotify())
      subscriber.complete();
    });
  }
  componentWillUnmount() {
    const socket = this.context.socket
    socket.off("sendMessage", this.submitMessage);
    socket.off("sendNotify", this.props.sendNotify);
    socket.off("updatePositionFriends", this.props.updateFriendsPosition)
    socket.off("noTyping", this.NoTyp);
    socket.off("typing", this.Typing);
  }
  render() {
    const { classes, friendData, messagesChat} = this.props;
    const {fileEditorOptions} = this.state
    return (
      <React.Fragment>
        <Backdrop className={classes.backdrop} open={fileEditorOptions.isOpen}>
          {fileEditorOptions.isOpen ? 
            <FileEditor 
              fileEditorOptions={fileEditorOptions} 
              cancelFile={() => this.setState({fileEditorOptions: {isOpen: false}})}
              saveFile={this.saveFile}
            /> 
            : undefined
          }
        </Backdrop>
        <div className={classes.channel}>
          <Typography variant="h6">{friendData.nickname}</Typography>
          <IconButton
            color="inherit"
            style={{
              color: "gray",
              display: "flex",
              alignSelf: "flex-end",
            }}
          >
            <CallIcon style={{ marginRight: 10 }} />
            <VideoCallIcon style={{ marginRight: 10 }} />
          </IconButton>
        </div>
        <div id={"boxMensajes"} className={classes.boxMensajes}>
          <ul className={classes.mensajes} id={"mensajes"}>
            {messagesChat.map((e, index) => (
              <React.Fragment key={index}>
                <li>
                  <img src={defaultAv} width="24" height="24" />
                  {e.user}
                </li>
                <li className={classes.liMensajes}>
                  {e.type === "file" ? 
                    <img src={e.message} style={{
                      width: "auto",
                      height: "300px",
                      maxWidth: "500px",
                      maxHeight: "500px",
                      backgroundSize: "contain",
                      borderRadius: "unset"                 
                    }}/>
                  : e.message}
                </li>
              </React.Fragment>
            ))}
          </ul>
          {this.state.ShowEmojis ? (
            <Picker
              onEmojiClick={this.onEmojiClick}
              pickerStyle={{ bottom: "60px", position: "fixed" }}
            />
          ) : (
            <></>
          )}
          <div className={classes.Typer}>
            <div>
              <Typography className={classes.Typ} id="istyping"></Typography>
            </div>
            <div className={classes.tab}>
              <form
                style={{ display: "contents" }}
                required
                onSubmit={this.submitMessage}
              >
                <IconButton color="inherit" onClick={() => (
                  this.state.ShowEmojis ?  
                    this.setState({ ShowEmojis: false }) : 
                    this.setState({ ShowEmojis: true })
                )}>
                  <InsertEmoticonIcon style={{ color: "#828689" }} />
                </IconButton>        
                  <input type="file" accept="image/*" style={{ display:"none"}} onChange={this.handleUploadImage} id={"imageSelector"}/>
                  <label htmlFor={"imageSelector"} >
                    <IconButton component="span">
                      <AttachFileIcon style={{ color: "#828689" }} />
                    </IconButton>
                  </label>
                <TextField
                  type="text"
                  id={"message"}
                  autoComplete="off"
                  name={"message"}
                  inputProps={{ maxLength: 500, minLength: 1 }}
                  placeholder="Envie un mensaje"
                  multiline
                  onKeyUp={this.TyperHandler}
                  className={classes.input}
                />
                <IconButton type="submit">
                  <SendIcon style={{ color: "#828689" }} />
                </IconButton>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
Messenger.contextType = AppContext
export default hot(module)(withStyles(styles)(Messenger));
