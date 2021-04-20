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

  }
  render(){
	return (
		<div>
    <h1>Not found 404</h1>
		</div>
	)  	
  }

}

export default hot(module)(withStyles(styles)(Login))