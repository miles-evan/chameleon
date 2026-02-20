"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const socket_io_client_1 = require("socket.io-client");
const react_1 = require("react");
// For whoever is running the server, enter YOUR ip here (do http not https):
const socket = (0, socket_io_client_1.io)("http://129.21.136.160:3000", { secure: true });
let wordBank = [];
function App() {
    const [secretWord, setSecretWord] = (0, react_1.useState)(null);
    const [playerCount, setPlayerCount] = (0, react_1.useState)(0);
    const [isChameleon, setIsChameleon] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        socket.on("initialize", (secretWord, bank, players) => {
            setSecretWord(secretWord);
            wordBank = bank;
            setPlayerCount(players);
        });
        socket.on("new-round", (newWord) => {
            setIsChameleon(!newWord);
            setSecretWord(newWord ? "Secret word: " + newWord : "You are the chameleon, try to blend in!");
        });
        socket.on("update-player-count", (players) => {
            setPlayerCount(players);
        });
        // cleanup
        return () => {
            socket.removeAllListeners("initialize");
            socket.removeAllListeners("new-round");
            socket.removeAllListeners("update-player-count");
        };
    }, []);
    function startRound() {
        socket.emit("start-round");
    }
    function cheatCode() {
        socket.emit("cheat-code");
    }
    return (<>
			<h1 style={{ textShadow: "0px 0px 55px #aaaaaa60, 2px 2px 8px black" }}>Welcome to MOPs Chameleon!</h1>
			<p>{playerCount + " players in lobby"}</p>
			<h2 style={{
            color: isChameleon ? "#ca3737" : "#2ee634",
            textShadow: `0px 0px 25px ${isChameleon ? "#ca3737" : "#2ee634aa"}`
        }}>
				{secretWord !== null && secretWord !== void 0 ? secretWord : "Loading..."}
			</h2>
			<p>{wordBank ? "Word bank: " + wordBank.join(", ") : "Loading..."}</p>
			<br />
			<button onClick={startRound} onDoubleClick={cheatCode} onAuxClick={cheatCode}>Start Round</button>
		</>);
}
"#2ee634";
"#499fff";
"#ca3737";
