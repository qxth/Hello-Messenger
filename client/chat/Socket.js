import {io} from "socket.io-client";

let Socket = io("//localhost:3000");

export {Socket};