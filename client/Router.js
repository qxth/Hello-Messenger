import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import Chat from "./chat/chat";
import Login from "./login/login";
import Register from "./register/register";
import Home from "./views/home";
import NotFound from "./views/notFound";
import routerApi from "./../server/utils/routes-api";

const Router = () => {
  const [routes, setRoutes] = useState(false);
  useEffect(() => {
    fetch(`${routerApi.verificarToken}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("================");
        console.log(data);
        console.log("======================");
        console.log(routes);
        console.log(routerApi);
        if (data.data !== false) return setRoutes(true);
      });
  });
  const Routes = () => {
    if (routes == true)
      return (
        <>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/chat" component={Chat} />
            <Route exact path="*" component={NotFound} />
          </Switch>
        </>
      );
    return (
      <>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </>
    );
  };
  return (
    <div>
        <Routes />
    </div>
  );
};

export default Router;
