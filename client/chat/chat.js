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
import SendIcon from '@material-ui/icons/Send';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CallIcon from '@material-ui/icons/Call';
import VideoCallIcon from '@material-ui/icons/VideoCall';

//#Extras
import Picker from 'emoji-picker-react'


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
  channel: {
    display: "flex",
    border: '1px solid #3c4144',
    boxShadow: "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
    justifyContent: "space-between",
    '& > h6': {
      color: "#c7cccf",
      margin: 5,
      marginLeft: 10 
    }
  },
  input : {
    width: "76%",
    position: "fixed",
    backgroundColor: 'transparent',
    borderColor: "none",
    border: "1px solid #3c4144",
    '& > div': {
      border: "1px solid #3c4144",
      backgroundColor: 'transparent',
      color: '#a3a8ac',
    },
    '& .MuiInput-underline:after':{
      borderBottom: 0
    }
  },
   mensajes: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    '& > li': {
      maxWidth: 800,
      maxHeight: 200,
      color: "#c7cccf",
      padding: 0,
      overflowY: "auto"
    },
   },
  boxMensajes: {
   border: "2px solid #3c4144",
   minHeight: "88%",
   maxHeight: 500,
   overflowY: "auto",
   borderBottom: 1,
   borderTop: 1,
  },
  Typ: {
   margin: 0,
   position: 'fixed',
   bottom: 50,
   left: 50,
   right: 0,
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
    "&:hover":{
      color:"rgb(199, 204, 207)",
      background: "rgb(2,0,36)",
      background:"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(1,0,10,0.6783088235294117) 0%, rgba(0,0,0,1) 100%, rgba(0,212,255,1) 100%)",
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
      ShowEmojis: false,
      selected: false,
      chatSelected: "SELECT A CHAT",
      friends: []
    }
this.submit = () => {


    let val1 = sessionStorage.getItem("user")
    let val2 = document.getElementById("message").value

    let data = {
      user: val1,
      message: val2
    }
    document.getElementById("message").value = ''

    Socket.emit("message", data)
  }


  Socket.on("message", (msg) => {
    let img = document.createElement("img")
    img.src= "https://www.pinclipart.com/picdir/middle/154-1548998_png-file-fa-user-circle-icon-clipart.png"
    img.width = "24"
    img.height = "24"
    img.style.borderRadius = "50%"
    img.style.marginTop = "1%"
    img.style.marginLeft = "1%"
    img.style.marginRight = "6px"
    
    let node = document.createElement("LI")
    let textnode = document.createTextNode(`${msg.user}`)
    let node2 = document.createElement("LI")
    let textnode2 = document.createTextNode(`${msg.message}`) 
    node2.style.marginTop = "9px"
    node2.style.marginLeft = "30px"

    node.appendChild(img)
    node.appendChild(textnode)
    node2.appendChild(textnode2)
    
    document.getElementById("mensajes").appendChild(node)
    document.getElementById("mensajes").appendChild(node2)
   this.NoTyp()
  })

 this.NoTyp = () => {
    if(document.getElementById("message").value === ''){
    this.setState({isTyping: false})
     Socket.emit("NoTyping")
    }
  }
  Socket.on("NoTyping", () => {
      document.getElementById("istyping").textContent = ''
  })

  this.Typ = () => {
    let val1 = sessionStorage.getItem("user")
    if(document.getElementById("message").value != ''){ 
    this.setState({isTyping: true})
    Socket.emit("typing", val1)

    }
     }
  Socket.on("typing", (user) => {
    let val = document.getElementById("message").value 
      document.getElementById("istyping").textContent = `${user} esta escribiendo...`
  })

    this.IsTyping = (e) => {
   
    if (this.state.isTyping == false) {  
    this.setState({isTyping: true})
      this.Typ()
    }else{
      this.NoTyp()
    }
  }
 this.onEmojiClick = (e, emojiObject) => {
    let chosenEmoji = null
    chosenEmoji = emojiObject
    document.getElementById("message").value += chosenEmoji.emoji 
  }
  this.icons = () =>{
    if(this.state.ShowEmojis == false) return this.setState({ShowEmojis: true});
     this.setState({ShowEmojis: false})

  }
    this.aria = (e) => {
      const role = document.querySelectorAll('[aria-selected="true"]')
      this.setState({chatSelected: `${e.target.getAttribute('name')}`})
      role.forEach(role => {
        role.setAttribute('aria-selected', false)
      })
      e.target.setAttribute('aria-selected', true)
      console.log(e.target.getAttribute('name'))
    }

  }
 
  componentDidMount() {
    sessionStorage.setItem("user", "qxth")
   fetch('http://localhost:3000/api/friends')
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
        friends: [...this.state.friends, {id:i.id, name: i.nickname, data:[{}] }]
      })
      div.appendChild(img)
      div.appendChild(p)
      console.log(this.state.friends)
      document.querySelector("#friends").appendChild(div)
    }
   })
    
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
      <div className={classes.tools}>
      <PersonAddIcon size="small" style={{marginRight: 10}}/>
      <Typography variant="body1">Add Friends</Typography>
      </div>
      
      <div id="friends" onClick={this.aria} role="region">

   

      </div>
    </div>

    <div>
   <div className={classes.channel}>

     <Typography variant="h6">{this.state.chatSelected}</Typography>
          <IconButton color="inherit" style={{color:"gray", display: "flex", alignSelf: "flex-end"}}>
            <CallIcon style={{marginRight: 10}}/>
            <VideoCallIcon style={{marginRight: 10}}/>
          </IconButton>
    </div>
    <div className={classes.boxMensajes}> 
    <ul className={classes.mensajes} id="mensajes">
    	
    </ul>

    </div>
   { this.state.ShowEmojis ? <Picker onEmojiClick={this.onEmojiClick} pickerStyle={{bottom: '60px', position: 'fixed' }}/> :  <></> }
      <Typography className={classes.Typ} variant="h1" id="istyping"></Typography>

    <div className={classes.Typer}>  

        <TextField
    	type="text"
    	id="message"
    	autoComplete="off"
    	name="message"
    	placeholder="Envie un mensaje"
    	onKeyPress={this.IsTyping}
    	className={classes.input}
    	InputProps={{
	  startAdornment: (
	    <InputAdornment position='start'>
	    <IconButton
      color="inherit"
      onClick={this.icons}
      >
	    <InsertEmoticonIcon/>
	    </IconButton>
	    </InputAdornment>
	  ),
	  endAdornment: (
	    <InputAdornment position='end'>
	    <IconButton 
      color="inherit"
      onClick={this.submit}>
	    	<SendIcon />
	    </IconButton>
	    </InputAdornment>
	  ),
	}}
      /> 
      </div>
       </div>
    </div>
  )
}

}


export default hot(module)(withStyles(styles)(Chat))
