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
  Button,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

//#Material UI/Icons
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
} from "@material-ui/icons";

//#Extras
import Picker from "emoji-picker-react";
import routesApi from "./../../utils/routes-api";
import defaultAv from "./../img/icon.png";
import {Observable} from 'rxjs';
import {AppContext} from "./../../utils/app-context";

const styles = {
  "@global": {
    ".MuiButton-root": {
      cursor: "pointer",
      height: "36px",
      width: "137px",
      color: "#fff",
      backgroundColor: "#7289da",
      position: "relative",
      display: ["-webkit-box", "-ms-flexbox"],
      msFlexPack: "center",
      justifyContent: "center",
      WebkitBoxAlign: "center",
      msFlexAlign: "center",
      WebkitBoxSizing: "border-box",
      boxSizing: "border-box",
      background: "none",
      border: "none",
      borderRadius: "3px",
      padding: "2px 16px",
      textTransform: "none",
    },
    ".MuiButton-root:hover": {
      backgroundColor: "#5b6eae",
    },
    ".button-red":{
      backgroundColor: "rgba(67, 181, 129, 0.8)",
      "&:hover":{
        backgroundColor: "rgba(67, 181, 129, 0.6)"
      },
      "&:active":{
        backgroundColor: "rgba(67, 181, 129, 0.4)"
      }
    },
    ".button-green":{
      backgroundColor: "rgba(240, 71, 71, 0.8)",
      "&:hover":{
        backgroundColor: "rgba(240, 71, 71, 0.6)"
      },
      "&:active":{
       backgroundColor: "rgba(240, 71, 71, 0.4)" 
      }
    },
    ".MuiInputBase-root": {},
  },
  fondo: {
    backgroundColor: "#363942",
    minHeight: "100vh",
    display: "grid",
    backgroundSize: "cover",
    backgroundPosition: "center center",
  },
  form: {
    margin: "13px 0",
    position: "relative",
    borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.1)",
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: "0 16px",
    WebkitBoxOrient: "horizontal",
    WebkitBoxDirection: "normal",
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    WebkitBoxAlign: "center",
    height: 52,
    "&> input": {
      fontSize: "16px",
      fontWeight: 500,
      letterSpacing: ".04em",
      whiteSpace: "pre",
      backgroundColor: "transparent",
      WebkitBoxFlex: "1",
      msFlex: "1",
      flex: 1,
      color: "white",
      padding: "0",
      border: "0",
      marginRight: "16px",
      zIndex: 1,
      lineHeight: "52px",
      WebkitBoxDirection: "normal",
      width: "100%",
      border: "0",
      height: "1.1876em",
      margin: "0",
      padding: "6px 0 7px",
      minWidth: "0",
      boxSizing: "content-box",
      animationName: "mui-auto-fill-cancel",
      letterSpacing: "inherit",
      animationDuration: "10ms",
      WebkitTapHighlightColor: "transparent",
      "&:focus": {
        outline: 0,
      },
    },
    "&> button": {
      cursor: "pointer",
      height: "36px",
      width: "200px",
      color: "#fff",
      backgroundColor: "#7289da",
      position: "relative",
      display: ["-webkit-box", "-ms-flexbox"],
      msFlexPack: "center",
      justifyContent: "center",
      WebkitBoxAlign: "center",
      msFlexAlign: "center",
      WebkitBoxSizing: "border-box",
      boxSizing: "border-box",
      background: "none",
      border: "none",
      borderRadius: "3px",
      padding: "2px 16px",
      textTransform: "none",
      "&> span": {
        fontWeight: 500,
        lineHeight: "16px",
      },
    },
  },
  boxSearchFriends: {
    margin: 19,
  },
  tools: {
    color: "#9d9ea3",
    padding: 20,
    display: "flex",
    '&[aria-selected="true"]': {
      color: "rgb(199, 204, 207)",
      background: "rgb(2,0,36)",
      background:
        "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(1,0,10,0.6783088235294117) 0%, rgba(0,0,0,1) 100%, rgba(0,212,255,1) 100%)",
      WebkitTransition: ".4s all ease-in-out",
      MozTransition: ".4s all ease-in-out",
      OTransition: ".4s all ease-in-out",
      transition: ".4s all ease-in-out",
    },
    "&:hover": {
      color: "rgb(199, 204, 207)",
      background: "rgba(0, 0, 0, 0.04)",
      WebkitTransition: ".4s all ease-in-out",
      MozTransition: ".4s all ease-in-out",
      OTransition: ".4s all ease-in-out",
      transition: ".4s all ease-in-out",
    },
  },
  aria: {
    backgroundColor: "#141b23",
    borderRadius: 15,
    color: "#9d9ea3",
    cursor: "pointer",
    display: "flex",
    borderBottom: "1px solid #3c4144",
    alignItems: "center",
    paddingLeft: "20px",
    paddingRight: "20px",
    justifyContent: "space-between",
    height: "72px",
    '&[aria-selected="true"]': {
      color: "rgb(199, 204, 207)",
      background: "rgb(2,0,36)",
      background:
        "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(1,0,10,0.6783088235294117) 0%, rgba(0,0,0,1) 100%, rgba(0,212,255,1) 100%)",
      WebkitTransition: ".4s all ease-in-out",
      MozTransition: ".4s all ease-in-out",
      OTransition: ".4s all ease-in-out",
      transition: ".4s all ease-in-out",
    },
  },
};

