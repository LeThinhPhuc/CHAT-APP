import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          `0${new Date(Date.now()).getHours()}`.slice(-2) +
          ":" +
          `0${new Date(Date.now()).getMinutes()}`.slice(-2) ,
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        {/* {messageList[0].username} */}
        <div className="child1" style={{textAlign:"center", paddingTop:"12px"}}>User : <span style={{fontWeight:"bold"}}>{username}</span></div>
        <div className="child2">
        
        <p style={{display:"flex",paddingLeft:"5px"}}><div style={{marginTop:"6px", marginRight:"5px",width:"10px", height:"10px", backgroundColor:"#4ef037", borderRadius:"150px"}}></div>Live Chat</p>
        
        ID ROOM : <span style={{fontWeight:"bold"}}>{room}</span>
        </div>
       
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Your message..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage} style={{color:`${currentMessage?"#43a047":""}`}}>&#9658;</button> 
      </div>
    </div>
  );
}

export default Chat;
