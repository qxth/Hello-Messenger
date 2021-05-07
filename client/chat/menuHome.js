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
  Avatar,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import catIcon from './../img/cat-icon.png'

const styles = {
  section1: {
    width: "100%",
    display: "grid",
    "grid-template-columns": "repeat(4,1fr)",
    "grid-template-columns": "repeat(12,1fr)",
    "-webkit-box-sizing": "border-box",
    "box-sizing": "border-box",
    padding: "0 24px",
    paddingTop: "56px",
    paddingTop: "120px",
    paddingBottom: "56px",
    paddingBottom: "120px",
    zIndex: 1,
  },
  box: {
    gridColumn: "3/span 8",
    textAlign: "center",
    color: "white",
    "&>h1": {
      fontSize: 56,
      fontWeight: 700,
      lineHeight: "120%",
    },
    "&>div": {
      marginTop: 40,
      fontSize: 20,
      lineHeight: "32px",
    },
  },
  sectioncon: {
    backgroundSize: "cover",
    backgroundPosition: "bottom",
    backgroundImage:
      "url(https://cdn.statically.io/img/wallpaperaccess.com/full/1261770.jpg)",
    width: "100%",
    display: "-webkit-box",
    display: "-ms-flexbox",
    display: "flex",
    WebkitBoxAlign: "center",
    msFlexAlign: "center",
    alignItems: "center",
    WebkitBoxOrient: "vertical",
    WebkitBoxDirection: "normal",
    msFlexDirection: "column",
    flexDirection: "column",
  },
  containerDownload: {
    WebkitBoxPack: "center",
    msFlexPack: "center",
    justifyContent: "center",
    display: ["-webkit-box", "-ms-flexbox", "flex"],
    WebkitBoxAlign: "center",
    msFlexAlign: "center",
    alignItems: "center",
    msFlexWrap: "wrap",
    flexWrap: "wrap",
    "&>div": {
      marginRight: "24px",
      marginTop: "24px",
      position: "relative",
      "&>button": {
        color: "#23272a",
        lineHeight: "24px",
        cursor: "not-allowed",
        fontWeight: 500,
        display: "-webkit-inline-box",
        display: "-ms-inline-flexbox",
        display: "inline-flex",
        WebkitBoxAlign: "center",
        msFlexAlign: "center",
        alignItems: "center",
        WebkitBoxSizing: "border-box",
        boxSizing: "border-box",
        borderRadius: "28px",
        fontSize: "20px",
        padding: "16px 32px",
        "&>svg": {
          marginRight: 8,
        },
      },
    },
  },
};

class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.section1}>
          <div className={classes.box}>
            <h1>
              Hell
              <img
                style={{ width: 40, height: 40, borderRadius: "50%" }}
                alt="HelloMessengerLogo"
                src={catIcon}
              />{" "}
              Messenger
            </h1>
            <div>
              Puede seleccionar un chat o agregué nuevas personas para conocer y
              recuerde tener una conexión activa a internet.
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default hot(module)(withStyles(styles)(Menu));
