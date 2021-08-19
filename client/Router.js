import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";

// Componentes
import Chat from "./chat/chat";
import Login from "./login/login";
import Register from "./register/register";
import Home from "./views/home";
import LogOut from "./views/logOut";
import NotFound from "./views/notFound";
// Extras
import routerApi from "./../server/utils/routes-api";

const Router = () => {
  const [routes, setRoutes] = useState(false);
  const [dataUser, setDataUser] = useState(null);
  useEffect(() => {
    fetch(`${routerApi.verificarToken}`, {
      method: "GET",
    })
      .then((res) => {
        if (res.status !== 401) return setRoutes(true);
      });
  });
  const Routes = () => {
    if (routes)
      return ( 
        <React.Fragment>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/chat" component={Chat} />
            <Route exact path="/logout" component={LogOut} />
            <Route exact path="*" component={NotFound} />
          </Switch>
        </React.Fragment>
      );
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </React.Fragment>
    );
  };
  return (
    <div>
      <Routes />
    </div>
  );
};

export default Router;
