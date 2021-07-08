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
  Divider,
  Menu,
  MenuItem,
  Fade,
  Link,
} from "@material-ui/core";
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
import routesApi from "../../server/utils/routes-api";
import defaultAv from "./../img/icon.png";
import Messenger from "./messenger";
import { Socket } from "./Socket";

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
  constructor(props) {
    super(props);
    this.state = {
      isTyping: false,
      selected: false,
      chatSelected: false,
      friends: [],
      actualChat: [],
      canal: true,
      user: null,
      anchorEl: null,
    };
    this.handleClick = (e) => {
      this.setState({
        anchorEl: e.currentTarget,
      });
    };
    this.handleClose = () => {
      this.setState({
        anchorEl: null,
      });
    };
    this.aria = (e) => {
      const role = document.querySelectorAll('[aria-selected="true"]'),
        name = e.target.getAttribute("name");
      if (e.target.getAttribute("aria-selected") === "false") {
        role.forEach((role) => {
          role.setAttribute("aria-selected", false);
        });
        e.target.setAttribute("aria-selected", true);
        const nameDB = this.state.friends.filter((e) => e.name === name);
        console.log(nameDB);
        this.setState({ chatSelected: "SearchFriends" });
        if (nameDB.length === 0) return this.setState({ canal: false });
        this.setState({
          canal: true,
          pos: `${nameDB[0].id}`,
          chatSelected: `${nameDB[0].name}`,
        });
        fetch(routesApi.getChat, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: nameDB[0].id }),
        })
          .then((res) => res.json())
          .then((data) => {
            Socket.emit("create", {
              room: data.idChat,
              id: nameDB[0].id,
            });
            const newFriends = Array.from(this.state.friends);
            newFriends[newFriends.findIndex((e) => e.id === nameDB[0].id)] = {
              id: nameDB[0].id,
              name: nameDB[0].name,
              notify: 0,
            };
            document.getElementById(`${nameDB[0].id}`).style.opacity = "0";
            if (data.error) return;
            this.setState({
              friends: newFriends,
              actualChat: [],
            });
            const json = data.dataChat.ChatData;
            json.shift();
            this.setState({
              actualChat: json,
              friends: newFriends,
            });
          });
      }
    };
    this.checkRoom = () => {
      Socket.emit("checkRoom");
    }
    Socket.on("checkRoom", (n) => {
      const data = document.getElementById(`${n.id}`);
      data.style.opacity = "1";
      data.innerHTML = `${n.notify}`;
      this.friendsPosition(n.id);
    });
    this.reloadChats = () => {
      fetch(routesApi.getAllFriends)
        .then((res) => res.json())
        .then(async (data) => {
          this.setState({
            friends: [],
          });
          for (let i of data.friendsData) {
            Socket.emit("newMessage", { id: i.id, name: i.nickname });
          }
        });
    };
    Socket.on("newMessage", (n) => {
      this.setState({
        friends: [
          ...this.state.friends,
          { id: n.id, name: n.nickname, notify: n.notify },
        ],
      });
      console.log(this.state.friends);
    });
    this.requireLastUpdate = () => {
      Socket.emit("requireLastUpdate");
    };
    Socket.on("requireLastUpdate", (arr) => {
      console.log("Updating chats...");
      console.log(arr);
      console.log("====state friends====");
      console.log(this.state.friends);
      if (arr !== null) {
        let currentArr = [],
          array = JSON.parse(arr),
          friends = Array.from(this.state.friends);
        console.log(array);
        for (let i = 0; i < friends.length; i++) {
          if (array[i] !== undefined) {
            console.log("array", array);
            console.log("arraypos", array[i].id);
            const posEl = this.state.friends.findIndex(
              (ev) => ev.id === array[i].id
            );
            console.log("Position:", posEl);
            console.log("this.state.friends:", this.state.friends[posEl]);
            console.log("==current Array id===");
            console.log(array[i]);
            console.log("counter:", i);
            if (posEl !== -1) {
              console.log("push:", this.state.friends[posEl]);
              currentArr.push(this.state.friends[posEl]);
            }
          }
        }
        for (const i of this.state.friends) {
          const newPos = currentArr.findIndex((ev) => ev.id === i.id);
          if (newPos == -1) {
            currentArr.push(i);
          }
        }
        this.setState({
          friends: currentArr,
        });
        console.log(currentArr);
        console.log(this.state.friends);
      }
    });

    this.statusChecker = () => {
      this.interval = setInterval(() => {
        const friends = Array.from(this.state.friends);
        for (let i of friends) {
          Socket.emit("checkOnline", { id: i.id, nickname: i.name });
        }
      }, 10000);
    };
    Socket.on("checkOnline", async (status) => {
      document.querySelector(
        `#${status.nickname}`
      ).style.backgroundColor = `${status.status}`;
    });
    this.friendsPosition = (chatSelected) => {
      const newArr = Array.from(this.state.friends),
        nameDB = this.state.friends.findIndex(
          (e) => e.id === parseInt(chatSelected)
        );
      console.log(chatSelected);
      if (nameDB !== -1) {
        console.log(this.state.friends[nameDB].name);
        newArr.splice(nameDB, 1);
        newArr.unshift(this.state.friends[nameDB]);
        this.setState({
          friends: newArr,
        });
        console.log(newArr);
      }
    };
  }

  componentDidMount() {
    fetch(routesApi.verificarToken, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data);
        this.setState({ user: data.data.nickname });
        //Socket.emit("online", data.data.id);
        Socket.emit("online", data.data.id);
        setTimeout(() => {
          this.reloadChats();
        }, 3000);
        setTimeout(() => {
          this.requireLastUpdate();
        }, 5000);
        this.statusChecker();
      });
  }
  componentWillUnmount() {
    clearInterval(this.interval);
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
              onClick={this.handleClick}
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
              onClose={this.handleClose}
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
            onClick={this.aria}
            role="region"
          >
            <div className={classes.tools}>
              <div
                aria-selected={this.state.selected}
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
            {this.state.friends.map((val) => (
              <div key={val.name} className={classes.aria}>
                <div
                  aria-selected="false"
                  role="option"
                  name={val.name}
                  style={{
                    position: "absolute",
                    width: "20%",
                    height: "11%",
                  }}
                  className={classes.select}
                ></div>
                <div
                  id={val.name}
                  className={classes.status}
                  style={{ backgroundColor: val.status }}
                ></div>

                <img
                  src={defaultAv}
                  width="30"
                  height="30"
                  style={{ borderRadius: "50%" }}
                />
                <p style={{ marginLeft: 15 }}>{val.name}</p>
                <div
                  id={val.id}
                  style={{ opacity: val.notify >= 1 ? "1" : "0" }}
                  className={classes.notify}
                >
                  {val.notify}
                </div>
              </div>
            ))}
          </div>
        </div>
        <HandleScreen
          canal={this.state.canal}
          reloadChats={this.reloadChats}
          socket={Socket}
          defaultAv={defaultAv}
          chatSelected={this.state.chatSelected}
          user={this.state.user}
          pos={this.state.pos}
          friends={this.state.friends}
          friendsPosition={this.friendsPosition}
          actualChat={this.state.actualChat}
          requireLastUpdate={this.requireLastUpdate}
          checkRoom={this.checkRoom}
        />
      </div>
    );
  }
}

export default hot(module)(withStyles(styles)(Chat));
