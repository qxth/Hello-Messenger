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
      const { classes } = this.props;
      if (this.props.canal) return <Messenger {...this.props} />;
      return <Search {...this.props} />;
    };
  }
  render() {
    return (
      <div>{this.props.chatSelected ? <this.selectChat /> : <MenuHome />}</div>
    );
  }
}

export default hot(module)(HandleScreen);
