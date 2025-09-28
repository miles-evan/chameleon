import { io } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

const socket = io("http://129.21.115.204:3000");

export default function App() {
	
	const inputRef = useRef<HTMLInputElement>(null);
	const [secretWord, setSecretWord] = useState("Welcome to chameleon!");
	const [wordBank, setWordBank] = useState<string[]>([]);
	
	useEffect(() => {
		socket.on("connect", () => {
			console.log("I've connected!");
		});
		socket.on("new-round", (newWord: string | null, newWordBank: string[]) => {
			setSecretWord(newWord ?? "You are the chameleon, try to blend in!");
			setWordBank(newWordBank);
			console.log("new round");
		})
	});
	
	function startRound(): void {
		socket.emit("start-round", inputRef.current!.value.split(", "));
	}
	
	return (
		<>
			<h1>{secretWord}</h1>
			<p>{wordBank?.join(", ") ?? "Word bank here"}</p>
			<input type="text" ref={inputRef}/>
			<button onClick={startRound}>Send</button>
		</>
	)
	
}