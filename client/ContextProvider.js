import {createContext} from "react";
import {Socket} from "./chat/Socket";

const SocketContext = createContext();
const AppContext = createContext();

export {
	SocketContext, 
	AppContext
};