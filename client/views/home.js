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

//# Components
import Footer from "../components/footer";
import Header from "../components/header";

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

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.sectioncon}>
          <Header />
          <div className={classes.section1}>
            <div className={classes.box}>
              <h1>Hello Messenger</h1>
              <div>
                En Hello Messenger podrás hablar con todos tus amigos y
                divertirse en un ambiente divertido y pasar mas tiempo juntos o
                simplemente conocer a nuevas personas.
              </div>
              <div className={classes.containerDownload}>
                <div>
                  <button disabled>
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <g fill="currentColor">
                        <path d="M17.707 10.708L16.293 9.29398L13 12.587V2.00098H11V12.587L7.70697 9.29398L6.29297 10.708L12 16.415L17.707 10.708Z"></path>
                        <path d="M18 18.001V20.001H6V18.001H4V20.001C4 21.103 4.897 22.001 6 22.001H18C19.104 22.001 20 21.103 20 20.001V18.001H18Z"></path>
                      </g>
                    </svg>
                    Descargar Hello Messenger
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default hot(module)(withStyles(styles)(Home));
