import React from "react";
import { hot } from "react-hot-loader";

//Material UI
import {
  TextField, Container, Typography, List, 
  ListItem, ListItemText, AppBar,
  InputAdornment, IconButton, Divider,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import {
  Call as CallIcon,
  VideoCall as VideoCallIcon,
  Send as SendIcon,
  InsertEmoticon as InsertEmoticonIcon,
} from "@material-ui/icons";

//Extras
import defaultAv from "./../img/icon.png";
import Picker from "emoji-picker-react";
import Search from "./searchFriends";
import MenuHome from "./menuHome";

const styles = {
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
      maxHeight: 200,
      color: "#c7cccf",
      padding: 0,
      whiteSpace: "pre-wrap",
      overflowWrap: "break-word",
    },
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
};

class Talk extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ShowEmojis: false,
      isTyping: false,
    };
    const { socket } = this.props;
    this.submit = (e) => {
      e.preventDefault();
      const valInput = document.querySelector("#message").value,
        user = this.props.user;
      if (valInput !== "") {
        const messageSubmit = valInput
            .split("\n")
            .join(" ")
            .replaceAll(/"/g, '"'),
          data = {
            user: user,
            message: messageSubmit,
            date: new Date(),
          };
        document.getElementById("message").value = "";
        setTimeout(()=>{this.props.friendsPosition(this.props.pos)}, 1000);
          socket.emit("checkRoom");
          socket.emit("sendLastUpdateLocal", this.props.friends)
          socket.emit("message", JSON.stringify(data));
      }
    };
    socket.on("checkRoom", (n) => {
      const data = document.getElementById(`${n.id}`);
      data.style.opacity = "1";
      data.innerHTML = `${n.notify}`;
      this.props.friendsPosition(n.id)
    });

    socket.on("message", (msg) => {
      let img = document.createElement("img");
      img.src = "/dist/051210ccc8930db279f318fbbbc3e2cf.png";
      img.width = "24";
      img.height = "24";
      img.style.borderRadius = "50%";
      img.style.marginTop = "1%";
      img.style.marginLeft = "1%";
      img.style.marginRight = "6px";

      let node = document.createElement("LI");
      let textnode = document.createTextNode(`${msg.user}`);
      let node2 = document.createElement("LI");
      let textnode2 = document.createTextNode(`${msg.message}`);
      node2.style.marginTop = "9px";
      node2.style.marginLeft = "30px";

      node.appendChild(img);
      node.appendChild(textnode);
      node2.appendChild(textnode2);

      document.getElementById("mensajes").appendChild(node);
      document.getElementById("mensajes").appendChild(node2);
      const chatBox = document.querySelector("#boxMensajes");
      chatBox.scrollTop = chatBox.scrollHeight;
      this.NoTyp();
    });

    this.NoTyp = () => {
      if (document.getElementById("message").value === "") {
        this.setState({ isTyping: false });
        socket.emit("NoTyping");
      }
    };
    socket.on("NoTyping", () => {
      document.getElementById("istyping").textContent = "";
    });
    this.NoTypInterval = () => {
      this.setState({ isTyping: false });
      socket.emit("NoTyping");
    };
    socket.on("NoTyping", () => {
      document.getElementById("istyping").textContent = "";
    });
    this.Typ = () => {
      if (document.getElementById("message").value != "") {
        this.setState({ isTyping: true });
        socket.emit("typing", this.props.user);
        console.log("typing");
        setTimeout(this.NoTypInterval, 5000);
      }
    };
    socket.on("typing", (username) => {
      document.getElementById(
        "istyping"
      ).textContent = `${username} esta escribiendo...`;
    });

    this.IsTyping = (e) => {
      if (!this.state.isTyping) {
        this.setState({ isTyping: true });
        this.Typ();
      } else {
        this.NoTyp();
      }
    };

    this.onEmojiClick = (e, emojiObject) => {
      let chosenEmoji = null;
      chosenEmoji = emojiObject;
      document.getElementById("message").value += chosenEmoji.emoji;
    };
    this.icons = () => {
      if (this.state.ShowEmojis == false)
        return this.setState({ ShowEmojis: true });
      this.setState({ ShowEmojis: false });
    };
    this.selectChat = () => {
      const { classes } = this.props;
      if (this.props.canal)
        return (
          <React.Fragment>
            <div className={classes.channel}>
              <Typography variant="h6">{this.props.chatSelected}</Typography>
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
            <div id="boxMensajes" className={classes.boxMensajes}>
              <ul className={classes.mensajes} id="mensajes"></ul>
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
                  <Typography
                    className={classes.Typ}
                    id="istyping"
                  ></Typography>
                </div>
                <div className={classes.tab}>
                  <form
                    style={{ display: "contents" }}
                    required
                    onSubmit={this.submit}
                  >
                    <IconButton color="inherit" onClick={this.icons}>
                      <InsertEmoticonIcon style={{ color: "#828689" }} />
                    </IconButton>
                    <TextField
                      type="text"
                      id="message"
                      autoComplete="off"
                      name="message"
                      inputProps={{ maxLength: 500, minLength: 1 }}
                      placeholder="Envie un mensaje"
                      multiline
                      onKeyUp={this.IsTyping}
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
      return (
        <Search
          socket={this.props.socket}
          reloadChats={this.props.reloadChats}
        />
      );
    };
  }
  componentDidMount() {
    this.scrollInterval= setInterval(() => {
      const chatBox = document.querySelector("#boxMensajes");
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight;
      }
      console.log(this.props.chatSelected)
    }, 3000);
  }
  componentWillUnmount() {
    clearInterval(this.scrollInterval);
  }
  render() {
    const { classes } = this.props;
    return (
      <div>{this.props.chatSelected ? <this.selectChat /> : <MenuHome />}</div>
    );
  }
}

export default hot(module)(withStyles(styles)(Talk));
