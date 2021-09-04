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
  MenuItem,
  Select,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

//#Extras
import routesApi from "./../../utils/routes-api";
import formBackground from "./../img/formBackground.jpg";

const styles = {
  container: {
    height: "100vh",
    backgroundImage:
      `url(${formBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "bottom",
  },
  form: {
    maxWidth: "320px",
    width: "90%",
    backgroundColor: "rgba(33, 37, 48, 0.7)",
    padding: "40px",
    backdropFilter: "blur(10px)",
    "-webkit-backdrop-filter": "blur(10px)",
    borderRadius: "4px",
    transform: "translate(-50%, -50%)",
    position: "absolute",
    top: "50%",
    left: "50%",
    color: "#fff",
    boxShadow: "3px 3px 4px rgba(0,0,0,0.2)",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  formControl: {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid #434a52",
    borderRadius: "0",
    boxShadow: "none",
    outline: "none",
    color: "inherit",
    display: "block",
    width: "92%",
    height: "calc(2.25rem + 2px)",
    padding: ".375rem .75rem",
    fontSize: "1rem",
    lineHeight: 1.5,
    transition: "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
    "&>option": {
      backgroundColor: "rgba(33, 37, 48, 0.7)",
      color: "white",
      cursor: "pointer",
      border: "none",
      outline: "none"
    },
  },
  btnPrimary: {
    fontWeight: 400,
    textAlign: "center",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none",
    fontSize: "1rem",
    lineHeight: 1.5,
    transition:
      "color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out",
    backgroundColor: "#7289da",
    border: "none",
    borderRadius: "4px",
    padding: "11px",
    boxShadow: "none",
    marginTop: "26px",
    textShadow: "none",
    outline: "none",
    display: "block",
    color: "white",
    width: "100%",
    "&:hover": {
      background: "#677bc4",
      outline: "none",
    },
    "&:active": {
      background: "#5b6eae",
      outline: "none",
      transform: "translateY(1px)",
    },
  },
  forgot: {
    display: "block",
    textAlign: "center",
    fontSize: "12px",
    color: "#6f7a85",
    opacity: 0.9,
    textDecoration: "none",
    "&:hover": {
      opacity: 1,
      textDecoration: "none",
    },
    "&:active": {
      opacity: 1,
      textDecoration: "none",
    },
  },
};

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
    };
    this.submit = (e) => {
      e.preventDefault();
      const dc = document,
        pass = dc.querySelector("#pass").value,
        passR = dc.querySelector("#repeatPass").value;
      if (pass !== passR) 
        return alert("Passwords don't match");
      fetch(routesApi.createUser, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: dc.querySelector("#username").value,
          password: pass,
          pregunta: parseInt(dc.querySelector("#question").value),
          respuesta: dc.querySelector("#answer").value,
          }),
        })
        .then((res) => res.json())
        .then((data) => {
          if (data.status !== 201) 
            return alert("Your username is taken please choose another");
          return this.props.history.push("/login");
        });
    };
  }
  componentDidMount() {
    fetch(routesApi.getQuestions)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          questions: data.questions,
        });
      });
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <form className={classes.form} onSubmit={this.submit}>
          <div className={classes.formGroup}>
            <h2>Register</h2>
          </div>
          <div className={classes.formGroup}>
            <input
              required
              className={classes.formControl}
              minLength={"3"}
              maxLength={"30"}
              type="text"
              id={"username"}
              placeholder="Username"
            />
          </div>
          <div className={classes.formGroup}>
            <input
              required
              className={classes.formControl}
              minLength={"8"}
              maxLength={"50"}
              type={"password"}
              name={"password"}
              id={"pass"}
              placeholder="Password"
            />
          </div>
          <div className={classes.formGroup}>
            <input
              required
              className={classes.formControl}
              minLength={"8"}
              maxLength={"50"}
              type="password"
              name={"password"}
              id={"repeatPass"}
              placeholder="Repeat your password"
            />
          </div>
          <div className={classes.formGroup}>
            <select
              required
              id={"question"}
              style={{ 
                width: "100%",
                "&>*": {
                  backgroundColor: "rgba(33, 37, 48, 0.7)",
                  color: "white",
                  cursor: "pointer",
                  border: "none",
                  outline: "none"
                },
              }}
              className={classes.formControl}
            >
              {this.state.questions.map((val) => (
                <option key={val.name} value={val.value}>
                  {val.name}
                </option>
              ))}
            </select>
          </div>
          <div className={classes.formGroup}>
            <input
              minLength={"1"}
              maxLength={"100"}
              required
              className={classes.formControl}
              type="text"
              id={"answer"}
              placeholder="Answer"
            />
          </div>
          <div className={classes.formGroup}>
            <button className={classes.btnPrimary} type="submit">
              Register
            </button>
          </div>
          <a href="/login" className={classes.forgot}>
            ¿You have an account?
          </a>
        </form>
      </div>
    );
  }
}

export default hot(module)(withStyles(styles)(Register));