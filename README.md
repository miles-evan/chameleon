# Multiplayer Chameleon Web App

<img width="1185" height="394" alt="image" src="https://github.com/user-attachments/assets/64fcdb31-0bc5-490c-8711-0a84da6e0660" />

**Note:** this web app isn't connected to any domain or server, so you'll host it yourself by running the program.

## Setup directions:
1. **Clone the repository. Run:**
- ```git clone https://github.com/miles-evan/chameleon.git```
2. **Install dependencies. Run:**
- ```npm install```
3. **Set the IP of the server**
- Go to App.tsx (in src/client/src) and change the first line of code to have your IP address, so when people join the game, it'll connect to you
- If your IP address ever randomly changes, you'll have to change this line
4. **Set the word bank for the game**
- Go to server.ts (in src/server)
- Go to the line near the top that initializes the word bank _const wordBankStr: string = "compiler, assembler, pointer, array";_ and change it to your desired words. This line is marked with a comment
- I could have made this part of the UI, but I was lazy

## Running directions
1. **Start the server**
- Run: ```npm run start```
2. **Start the web page**
- Run: ```npm run host```
- It should tell you the url for people to join the webpage at

When people join, it will say how many people are in the lobby. Press new round to randomly select a new word and chameleon.
