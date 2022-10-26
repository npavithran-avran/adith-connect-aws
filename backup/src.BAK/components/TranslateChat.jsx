import React, { useEffect, useState } from "react";
import translateText from "../assets/translateText";

function TranslateChat() {
  const isLoaded = window.connect && window.connect.ChatSession;
  const connect = window.connect;
  // function sendMessage(content) {}
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const receivedMessages = ["comment vas-tu", "hola"];
    var messagesToAdd = [];
    receivedMessages.map(async (message) => {
      const translateObj = new translateText(message, "auto", "en");
      translateObj.getTranslatedText().then((translatedData) => {
        console.log(translatedData);
        messagesToAdd.push({
          contentText: message,
          translatedData: translatedData,
        });
        setMessages(...messages, messagesToAdd);
      });
    });
  }, []);
  useEffect(() => {
    console.log("CHAT ===> ", connect.ChatSession);
  }, []);

  return (
    <div className="TranslateChat">
      <div
        className="Heading"
        style={{
          border: "1px solid #000000",
          padding: 10,
          backgroundColor: "#4a4a4a",
          color: "#ffffff",
          marginBottom: 10,
        }}
      >
        <h1 style={{ margin: 0 }}>Translate - (es) Spanish</h1>
      </div>
      <div className="Messages">
        {console.log(messages)}
        {messages.map((message) => {
          return (
            <div className="MessageItem">
              <p>{message.contentText}</p>
              <p style={{ color: "#232323" }}>
                {message.translatedData.TranslatedText}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TranslateChat;
