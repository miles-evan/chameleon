import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("http://129.21.114.32:3000", { secure: true });

let wordBank: string[] = [];

export default function App() {
	
	const [secretWord, setSecretWord] = useState<string | null>(null);
	const [playerCount, setPlayerCount] = useState(0);
	const [isChameleon, setIsChameleon] = useState(false);
	
	useEffect(() => {
		socket.on("initialize", (initialWord: string, bank: string[], players: number) => {
			setSecretWord(initialWord);
			wordBank = bank;
			setPlayerCount(players);
		});
		socket.on("new-round", (newWord: string | null) => {
			setIsChameleon(!newWord);
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
			<h1 style={{ textShadow: "0px 0px 55px #aaaaaa55, 2px 2px 8px black" }}>Welcome to MOPs Chameleon!</h1>
			<p>{playerCount + " players in lobby"}</p>
			<h2 style={{
				color: isChameleon? "#ca3737" : "#2ee634",
				textShadow: `0px 0px 25px ${isChameleon? "#ca3737" : "#2ee634aa"}` }}
			>
				{secretWord ?? "Loading..."}
			</h2>
			<p>{wordBank? "Word bank: " + wordBank.join(", ") : "Loading..."}</p>
			<br/>
			<button onClick={startRound}>Start Round</button>
		</>
	)
	
}

"#2ee634"
"#499fff"
"#ca3737"