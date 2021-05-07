import React from "react";
import { hot } from "react-hot-loader";

//SocketIO
import Socket from "./Socket";
import io from "socket.io-client";

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
  Divider,
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

const styles = {
  channel: {
    display: "flex",
    border: "1px solid #3c4144",
    boxShadow:
      "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
    justifyContent: "space-between",
    "& > h6": {
      color: "#c7cccf",
      margin: 5,
      marginLeft: 10,
    },
  },
  input: {
    width: "100%",
    //position: "fixed",
    backgroundColor: "transparent",
    alignSelf: "center",
    display: "flex",
    //borderColor: "none",
    //border: "1px solid #3c4144",
    "& > div": {
      //border: "1px solid #3c4144",
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
    minHeight: "88%",
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
    border: "1px solid #3c4144",
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
    this.submit = () => {
      const val1 = this.props.user,
        val2 = document.getElementById("message").value,
        messageSubmit = val2.split("\n").join(" ").replaceAll(/(["])/g, "'");
      //console.log(val2)
      let data = {
        user: val1,
        message: messageSubmit
      };
      document.getElementById("message").value = "";

      Socket.emit("message", data);
    };

    Socket.on("message", (msg) => {
      let img = document.createElement("img");
      img.src = {defaultAv};
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
        Socket.emit("NoTyping");
      }
    };
    Socket.on("NoTyping", () => {
      document.getElementById("istyping").textContent = "";
    });
    this.NoTypInterval = () => {
      this.setState({ isTyping: false });
      Socket.emit("NoTyping");
    };
    Socket.on("NoTyping", () => {
      document.getElementById("istyping").textContent = "";
    });
    this.Typ = () => {
      let val1 = this.props.user;
      if (document.getElementById("message").value != "") {
        this.setState({ isTyping: true });
        Socket.emit("typing", val1);
        console.log("typing");
        setTimeout(this.NoTypInterval, 5000);
      }
    };
    Socket.on("typing", (user) => {
      let val = this.props.user;
      document.getElementById(
        "istyping"
      ).textContent = `${user} esta escribiendo...`;
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
  }
  componentDidMount() {
    setTimeout(() => {
      const chatBox = document.querySelector("#boxMensajes");
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.channel}>
          <Typography variant="h6">{this.props.chatSelected}</Typography>
          <IconButton
            color="inherit"
            style={{ color: "gray", display: "flex", alignSelf: "flex-end" }}
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
          <Typography className={classes.Typ} id="istyping"></Typography>
          <div className={classes.Typer}>
            <div className={classes.tab}>
              <IconButton color="inherit" onClick={this.icons}>
                <InsertEmoticonIcon />
              </IconButton>
              <TextField
                type="text"
                id="message"
                autoComplete="off"
                name="message"
                inputProps={{ maxLength: 500, }}
                placeholder="Envie un mensaje"
                multiline
                onKeyUp={this.IsTyping}
                className={classes.input}
              />
              <IconButton color="inherit" onClick={this.submit}>
                <SendIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default hot(module)(withStyles(styles)(Talk));
