import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";

function Chats({socket, userName, room}) {

const [currentMessage, setCurrentMessage] = useState("");
const [messageList, setMessageList] = useState([]);


const sendMessage = async () => {
    // console.log("sendMessage called");
    if (currentMessage !== "") {
        const messageData = {
            room: room,
            author: userName,
            message: currentMessage,
            time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
        }

        await socket.emit("send_message", messageData);
        setMessageList(list => [...list, messageData]);
        setCurrentMessage("");
    }
}

useEffect(() => {
    // console.log(`useEffect called with ${socket.listeners('receive_message')}`);
    if(socket.listeners('receive_message').length === 0) {
        socket.on("receive_message", (data) => {
            // console.log(messageList);
            // console.log(data);
            setMessageList(list => [...list, data]);  
        });
    }
}, [socket])

  return (
    <div className='chat-window'>
        <div className='chat-header'><p>Live Chat</p></div>
        <div className='chat-body'>
            <ScrollToBottom className='message-container'>
          {messageList.map((messageContent) => {
               return (
                <div className='message' id={userName === messageContent.author ? "you" : "other"}>
                    <div>
                    <div className='message-content'>
                        <p> {messageContent.message} </p>          
                    </div>

                    <div className='message-meta'>
                    <p id='time'> {messageContent.time} </p>
                    <p id='author'> {messageContent.author} </p>

                    </div>
                 </div>
                </div>
               
                )
               
          })}
         </ScrollToBottom>
        </div>
        <div className='chat-footer'>
            <input type="text"
              className='input-text'
            placeholder="message..." value={currentMessage}
                 onChange={ (event) => { setCurrentMessage(event.target.value);
                }}
                 onKeyPress={(event) => { event.key === "Enter" && sendMessage();
                }}
            ></input>
            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>
  )
}

export default Chats;