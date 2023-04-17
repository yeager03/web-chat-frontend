import { Socket, io } from "socket.io-client";

// url
import { API_URL } from "./axios";

let socket: Socket;

const connectSocket = (user_id: string) => {
	socket = io(API_URL || "", {
		query: {
			user_id,
		},
	});
};

export { socket, connectSocket };
