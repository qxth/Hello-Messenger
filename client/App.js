import React from "react";
import { hot } from "react-hot-loader";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";
import { MuiThemeProvider, withStyles } from "@material-ui/core/styles";
import { CookiesProvider } from 'react-cookie';

const styles = (tema) => ({
  "@global": {
    body: {
      margin: 0,
      padding: 0,
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
});

const App = () => {
 
  return (
    <React.Fragment>
      <div>
          <CookiesProvider>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </CookiesProvider>
      </div>
    </React.Fragment>
  );
};

export default hot(module)(withStyles(styles)(App));
