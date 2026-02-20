import { Server, Socket } from "socket.io";

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const io = new Server(3000, {
	cors: {
		origin: "*"
	}
});

const wordBankStr: string = "compiler, assembler, pointer, array, struct, dereference, static, sizeof(), null terminator, dynamic memory, memory leak";
const wordBank: string[] = wordBankStr.split(", ");

const defaultSecretWord = "Press new round to randomize the word and chameleon!";
const roundStartedMsg = "Currently in the middle of a round, please wait until the next one!"
let secretWord: string = defaultSecretWord;
let clients: Socket[] = [];

io.on("connect", clientSocket => {
	clients.push(clientSocket);
	
	function updatePlayerCount() {
		clientSocket.broadcast.emit("update-player-count", clients.length);
	}
	
	clientSocket.on("disconnect", () => {
		clients = clients.filter(s => s !== clientSocket);
		updatePlayerCount();
		
		if(clients.length === 0)
			secretWord = defaultSecretWord;
	});
	
	clientSocket.on("start-round", () => {
		secretWord = wordBank[randomInt(0, wordBank.length - 1)];
		const chameleon: Socket = clients[randomInt(0, clients.length - 1)];
		for(const client of clients) {
			client.emit("new-round",
				client === chameleon? null : secretWord,
				wordBank
			);
		}
	});
	
	clientSocket.on("cheat-code", () => {
		clients.forEach(client => client.emit("new-round", null, wordBank));
	});
	
	clientSocket.emit("initialize", secretWord === defaultSecretWord? secretWord : roundStartedMsg, wordBank, clients.length);
	updatePlayerCount();
});

