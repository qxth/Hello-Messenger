import {io} from "socket.io-client";

let Socket = io('http://localhost:3000');
//let Socket = io("/chat")

export {Socket};