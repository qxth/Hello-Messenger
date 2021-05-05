import React from "react";
import { hot } from "react-hot-loader";

//#Material UI
import {
  IconButton,
  Typography,
  Toolbar,
  AppBar,
  Avatar,
  Link,
  Button,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { withStyles } from "@material-ui/core/styles";
import routerApi from "./../../server/utils/routes-api";

const styles = {
  navbar: {
    backgroundColor: "transparent",
    boxShadow: "none",
    "-webkit-box-sizing": "border-box",
    boxSizing: "border-box",
    padding: "0 24px",
  },
  links: {
    WebkitBoxFlex: "1",
    msFlex: "1 1 auto",
    flex: "1 1 auto",
    textAlign: "center",
    fontSize: "16px",
    lineHeight: "140%",
    fontWeight: 600,
    "&>a": {
      color: "#fff",
      margin: 10,
      padding: 10,
    },
  },
  buttons: {
    WebkitBoxFlex: "0",
    msFlex: "0 0 auto",
    flex: "0 0 auto",
    width: "124px",
    textAlign: "end",
    display: ["-webkit-box", "-ms-flexbox", "flex"],
    WebkitBoxOrient: "horizontal",
    WebkitBoxDirection: "reverse",
    msFlexFlow: "row-reverse",
    flexFlow: "row-reverse",
    "&>a": {
      whiteSpace: "nowrap",
      borderRadius: "40px",
      fontSize: "14px",
      padding: "7px 16px",
      backgroundColor: "#fff",
      color: "#23272a",
      lineHeight: "24px",
      cursor: "pointer",
      fontWeight: 500,
      display: "-webkit-inline-box",
      display: "-ms-inline-flexbox",
      display: "inline-flex",
      WebkitBoxAlign: "center",
      msFlexAlign: "center",
      alignItems: "center",
      WebkitBoxSizing: "border-box",
      boxSizing: "border-box",
      textDecoration: "none",
    },
  },
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: false,
    };
    this.Routes = () => {
      console.log(this.state.routes);
      if (this.state.routes == true)
        return (
          <React.Fragment>
            <a href="/chat">Abrir Messenger</a>
          </React.Fragment>
        );
      return (
        <React.Fragment>
          <a href="/login">Iniciar sesión</a>
        </React.Fragment>
      );
    };
  }

  componentDidMount() {
    fetch(`${routerApi.verificarToken}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("================");
        console.log(data);
        console.log("======================");
        if (data.data !== false)
          return this.setState({
            routes: true,
          });
      });
  }
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <AppBar className={classes.navbar} position="static">
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <Avatar
                alt="HelloMessengerLogo"
                src="https://toppng.com/uploads/preview/free-download-cat-png-vector-icon-cat-transparent-background-cat-icon-transparent-background-11563035549ypnlilorb5.png"
              />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Hello Messenger
            </Typography>
            <div className={classes.links}>
              <Link>Soporte técnico</Link>
              <Link>Seguridad</Link>
              <Link>Apoyanos</Link>
              <Link>Github</Link>
              <Link>FAQ</Link>
            </div>
            <div className={classes.buttons}>
              <this.Routes />
            </div>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}

export default hot(module)(withStyles(styles)(Header));
