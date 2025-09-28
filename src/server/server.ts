import { Server, Socket } from "socket.io";

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const io = new Server(3000, {
	cors: {
		origin: [
			"http://localhost:8080",
			"http://localhost:5173",
			"https://milestodtfeld.com",
		]
	}
});

let clients: Socket[] = [];

io.on("connect", socket => {
	clients.push(socket);
	
	socket.on("disconnect", () => {
		clients = clients.filter(s => s !== socket);
		console.log(clients.length);
	});
	
	socket.on("start-round", (wordBank: string[]) => {
		console.log(wordBank);
		const secretWord: string = wordBank[randomInt(0, wordBank.length - 1)];
		const chameleon: Socket = clients[randomInt(0, clients.length - 1)];
		for(const client of clients) {
			client.emit("new-round",
				client === chameleon? null : secretWord,
				wordBank
			);
		}
	});
	
	console.log(clients.length);
});

