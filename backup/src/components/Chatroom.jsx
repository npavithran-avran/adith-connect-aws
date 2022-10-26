import React, { useContext, useEffect, useRef, useState } from "react";
import translateText from "../assets/translateText";
import { GlobalContext } from "../context/GlobalContext";
import {
  useChatMessages,
  useGlobalState,
  // useLocalStorage,
} from "../hooks/state";
import Message from "./Message";

function Chatroom({ session }) {
  const {
    currentContactId,
    setCurrentContactId,
    customerLanguage,
    setCustomerLanguage,
  } = useContext(GlobalContext);
  const [languageOptions] = useGlobalState("languageOptions");
  // const currentContactId = useGlobalState("currentContactId");
  // const customerLanguage = useGlobalState("customerLanguage");
  const [newMessage, setNewMessage] = useState("");
  // const [Chats] = useGlobalState("Chats");
  const [contactIdState, setContactIdState] = useState(currentContactId);
  useEffect(() => {
    setContactIdState(currentContactId);
  }, [currentContactId]);
  const [chatMessages] = useChatMessages(contactIdState);
  useEffect(() => {
    // loop with 3 seconds interval
    const interval = setInterval(() => {
      console.log(chatMessages, contactIdState, currentContactId);
    }, 3000);
    return () => clearInterval(interval);
  }, [chatMessages]);
  // const [chatMessagesVar, setChatMessagesVar] = useState([...chatMessages]);
  // useEffect(() => {
  //   console.log(setChatMessagesVar);
  // }, [chatMessages]);
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

  const sendMessage = async (content) => {
    const msgContent = await new translateText(
      content,
      "auto",
      customerLanguage
    ).getTranslatedText();
    console.log(msgContent);
    const session = retrieveValue(currentContactId);
    const awsSdkResponse = await session.sendMessage({
      contentType: "text/plain",
      message: msgContent.TranslatedText,
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
        Translate -{" "}
        {Object.keys(languageOptions).map((key) => {
          if (languageOptions[key] === customerLanguage) {
            return key;
          }
        })}{" "}
        ({customerLanguage})
      </h3>
      <ul className="chats" ref={messageEl}>
        {console.log(chatMessages)}
        {
          // iterate over the Chats, and only display the messages for the currently active chat session
          chatMessages.map((chat) => {
            // console.log(chat, chat.contactId, currentContactId);
            // if (chat.contactId === currentContactId)
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
