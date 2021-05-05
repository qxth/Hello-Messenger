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
  Divider
} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'

//#Material UI/Icons
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PersonAddIcon from '@material-ui/icons/PersonAdd';


//#Extras
import Talk from './talkChat'
import Menu from './menuHome'
import routesApi from '../../server/utils/routes-api'

//#Search Friends
import Search from './searchFriends'

const styles ={
  '@global': {
    '::-webkit-scrollbar': {
      width: 9,
    },
    '::-webkit-scrollbar-track':{
      background: '#323232'
    },
    '::-webkit-scrollbar-thumb': {
      background: '#1d2323',
      borderRadius: 20,
    },
  },
   fondo: {
    gridTemplateRows: "100%",
    gridTemplateColumns: "24% 76%",
     backgroundColor: '#1f2428',
     minHeight: '100vh',
     display: 'grid',
     backgroundSize: 'cover',
     backgroundPosition: 'center center',
   },
  icon: {
    borderRadius: "50%",
    marginTop: "2%",
  
  },
  contacts: {
    backgroundColor: "#33383b"
  },
  aria: {
    backgroundColor: "#141b23",
    color:"#9d9ea3",
    cursor:"pointer",
    display: "flex",
    borderBottom: "1px solid #3c4144", 
    alignItems: "center", 
    paddingLeft: "20px",
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
  tools: {
    cursor: "pointer",
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
      WebkitTransition: ".4s all ease-in-out",
      MozTransition: ".4s all ease-in-out",
      OTransition: ".4s all ease-in-out",
      transition: ".4s all ease-in-out"
    },
  }
}

class Chat extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isTyping: false,
      selected: false,
      chatSelected: false,
      friends: [],
      canal: true,
      user: null
    }
  this.menuChat = () => {
   if(!this.state.chatSelected) return(
    <React.Fragment>
      <Menu/>
    </React.Fragment>
    )
    return(
      <React.Fragment>
      <Talk chatSelected={this.state.chatSelected} user={this.state.user}/>
      </React.Fragment>
    )
  }
  this.aria = (e) => {
      const role = document.querySelectorAll('[aria-selected="true"]'), name = e.target.getAttribute('name');
      this.setState({chatSelected: `${name}`})
      role.forEach(role => {
        role.setAttribute('aria-selected', false)
      })
      e.target.setAttribute('aria-selected', true)
      const nameDB = this.state.friends.filter(e => e.name === name)
      console.log(nameDB)
      if(nameDB.length === 0) return this.setState({canal:false })
        this.setState({canal:true })
        fetch(routesApi.getChat,{
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({id: nameDB[0].id})
        })
        .then(res => res.json())
        .then(data => {
          const mensajesDiv = document.getElementById("mensajes");
          Socket.emit("create", {room: data.idChat, id: nameDB[0].id})
          if(data.error) return mensajesDiv.innerHTML = ""

          const json = data.dataChat.ChatData;
          json.shift()
          mensajesDiv.innerHTML = ""
          for(let data of json){
          let img = document.createElement("img")
          img.src= "https://www.pinclipart.com/picdir/middle/154-1548998_png-file-fa-user-circle-icon-clipart.png"
          img.width = "24"
          img.height = "24"
          img.style.borderRadius = "50%"
          img.style.marginTop = "1%"
          img.style.marginLeft = "1%"
          img.style.marginRight = "6px"
          let node = document.createElement("LI")
          let textnode = document.createTextNode(data.user)
          let node2 = document.createElement("LI")
          let textnode2 = document.createTextNode(data.message) 
          node2.style.marginTop = "10px"
          node2.style.marginLeft = "28px"

          node.appendChild(img)
          node.appendChild(textnode)
          node2.appendChild(textnode2)

          mensajesDiv.appendChild(node)
          mensajesDiv.appendChild(node2)
        }
        })
  }
  this.reloadChats = () => {
   fetch(routesApi.getAllFriends)
   .then(res => res.json())
   .then(data => {
    for(let i of data.friendsData){
      const div = document.createElement("DIV"), p = document.createElement("P"),
      img = document.createElement("img");
      div.setAttribute("name", `${i.nickname}`)
      div.setAttribute("aria-selected", this.state.selected)
      div.setAttribute("role", "option")
      div.setAttribute("class", `${this.props.classes.aria}`)
      img.src= "https://www.pinclipart.com/picdir/middle/154-1548998_png-file-fa-user-circle-icon-clipart.png"
      img.width="30"
      img.height="30"
      img.style.borderRadius="50%"
      p.style.marginLeft="15px"
      p.innerText= `${i.nickname}`
      this.setState({
        friends: [...this.state.friends, {id:i.id, name: i.nickname }]
      })
      div.appendChild(img)
      div.appendChild(p)
      console.log(this.state.friends)
      document.querySelector("#friends").appendChild(div)
    }
   })
  }

  }
 
  componentDidMount() {
    fetch(routesApi.verificarToken, {
      method: "GET"
    }).then(res => res.json())
    .then(data => {
      console.log(data)
      this.setState({user: data.data.nickname})
    })
    this.reloadChats() 
  }

render(){
  const {classes} = this.props;
  return (
    <div className={classes.fondo}>
    <div className={classes.contacts}>
    <AppBar style={{position: "static", backgroundColor: "#2a2f32", height: 46}}>
      <IconButton
        color="inherit"
        style={{display: "flex", alignSelf: "flex-end"}}
      >
      <MoreVertIcon/>
      </IconButton>
      <IconButton
        color="inherit"
        style={{position:"absolute", display: "flex", justifyContent: "end"}}
      >
        <AccountCircle />
      </IconButton>
      </AppBar>

      
      <div id="friends" onClick={this.aria} role="region">
      <div aria-selected={this.state.selected} className={classes.tools}>
      <PersonAddIcon size="small" style={{marginRight: 10}}/>
      <Typography variant="body1">Add Friends</Typography>
      </div>
      </div>
    </div>

   {this.state.canal ? <this.menuChat/> : <Search reloadChats={this.reloadChats}/>}

    </div>
  )
}

}


export default hot(module)(withStyles(styles)(Chat))
