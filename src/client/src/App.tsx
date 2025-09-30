import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("http://129.21.115.204:3000", { secure: true });

let wordBank: string[] = [];

export default function App() {
	
	const [secretWord, setSecretWord] = useState("Welcome to chameleon!");
	const [playerCount, setPlayerCount] = useState(0);
	
	useEffect(() => {
		socket.on("initialize", (initialWord: string, bank: string[], players: number) => {
			setSecretWord(initialWord);
			wordBank = bank;
			setPlayerCount(players);
		});
		socket.on("new-round", (newWord: string | null) => {
			setSecretWord(newWord? "Secret word: " + newWord : "You are the chameleon, try to blend in!");
		});
		socket.on("update-player-count", (players: number) => {
			setPlayerCount(players);
		});
		
		return () => {
			socket.removeAllListeners("initialize");
			socket.removeAllListeners("new-round");
			socket.removeAllListeners("update-player-count");
		}
	});
	
	function startRound(): void {
		socket.emit("start-round");
	}
	
	return (
		<>
			<h1>Welcome to chameleon!</h1>
			<p>{playerCount + " players in lobby"}</p>
			<h2>{secretWord ?? "Loading..."}</h2>
			<p>{wordBank? "Word bank: " + wordBank.join(", ") : "Loading..."}</p>
			<br/>
			<button onClick={startRound}>Start Round</button>
		</>
	)
	
}