import React from 'react';
import { hot } from 'react-hot-loader'

//#SocketIO
import Socket from './Socket'
import io from 'socket.io-client'

//Material UI
import {
  TextField, Container, Typography,
  List, ListItem, ListItemText,
  AppBar, InputAdornment, IconButton,
  Divider, Button
} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'

//#Material UI/Icons
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon 
} from '@material-ui/icons';


//#Extras
import Picker from 'emoji-picker-react'


const styles ={
  '@global': {
    ".MuiButton-root":{
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
    ".MuiButton-root:hover":{
      backgroundColor: "#5b6eae",
    },  
    ".MuiInputBase-root":{

    },
  },
  fondo:{
     backgroundColor: '#363942',
     minHeight: '100vh',
     display: 'grid',
     backgroundSize: 'cover',
     backgroundPosition: 'center center',

  },
  form:{
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
     "&> input":{
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
        "width": "100%",
        "border": "0",
        "height": "1.1876em",
        "margin": "0",
        "padding": "6px 0 7px",
        "minWidth": "0",
        "boxSizing": "content-box",
        "animationName": "mui-auto-fill-cancel",
        "letterSpacing": "inherit",
        "animationDuration": "10ms",
        "WebkitTapHighlightColor": "transparent",
        "&:focus":{
          outline:0
        },
      },
    "&> button":{
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
        "&> span":{
          fontWeight: 500,
          lineHeight: "16px",
        },
    },
  },
  boxSearchFriends:{
    margin: 19
  },
  tools: {
    color:"#9d9ea3",
    padding: 20,
    display: "flex",
    '&[aria-selected="true"]':{
      color:"rgb(199, 204, 207)",
      background: "rgb(2,0,36)",
      background:"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(1,0,10,0.6783088235294117) 0%, rgba(0,0,0,1) 100%, rgba(0,212,255,1) 100%)",
      WebkitTransition: ".4s all ease-in-out",
      MozTransition: ".4s all ease-in-out",
      OTransition: ".4s all ease-in-out",
      transition: ".4s all ease-in-out"
    },
    "&:hover":{
      color:"rgb(199, 204, 207)",
      background:"rgba(0, 0, 0, 0.04)",
      WebkitTransition: ".4s all ease-in-out",
      MozTransition: ".4s all ease-in-out",
      OTransition: ".4s all ease-in-out",
      transition: ".4s all ease-in-out"
    },
  },
  aria: {
  backgroundColor: "#141b23",
  borderRadius: 15,
  color:"#9d9ea3",
  cursor:"pointer",
  display: "flex",
  borderBottom: "1px solid #3c4144", 
  alignItems: "center", 
  paddingLeft: "20px",
  paddingRight: "20px",
  justifyContent: "space-between",
  height: "72px",
  '&[aria-selected="true"]':{
    color:"rgb(199, 204, 207)",
    background: "rgb(2,0,36)",
    background:"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(1,0,10,0.6783088235294117) 0%, rgba(0,0,0,1) 100%, rgba(0,212,255,1) 100%)",
    WebkitTransition: ".4s all ease-in-out",
    MozTransition: ".4s all ease-in-out",
    OTransition: ".4s all ease-in-out",
    transition: ".4s all ease-in-out"
  },
},

}

class SearchFriends extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      stash:[]
    }
    this.searchFriends = (e) => {
      e.preventDefault()
      const friend = document.querySelector("#nickname").value
      console.log(friend)
      fetch('/api/addfriends',{
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({nickname: friend})
      })
      .then(res => res.json())
      .then(data => {
        switch(data.msg){
          case "No se ha encontrado el usuario":
            alert("No se ha encontrado el usuario")
          break; 
          case "El usuario que intenta agregar ya es su amigo o ya le ha mandado solicitud":
            alert("El usuario que intenta agregar ya es su amigo o ya le ha mandado solicitud")
          break;
          case "Se ha mandado solicitud":
            window.location.reload()
            alert("Se ha mandado solicitud!")
        }
    })
  }
  this.accept = (e) => {

    const nameDB = this.state.stash.filter(t => t.name === e.target.getAttribute('name'))
    fetch("/api/acceptfriends", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({idFriend: nameDB[0].id})
    }).then(res => {
      window.location.reload()
      if(res.status == 200) return console.log("Ah aceptado a su amigo correctamente")
    })
  }
  this.loadFriends = () => {
     fetch('/api/stashfriends')
   .then(res => res.json())
   .then(data => {
    console.log(data)
    for(let i of data.result){
      const div = document.createElement("DIV"), p = document.createElement("P"),
      img = document.createElement("img"), divUser = document.createElement("DIV"),divButton = document.createElement("DIV"), 
      buttonAccept = document.createElement("BUTTON"), buttonCancel = document.createElement("BUTTON");
      div.setAttribute("aria-selected", this.state.selected)
      div.setAttribute("role", "option")
      div.setAttribute("class", `${this.props.classes.aria}`)
      buttonCancel.setAttribute("class", "MuiButtonBase-root MuiButton-root MuiButton-text")
      buttonAccept.setAttribute("class", "MuiButtonBase-root MuiButton-root MuiButton-text")
      buttonAccept.addEventListener('click', this.accept)
      buttonCancel.addEventListener('click', this.cancel)
      buttonAccept.setAttribute("name", `${i.nickname}`)
      buttonCancel.setAttribute("name", `${i.nickname}`)


      img.src= "https://www.pinclipart.com/picdir/middle/154-1548998_png-file-fa-user-circle-icon-clipart.png"
      img.width="30"
      img.height="30"
      img.style.borderRadius="50%"
      divUser.style.display ="flex"
      divUser.style.alignItems ="center"
      buttonAccept.style.backgroundColor = "#43b581"
      buttonCancel.style.backgroundColor = "#f04747"
      buttonAccept.innerHTML = "Añadir"
      buttonCancel.innerHTML= "Cancelar"
      p.style.marginLeft="15px"
      p.innerText= `${i.nickname}`
      this.setState({
        stash: [...this.state.stash, {id:i.id, name: i.nickname }]
      })
      divUser.appendChild(img)
      divUser.appendChild(p)
      divButton.appendChild(buttonAccept)
      divButton.appendChild(buttonCancel)
      div.appendChild(divUser)      
      div.appendChild(divButton)
      console.log(this.state.stash)
      document.querySelector("#stash").appendChild(div)
    }
   })
  }
  this.cancel = (e) => {
    const nameDB = this.state.stash.filter(t => t.name === e.target.getAttribute('name'))
    console.log(nameDB)
    fetch("/api/rejectfriends", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({idFriend: nameDB[0].id})
    })
    return window.location.reload()
    
  }
}
   componentDidMount() {
    this.loadFriends()
  
  }

render(){
  const {classes} = this.props;
  return (
      <div className={classes.fondo}>
        <div className={classes.boxSearchFriends}>

        <form onSubmit={this.searchFriends} className={classes.form}>
        <input required id="nickname" maxLength="34" placeholder="Ingrese un Nickname"/>
        <Button type="submit">Add friend</Button>
        </form>
        <div id="stash"></div> 
        </div>
      </div>
    )
}
}


export default hot(module)(withStyles(styles)(SearchFriends))