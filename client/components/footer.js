import React from "react";
import { hot } from "react-hot-loader";

// #Material UI
import {
  IconButton, Typography, Toolbar, 
  AppBar, Avatar, Link, Button,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  navbar: {
    backgroundColor: "#000d2d",
    boxShadow: "none",
    "-webkit-box-sizing": "border-box",
    boxSizing: "border-box",
    paddingTop: 80,
    paddingBottom: 64,
    "&>div":{
      display: "-webkit-box", 
      display: "-ms-flexbox", 
      display: "flex",
      WebkitBoxAlign: "center",
      msFlexAlign: "center",
      alignItems: "center",
      WebkitBoxOrient: "vertical",
      WebkitBoxDirection: "normal",
      msFlexDirection: "column",
      flexDirection: "column"
    }
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
  row:{
    width: "100%",
    maxWidth: 1260,
    "-webkit-box-sizing": "border-box",
    boxSizing: "border-box",
    display: "grid",
    gridTemplateColumns: "repeat(12,1fr)",
    gridTemplateColumns: "repeat(12,1fr)",
    gap: "0 20px",
    padding: "0 40px",
  },
  contNavbar:{
    gridColumn: "span 12",
  },
  contLine:{
    width: "100%",
    height: 1,
    marginBottom: 32,
    backgroundColor: "#7289da"
  },
  contBarSup:{
    display: "-webkit-box",
    display: "-ms-flexbox",
    display: "flex",
    "-webkit-box-align": "center",
    "-ms-flex-align": "center",
    alignItems: "center",
    "-webkit-box-pack": "justify",
    "-ms-flex-pack": "justify",
    justifyContent: "space-between"
  },
  section:{
    gridColumn: "span 2",
    marginBottom: 40,
    "&>h5":{
      color: "#7289da",
      paddingTop: 8,
      fontSize: 16,
      margin: 0,
      lineHeight: "24px",
    },
    "&>a": {
      color: "inherit",
      marginTop: 8,
      display: "block"
    },
  },
  sectionInfo: {
    gridColumn: "span 3",
    gridRowEnd: "span 2",
    WebkitBoxOrient: "vertical",
    WebkitBoxDirection: "normal",
    msFlexDirection: "column",
    flexDirection: "column",
    WebkitBoxFlex: "1",
    msFlexPositive: "1",
    flexGrow: 1,
    marginBottom: "56px",
    display: "flex",
    "&>h4": {
      color: "#7289da",
      fontWeight: 600,
      fontSize: "32px",
      lineHeight: "120%",
    }
  },
  separator: {
    gridColumn: "span 1",
    gridRowEnd: "span 2",
    display: "initial",
  }
};

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <AppBar className={classes.navbar} position="static">
          <Toolbar variant="dense">
            <div className={classes.row}>
                <div className={classes.sectionInfo}>
                  <h4>Hello Messenger</h4>
                </div>
                <div className={classes.separator}>

                </div>
                <div className={classes.section}>
                  <h5>Rutas</h5>
                  <Link href="/">Inicio</Link>
                  <Link href="/login">Iniciar sesión</Link>
                  <Link href="/register">Registrarse</Link>
                  <Link>Descargar</Link>
                </div>
                <div className={classes.section}>
                  <h5>Recursos</h5>
                  <Link>Blog</Link>
                  <Link>Trabajos</Link>
                  <Link>Acerca de</Link>
                  <Link>Tienda</Link>
                  <Link>Apoyanos</Link>
                  <Link>Github</Link>
                </div>
                <div className={classes.section}>
                  <h5>Politicas</h5>
                  <Link>Licencias</Link>
                  <Link>Privacidad</Link>
                  <Link>Condiciones</Link>
                  <Link>FAQ</Link>
                </div>
              <div className={classes.buttons}>
              </div>
            </div>
            <div className={classes.row}>
              <div className={classes.contNavbar}>
                <div className={classes.contLine}></div>
                <div className={classes.contBarSup}>
                  <div style={{ alignItems: "center", display: "flex"}}> 
                    <IconButton
                      edge="start"
                      className={classes.menuButton}
                      color="inherit"
                      aria-label="menu"
                    >
                      <Avatar
                        alt="HelloMessengerLogo"
                        src={this.props.catIcon}
                      />
                    </IconButton>
                    <Typography variant="h6" color="inherit">
                      Hello Messenger
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}

export default hot(module)(withStyles(styles)(Footer));
