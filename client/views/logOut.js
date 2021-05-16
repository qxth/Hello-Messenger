import React from "react";
import { hot } from "react-hot-loader";
import { instanceOf } from 'prop-types';

//#Cookies
import { withCookies, Cookies } from 'react-cookie';

class LogOut extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount(){
    this.props.cookies.remove("jwt")
    window.location.href = "/login"
  }
  render() {
    return (
      <div></div>
    );
  }
}

export default hot(module)(withCookies(LogOut));
