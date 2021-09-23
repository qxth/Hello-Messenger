import React from "react";
import { hot } from "react-hot-loader";

// #Screens
import Search from "./searchFriends";
import MenuHome from "./menuHome";
import Messenger from "./messenger";

class HandleScreen extends React.Component {
  constructor(props) {
    super(props);
    this.ScreenSelected = () => {
      const component = this.props.friendData ? <Messenger {...this.props} /> : <Search {...this.props} />
      return component
    };
  }
  render() {
    const {isOpenScreens} = this.props
    return (
      <div>{isOpenScreens ? <this.ScreenSelected /> : <MenuHome {...this.props}/>}</div>
    );
  }
}

export default hot(module)(HandleScreen);
