import React from 'react';
import { hot } from 'react-hot-loader';

//#Material UI
import {
  TextField, Container, Typography,
  List, ListItem, ListItemText,
  AppBar, InputAdornment, IconButton,
  Divider, Button
} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles'

const styles ={}

class Login extends React.Component {
  constructor(props){
    super(props)
    this.state = {}
    this.submit = (e) => {
    	e.preventDefault()
        fetch('/api/login',{
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
          	nickname: document.querySelector("#user").value,
          	password: document.querySelector("#pass").value
          })
      	}).then(res => {
          	if(res.status === 200) return alert("go to chat :)")
          })	
    	}

  }
  render(){
	return (
		<div>
		<form onSubmit={this.submit}>
		<TextField type="text" id="user"/>
		<TextField type="password" id="pass"/>
		<Button type="submit">Send form</Button>
		</form>
		</div>
	)  	
  }

}

export default hot(module)(withStyles(styles)(Login))