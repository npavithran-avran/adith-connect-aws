import React, { useRef, useState } from "react";
import { useGlobalState } from "../hooks/state";
import Message from "./Message";

function Chatroom({ session }) {
  const [languageTranslate] = useGlobalState("languageTranslate");
  const [languageOptions] = useGlobalState("languageOptions");
  const currentContactId = useGlobalState("currentContactId");
  const [newMessage, setNewMessage] = useState("");
  const [Chats] = useGlobalState("Chats");
  const agentUsername = "AGENT";
  const messageEl = useRef(null);
  const input = useRef(null);

  function retrieveValue(key) {
    var value = "";
    for (var obj in session) {
      for (var item in session[obj]) {
        if (item === key) {
          value = session[obj][item];
          break;
        }
      }
    }
    return value;
  }

  function getKeyByValue(object) {
    let obj = languageTranslate.find(
      (o) => o.contactId === currentContactId[0]
    );
    if (obj === undefined) {
      return;
    } else {
      return Object.keys(object).find((key) => object[key] === obj.lang);
    }
  }
  const sendMessage = async (content) => {
    // new translateText(message)
    const session = retrieveValue(currentContactId[0]);
    const awsSdkResponse = await session.sendMessage({
      contentType: "text/plain",
      message: content,
    });
    const { AbsoluteTime, Id } = awsSdkResponse.data;
  };

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(newMessage);
    setNewMessage("");
    // input.current.focus();
  }

  return (
    <div className="Chatroom">
      <h3>
        Translate - (
        {languageTranslate.map((lang) => {
          if (lang.contactId === currentContactId[0]) return lang.lang;
        })}
        ) {getKeyByValue(languageOptions)}
      </h3>
      <ul className="chats" ref={messageEl}>
        {
          // iterate over the Chats, and only display the messages for the currently active chat session
          Chats.map((chat) => {
            if (chat.contactId === currentContactId[0])
              return <Message chat={chat} user={agentUsername} />;
          })
        }
      </ul>
      <form className="input" onSubmit={handleSubmit}>
        <input
          ref={input}
          maxLength="1024"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Chatroom;
