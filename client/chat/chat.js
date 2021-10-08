import React from "react";
import { hot } from "react-hot-loader";

//Material UI
import {
  TextField, Container, Typography,
  List, ListItem, ListItemText,
  AppBar, InputAdornment, IconButton,
  Menu, MenuItem, Link
} from "@material-ui/core";
//import Backdrop from '@mui/material/Backdrop';
import { withStyles } from "@material-ui/core/styles";

//#Material UI/Icons
import {
  Menu as MenuIcon,
  AccountCircle,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
} from "@material-ui/icons";

//#Extras
import HandleScreen from "./handleScreen";
import MenuHome from "./menuHome";
import routesApi from "./../../utils/routes-api";
import {AppContext} from "./../../utils/app-context";
import defaultAv from "./../img/icon.png";
import Messenger from "./messenger";

import {Observable} from 'rxjs';
import { fromFetch } from "rxjs/fetch";
import { mergeMap } from "rxjs/operators";

const styles = {
  "@global": {
    "::-webkit-scrollbar": {
      width: 9,
    },
    "::-webkit-scrollbar-track": {
      background: "#323232",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#1d2323",
      borderRadius: 20,
    },
  },
  fondo: {
    gridTemplateRows: "100%",
    gridTemplateColumns: "20% 80%",
    backgroundColor: "#1f2428",
    minHeight: "100vh",
    display: "grid",
    backgroundSize: "cover",
    backgroundPosition: "center center",
  },
  icon: {
    borderRadius: "50%",
    marginTop: "2%",
  },
  contacts: {
    backgroundColor: "#131c21",
  },
  aria: {
    backgroundColor: "#141b23",
    color: "#9d9ea3",
    cursor: "pointer",
    display: "flex",
    borderTop: "1px solid #30383d",
    alignItems: "center",
    height: "72px",
  },
  select: {
    '&[aria-selected="true"]': {
      color: "rgb(199, 204, 207)",
      backgroundColor: "rgba(50, 55, 57, 0.2)",
      WebkitTransition: ".4s all ease-in-out",
      MozTransition: ".4s all ease-in-out",
      OTransition: ".4s all ease-in-out",
      transition: ".4s all ease-in-out",
    },
    '&[aria-selected="false"]': {
      '&:hover':{
        color: "rgba(199, 204, 207, 0.8)",
        backgroundColor: "rgba(50, 55, 57, 0.1)",
        WebkitTransition: ".4s all ease-in-out",
        MozTransition: ".4s all ease-in-out",
        OTransition: ".4s all ease-in-out",
        transition: ".4s all ease-in-out",
      }
    },
  },
  tools: {
    cursor: "pointer",
    color: "#9d9ea3",
    padding: 20,
    paddingLeft: 10,
    display: "flex",
    '&[aria-selected="true"]': {
      color: "rgb(199, 204, 207)",
      WebkitTransition: ".4s all ease-in-out",
      MozTransition: ".4s all ease-in-out",
      OTransition: ".4s all ease-in-out",
      transition: ".4s all ease-in-out",
    },
    "&:hover": {
      color: "rgb(199, 204, 207)",
      WebkitTransition: ".4s all ease-in-out",
      MozTransition: ".4s all ease-in-out",
      OTransition: ".4s all ease-in-out",
      transition: ".4s all ease-in-out",
    },
  },
  status: {
    width: 10,
    position: "relative",
    left: 29,
    marginTop: 19,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },
  friends: {
    maxHeight: 630,
    overflowY: "auto",
  },
  menu: {
    "&>.MuiPopover-paper": {
      top: "39px !important",
      left: "160px !important",
      color: "#fff",
      background: "#2a2f32",
      width: "151px !important",
    },
  },
  links: {
    color: "white",
    "&:hover": {
      textDecoration: "none",
    },
  },
  notify: {
    backgroundColor: "red",
    borderRadius: "51%",
    padding: 5,
    alignItems: "center",
    width: 20,
    position: "absolute",
    right: "81%",
    justifyContent: "center",
    display: "flex",
    height: 20,
  },
};
class Chat extends React.Component {
  observable;
  constructor(props, context) {
    super(props);
    const {socket, user} = context;
    this.state = {
      friends: [],
      friendsLength: 0,
      messagesChat: [],
      friendData: false,
      isTyping: false,
      isAriaSelected: false,
      isOpenScreens: false,
      anchorEl: null,
    };
    this.handleMenu = (e) => {
      if(typeof this.state.anchorEl === null)
        return this.setState({
          anchorEl: e.currentTarget,
        });
      this.setState({
        anchorEl: null,
      });
    };
    this.updateNewMessage = (msg) => {
      this.setState({messagesChat: [...this.state.messagesChat, {user: msg.user, type: msg.type, message: msg.message}]})
    }
    this.getMessages = async (e) => {
      const role = document.querySelectorAll('[aria-selected="true"]'),
        name = e.target.getAttribute("name");
      if (e.target.getAttribute("aria-selected") === "false") {
        role.forEach((role) => {
          role.setAttribute("aria-selected", false);
        });
        e.target.setAttribute("aria-selected", true);
        const friendData = this.state.friends.filter((e) => e.name === name);
        if (friendData.length === 0) 
          return this.setState({ isOpenScreens: true, friendData: false });
        this.setState({
          isOpenScreens: true,
          friendData: {
            id: `${friendData[0].id}`,
            nickname: `${friendData[0].name}`
          } 
        });
        const fetchData = await fetch(routesApi.getChat, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: friendData[0].id }),
        })
        const dataMessages = await fetchData.json()
            socket.emit("createRoom", {
              room: dataMessages.idChat,
              id: friendData[0].id,
            });
            const newFriends = Array.from(this.state.friends);
            newFriends[newFriends.findIndex((e) => e.id === friendData[0].id)] = {
              id: friendData[0].id,
              name: friendData[0].name,
              notify: 0,
            };
            document.getElementById(`${friendData[0].id}`).style.opacity = "0";
            if (!fetchData.ok) 
              return;
            this.setState({
              friends: newFriends
            });            
            const messages = dataMessages.dataChat[0].ChatData;
            messages.shift();
            console.log(messages)
            messages.forEach((infoChat, i) => {
              if(infoChat.type === "file")
                fetch(`${routesApi.getFileMessage}/${infoChat.message}`, 
                ).then(response => response.blob())
              .then(imageBlob => {
                 const imageObjectURL = URL.createObjectURL(imageBlob);
                 messages[i].message = imageObjectURL
                  this.setState({
                    messagesChat: messages,
                    friends: newFriends,
                  });
                  const chatBox = document.querySelector("#boxMensajes");
                  if (chatBox.scrollHeight)
                  chatBox.scrollTop = chatBox.scrollHeight;
              })

            })
      }
    };
    this.sendNotify = () => {
      socket.emit("sendNotify");
    }
    socket.on("sendNotify", (user) => {
      const data = document.getElementById(`${user.id}`);
      data.style.opacity = "1";
      data.innerHTML = `${user.notify}`;
      this.updateFriendsPosition(user.id);
    });
     this.reloadFriends = async () => {
      fetch(routesApi.getAllFriends)
      .then(res => res.json())
      .then(friends => {
        this.setState({
          friends: [],
          friendsLength: friends.rows.length
        });
        friends.rows.forEach((friend) => {
          socket.emit("loadNotify", { id: friend["user_id"], name: friend["user_nickname"] });
        })
      })
     }
    socket.on("loadNotify", (friend) => {
      this.setState({
        friends: [
          ...this.state.friends,
          { id: friend.id, name: friend.nickname, notify: friend.notify }
        ]
      })
      if(this.state.friendsLength === this.state.friends.length)
        this.getPositionFriends()
    })
    this.getPositionFriends = () => {
      socket.emit("getPositionFriends");
    };
    socket.on("getPositionFriends", (arr) => {
      if (arr !== null) {
        const positionFriends = JSON.parse(arr)
        let newFriendsPosition = this.state.friends.map((user, i) => {
          if(positionFriends[i] !== undefined){
            const posFriend = this.state.friends.findIndex(friend => friend.id === parseInt(positionFriends[i].id) )
            if(posFriend > -1)
              return this.state.friends[posFriend]
          }
        })
        Array.from(this.state.friends).forEach((user) => {
          const posFriend = newFriendsPosition.findIndex((friend) => friend.id === parseInt(user.id));
          if(posFriend === -1)
            newFriendsPosition.push(user) 
        })
        this.setState({
          friends: newFriendsPosition,
        });
      }
    });

    this.statusChecker = () => {
      this.interval = setInterval(() => {
        Array.from(this.state.friends).forEach(friend => 
          socket.emit("checkOnline", { id: friend.id, nickname: friend.name })
        )
      }, 1e4);
    };
    socket.on("checkOnline", async (user) => {
      document.querySelector(
        `#${user.nickname}`
      ).style.backgroundColor = `${user.status}`;
    });

    this.updateFriendsPosition = (id = this.state.friendData.id) => {
      return new Promise((resolve, reject) => {
        const friends = Array.from(this.state.friends),
          idFriend = this.state.friends.findIndex(
            (e) => e.id === parseInt(id)
          )
        if (idFriend !== -1) {
        friends.splice(idFriend, 1);
        friends.unshift(this.state.friends[idFriend]);
        this.setState({
          friends: friends,
        });
        }
        resolve(friends)
        reject([])
      })
    };
  }
  componentDidMount() {
    this.reloadFriends()
    this.observable = new Observable(subscriber => {
      subscriber.next(this.statusChecker());
      subscriber.complete();
    });  
    this.observable.subscribe({
      next(x) { },
      error(err) { console.error('something wrong occurred: ' + err); },
      complete() { }
    });
  }
  componentWillUnmount() {
    const {socket} = this.context
    socket.off("getPositionFriends")
    socket.off("loadNotify")
    socket.off("sendNotify")
  }
  render() {
    const { classes } = this.props;
    const open = Boolean(this.state.anchorEl);
    return (
      <div className={classes.fondo}>
        <div className={classes.contacts}>
          <AppBar
            style={{
              position: "static",
              backgroundColor: "#2a2f32",
              height: 50,
            }}
          >
            <IconButton
              color="inherit"
              style={{ display: "flex", alignSelf: "flex-end" }}
              onClick={this.handleMenu}
              aria-controls="simple-menu" 
              aria-haspopup="true"
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              id={"fade-menu"}
              anchorEl={this.state.anchorEl}
              keepMounted
              open={open}
              onClose={this.handleMenu}
              className={classes.menu}
            >
              <MenuItem onClick={this.handleClose}>
                <Link className={classes.links} href="#">
                  Profile
                </Link>
              </MenuItem>
              <MenuItem onClick={this.handleClose}>
                <Link className={classes.links} href="#">
                  Options
                </Link>
              </MenuItem>
              <MenuItem onClick={this.handleClose}>
                <Link className={classes.links} href="/logout">
                  Logout
                </Link>
              </MenuItem>
            </Menu>
            <IconButton
              color="inherit"
              style={{
                position: "absolute",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <AccountCircle />
            </IconButton>
          </AppBar>

          <div
            id={"friends"}
            className={classes.friends}
            onClick={this.getMessages}
            role="region"
          >
            <div className={classes.tools}>
              <div
                aria-selected={this.state.isAriaSelected}
                role="option"
                style={{
                  position: "absolute",
                  width: "20%",
                  height: "11%",
                }}
              ></div>
              <PersonIcon size="small" style={{ marginRight: 10 }} />
              <Typography variant="body1">Friends</Typography>
            </div>
            {this.state.friends.map((friend) => (
              <div key={friend.name} className={classes.aria}>
                <div
                  aria-selected="false"
                  role="option"
                  name={friend.name}
                  style={{
                    position: "absolute",
                    width: "20%",
                    height: "11%",
                  }}
                  className={classes.select}
                ></div>
                <div
                  id={friend.name}
                  className={classes.status}
                  style={{ backgroundColor: friend.status }}
                ></div>

                <img
                  src={defaultAv}
                  width="30"
                  height="30"
                  style={{ borderRadius: "50%" }}
                />
                <p style={{ marginLeft: 15 }}>{friend.name}</p>
                <div
                  id={friend.id}
                  style={{ opacity: friend.notify >= 1 ? "1" : "0" }}
                  className={classes.notify}
                >
                  {friend.notify}
                </div>
              </div>
            ))}
          </div>
        </div>
        <HandleScreen
          isOpenScreens={this.state.isOpenScreens}
          reloadFriends={this.reloadFriends}
          friendData={this.state.friendData}
          friends={this.state.friends}
          updateFriendsPosition={this.updateFriendsPosition}
          messagesChat={this.state.messagesChat}
          getPositionFriends={this.getPositionFriends}
          updateNewMessage={this.updateNewMessage}
          sendNotify={this.sendNotify}
        />
      </div>
    );
  }
}
Chat.contextType = AppContext
export default hot(module)(withStyles(styles)(Chat));
