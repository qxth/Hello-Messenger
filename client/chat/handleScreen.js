import React from "react";
import { hot } from "react-hot-loader";

// #Screens
import Search from "./searchFriends";
import MenuHome from "./menuHome";
import Messenger from "./messenger";

class HandleScreen extends React.Component {
  constructor(props) {
    super(props);
    this.selectChat = () => {
      const component = this.props.friendData ? <Messenger {...this.props} /> : <Search {...this.props} />
      return component
    };
  }
  render() {
    return (
      <div>{this.props.openScreens ? <this.selectChat /> : <MenuHome {...this.props}/>}</div>
    );
  }
}

export default hot(module)(HandleScreen);
