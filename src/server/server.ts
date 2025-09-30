import { Server, Socket } from "socket.io";

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const io = new Server(3000, {
	cors: {
		origin: "*"
	}
});

const wordBank: string[] = "high level language, assembly, machine language, compiler, assembler, terminal, OO, imperative, functional, header file, macro, switch statement, static, unsigned, const, pointer, type casting, modulus, stack, heap, kernel, segmentation, paging, fragmentation, void*, NULL, dereference, dangling pointer, memory leak, struct, typedef"
	.split(", ")
let secretWord: string = "Press new round to randomize the word and chameleon!";
let clients: Socket[] = [];

io.on("connect", clientSocket => {
	clients.push(clientSocket);
	
	function updatePlayerCount() {
		clientSocket.broadcast.emit("update-player-count", clients.length);
	}
	
	clientSocket.on("disconnect", () => {
		clients = clients.filter(s => s !== clientSocket);
		updatePlayerCount();
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
	
	clientSocket.emit("initialize", secretWord, wordBank, clients.length);
	updatePlayerCount();
});

