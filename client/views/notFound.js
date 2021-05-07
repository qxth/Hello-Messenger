import React from "react";
import { hot } from "react-hot-loader";

//#Material UI
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

const styles = {
  container: {
    backgroundColor: "#1f2428",
    minHeight: "100vh",
    display: "grid",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    fontFamily: "'sans-serif'",
    color: "#fff",
    "&>h1": {
      textAlign: "center",
      letterSpacing: "px",
      padding: "100px",
      fontSize: "1000%",
      fontWeight: "bold",
    },
    "&>p": {
      textAlign: "center",
      fontSize: "100%",
      position: "relative",
      bottom: "200px",
    },
    "&>h2": { fontSize: "40px", padding: "20px" },
  },
};

class Notfound extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <h1>404</h1>
        <p>
          Page does not exist! Unless you were looking for this error page, In
          which case you find it!
        </p>
      </div>
    );
  }
}

export default hot(module)(withStyles(styles)(Notfound));
