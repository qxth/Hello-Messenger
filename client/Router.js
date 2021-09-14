import React, { useEffect, useState } from "react";
import { Route, Switch, withRouter } from "react-router-dom";

// Componentes
import Chat from "./chat/chat";
import Login from "./login/login";
import Register from "./register/register";
import Home from "./views/home";
import LogOut from "./views/logOut";
import NotFound from "./views/notFound";

// Extras
import {AppContext} from './../utils/app-context'
import {Socket} from './../utils/Socket'
import routerApi from "./../utils/routes-api";

const Router = () => {
  const [routes, setRoutes] = useState(false);
  const [dataUser, setDataUser] = useState(null);
  useEffect(() => {
    fetch(`${routerApi.verificarToken}`, {
      method: "GET",
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setDataUser(data.user)
          setRoutes(true);
          return;
        } 
      })
      .catch(e => setRoutes(false))
  }, []);
  const AuthorizedRoutes = () => {
    return ( 
        <AppContext.Provider value={{
          user: dataUser.nickname,
          socket: Socket
        }}>    
          <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/chat" component={Chat} />
              <Route path="/logout" component={LogOut} />
              <Route component={NotFound} />
          </Switch>
        </AppContext.Provider>  
      );
  }
  const NotAuthorizedRoutes = () => {
    return (
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route component={NotFound} />
        </Switch>
    );
  }
  return (
    <div>
    {routes ? <AuthorizedRoutes/> : <NotAuthorizedRoutes/> }
    </div>
  );
};

export default withRouter(Router);
