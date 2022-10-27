import React, { useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chats from "./Chats";

const socket = io("http://localhost:3001");

function App() {
  const [userName, setUserName] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (userName !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Your name"
            onChange={(event) => {
              setUserName(event.target.value);
            }}
            required="required"
          ></input>
          <input
            type="text"
            placeholder="Room ID..."
            required="required"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          ></input>
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chats socket={socket} userName={userName} room={room} />
      )}
    </div>
  );
}

export default App;
