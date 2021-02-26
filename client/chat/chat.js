import React, 
  { useState,
    useEffect
  } from 'react';
import Picker from 'emoji-picker-react'
import { hot } from 'react-hot-loader'
import {
  TextField,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core'
import Socket from './Socket'
import {
  withStyles
} from '@material-ui/core/styles'
import SendIcon from '@material-ui/icons/Send';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import io from 'socket.io-client'


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
     backgroundColor: '#484545',
     minHeight: '100vh',
     display: 'grid',
     backgroundSize: 'cover',
     backgroundPosition: 'center center',
   },
  channel: {
    border: '2px solid',
    marginTop: 20,
    '& > h6': {
      margin: 5,
      marginLeft: 10 
    }
  },
  input : {
    width: 1230,
    color: 'white',
    backgroundColor: 'transparent',
    borderColor: "none",
    '& > div': {
      backgroundColor: '#63686E'
    },
  },
   mensajes: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    '& > li': {
      maxWidth: 1100,
      maxHeight: 200,
      padding: 0,
      overflowY: "auto"
    },
   },
  boxMensajes: {
   border: "2px solid",
   positionBottom: 550,
   minHeight: 530,
   maxHeight: 530,
   marginBottom: 30,
   overflowY: "auto"
  },
  Typ: {
   margin: 0,
   position: 'fixed',
   bottom: 50,
   left: 50,
   right: 0,
  },
  Typer: {
    position: 'fixed',
    bottom: 10,
    display: 'flex',
    align: 'center',
 
  },
  icon: {
    borderRadius: "50%",
    marginTop: "2%",
  
  },
}

class Chat extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isTyping: false,
      ShowEmojis: false
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
    node2.style.marginTop = "10px"
    node2.style.marginLeft = "28px"

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
    if(this.state.ShowEmojis == false){
      this.setState({ShowEmojis: true})
    }else{
     this.setState({ShowEmojis: false})
    }
  }


  }
 
  componentDidMount() {
    let user = prompt("Ingrese su nombre")
    sessionStorage.setItem("user", user)
    Socket.emit("create", "General")
    fetch('http://localhost:3000/api/chat', {
      method: 'GET'
    }).then(res => res.json())
      .then(data => {
	let json = data[0].ChatData
	let i;
	for(i = 0; i<json.length; i++){
 let img = document.createElement("img")
    img.src= "https://www.pinclipart.com/picdir/middle/154-1548998_png-file-fa-user-circle-icon-clipart.png"
    img.width = "24"
    img.height = "24"
    img.style.borderRadius = "50%"
    img.style.marginTop = "1%"
    img.style.marginLeft = "1%"
    img.style.marginRight = "6px"
    
    let node = document.createElement("LI")
    let textnode = document.createTextNode(json[i].user)
    let node2 = document.createElement("LI")
    let textnode2 = document.createTextNode(json[i].message) 
    node2.style.marginTop = "10px"
    node2.style.marginLeft = "28px"

    node.appendChild(img)
    node.appendChild(textnode)
    node2.appendChild(textnode2)
    
    document.getElementById("mensajes").appendChild(node)
    document.getElementById("mensajes").appendChild(node2)

	}
      })

  }

render(){
  const {classes} = this.props;
  return (
    <div className={classes.fondo}>
    <Container className={classes.container}>
   <div className={classes.channel}>
     <Typography variant="h6">@Global</Typography>
    </div>
    <div className={classes.boxMensajes}> 
    <ul className={classes.mensajes} id="mensajes">
    	
    </ul>

    </div>
   { this.state.ShowEmojis ? <Picker onEmojiClick={this.onEmojiClick} pickerStyle={{bottom: '60px', position: 'fixed' }}/> :  <></> }
      <Typography className={classes.Typ} variant="body2" id="istyping"></Typography>

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
	    <IconButton>
	    <InsertEmoticonIcon onClick={this.icons}/>
	    </IconButton>
	    </InputAdornment>
	  ),
	  endAdornment: (
	    <InputAdornment position='end'>
	    <IconButton onClick={this.submit}>
	    	<SendIcon />
	    </IconButton>
	    </InputAdornment>
	  ),
	}}
      /> 

       </div>
    </Container>
    </div>
  )
}

}


export default hot(module)(withStyles(styles)(Chat))