class SearchFriends extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      friendRequest: [],
    };
    this.acceptObservable;
    this.observable;
    const {socket} = context;
    this.searchFriend = (e) => {
      e.preventDefault();
      const friend = document.querySelector("#nickname");
      console.log(friend);
      fetch(`${routesApi.addFriends}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname: friend.value }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message)
          if(data.message === "Friend request has been send"){
            friend.value = "";
            socket.emit("updateRemoteService", data.idFriend)
          }
        });
    };
    socket.on("updateRemoteService", () => {
      this.getFriendsRequest()
    })
    this.acceptFriendRequest = (e) => {
      e.preventDefault()
      const num = e.target.childNodes[0].defaultValue,
        accept = isNaN(num) ? -1 : num,
        nameDB = this.state.friendRequest.find(
        (e) => e.id == accept
      );
      if(nameDB.length !== 0){
        fetch(`${routesApi.acceptFriends}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idFriend: nameDB.id }),
        }).then((res) => {
          if(res.ok){
            this.acceptObservable.subscribe({
              next(x) { console.log("excecuting accept") },
              error(err) { console.error('something wrong occurred: ' + err); },
              complete() { console.log('done'); }
            });
            socket.emit("acceptNewFriend", nameDB.id)
            socket.emit("updateRemoteService", nameDB.id)
          }
        });
      }
    };
    socket.on("updateRemoteService", () => {
      this.observable.subscribe({
        next(x) { },
        error(err) { console.error('something wrong occurred: ' + err); },
        complete() { console.log('done'); }
      });
    })
    this.getFriendsRequest = () => {
      fetch(`${routesApi.stashFriends}`)
        .then((res) => res.json())
        .then((data) => {
          this.setState({friendRequest: []});
          for (let i of data.rows) {
            this.setState({
              friendRequest: [...this.state.friendRequest, { id: i.user_id, name: i.user_nickname }],
            });
            console.log("===Friend requests===")
            console.log(this.state.friendRequest)
            console.log("===========")
          }
        });
    };
    this.cancelFriendRequest = (e) => {
      e.preventDefault()
      console.log(e)
      const num = e.target.childNodes[0].defaultValue,
        cancel = isNaN(num) ? -1 : num,
        nameDB = this.state.friendRequest.find(
        (e) => e.id == cancel
      );
      console.log(nameDB);
      if(nameDB.length !== 0){
        fetch(`${routesApi.rejectFriends}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idFriend: nameDB.id }),
        })
        .then((e) => {
          if(e.ok)
            return this.getFriendsRequest();            
        })
      }
    };
  }
  componentDidMount() {
    const {reloadFriends, getPositionFriends, updateFriendsPosition}= this.props
    this.acceptObservable = new Observable(subscriber => {
      subscriber.next(reloadFriends())
      subscriber.next(this.getFriendsRequest())
      subscriber.next(getPositionFriends());
      subscriber.complete();
    });
    this.observable = new Observable(subscriber => {
      subscriber.next(reloadFriends())
      subscriber.next(getPositionFriends())
      subscriber.complete()
    })
    this.getFriendsRequest();
    this.context.socket.emit("leaveRoom")
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.fondo}>
        <div className={classes.boxSearchFriends}>
          <form onSubmit={this.searchFriend} className={classes.form}>
            <input
              required
              id={"nickname"}
              maxLength="34"
              placeholder="Ingrese un Nickname"
            />
            <Button type="submit">Add friend</Button>
          </form>
          <div id={"stash"}>
            {this.state.friendRequest.map((e)=>(
              <div key={e.id} className={classes.aria}>
                <div style={{display: "flex", alignItems:"center"}}>
                  <img 
                    src={defaultAv}
                    style={{borderRadius: "50%"}}
                    width="30"
                    height="30"
                  />
                  <p style={{marginLeft: 15}}>{e.name}</p>
                </div>
                <div style={{display:"flex"}}>
                  <form onSubmit={this.acceptFriendRequest}>
                    <input  style={{display:"none"}} defaultValue={e.id}/>
                    <button 
                      className="button-red MuiButtonBase-root MuiButton-root MuiButton-text" 
                      type="submit"
                    >
                      Añadir
                    </button>
                  </form>
                  <form onSubmit={this.cancelFriendRequest}>
                    <input style={{display:"none"}} defaultValue={e.id}/>
                    <button 
                      className="button-green MuiButtonBase-root MuiButton-root MuiButton-text" 
                      type="submit"
                    >
                      Cancelar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
SearchFriends.contextType = AppContext

export default hot(module)(withStyles(styles)(SearchFriends));
