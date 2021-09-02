import * as React from 'react';
import SocketContext from './SocketContext.js'
import {Socket} from './Socket.js'

class SocketProvider extends React.Component {
	constructor(props){
		super(props)
		this.state= {
			socket: Socket
		}
	}
	render(){
		return(
			<SocketContext.Provider value={this.state.socket}>
				{ this.props.children}
			</SocketContext.Provider>
		)
	}
}

export default SocketProvider;
