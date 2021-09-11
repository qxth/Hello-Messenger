import {Socket} from 'socket.io/dist/socket'

declare module "socket.io"  {
	export class Socket {
		public data: any
	}
}
