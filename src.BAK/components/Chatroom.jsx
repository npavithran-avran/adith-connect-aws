import React, { useEffect, useRef, useState } from "react";
import translateText from "../assets/translateText";
import {
  useGlobalState,
  useChatMessages,
  addActualTextFromId,
  // setCurrentAgentLanguage,
  useLocalStorage,
} from "../hooks/state";
import Message from "./Message";

function Chatroom({ session }) {
  const [languageTranslate] = useGlobalState("languageTranslate");
  const [languageOptions] = useGlobalState("languageOptions");
  const currentContactId = useGlobalState("currentContactId");
  const customerLanguage = useGlobalState("customerLanguage");
  const [endedContacts] = useGlobalState("endedContacts");
  const [agentLanguages] = useGlobalState("agentLanguages");
  const [currentAgentLang, setCurrentAgentLang] = useLocalStorage(
    "currentAgentLanguage",
    "en"
  );

  const [newMessage, setNewMessage] = useState("");
  // const [Chats] = useGlobalState("Chats");
  const [currentContactIdState, setCurrentContactIdState] = useState(
    currentContactId[0]
  );
  useEffect(() => {
    setCurrentContactIdState(currentContactId[0]);
  }, [currentContactId]);
  const [Chats] = useChatMessages(currentContactIdState);

  const agentUsername = "AGENT";
  const input = useRef(null);

  const [lastMessage, setLastMessage] = useState(false);
  useEffect(() => {
    var messages_var = document.getElementById("chat-messages");
    if (messages_var) {
      if (messages_var.querySelectorAll("ol > li").length > 0) {
        messages_var.scrollTop = messages_var.scrollHeight;
        setLastMessage(true);
      }
    }
  }, [Chats]);

  const [disableFormInput, setDisableFormInput] = useState(true);
  useEffect(() => {
    var sessionIds = [];
    session.forEach((item) => {
      sessionIds.push(Object.keys(item)[0]);
    });
    console.log(currentContactIdState);
    if (
      endedContacts.includes(currentContactIdState) ||
      currentContactIdState === null ||
      !sessionIds.includes(currentContactIdState)
    ) {
      setDisableFormInput(true);
    } else {
      setDisableFormInput(false);
    }
  }, [session, endedContacts, currentContactIdState]);

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
      customerLanguage[0]
    ).getTranslatedText();
    console.log(msgContent);
    const session = retrieveValue(currentContactId[0]);
    const awsSdkResponse = await session.sendMessage({
      contentType: "text/plain",
      message: msgContent.TranslatedText,
    });
    const { AbsoluteTime, Id } = awsSdkResponse.data;
    addActualTextFromId(content, Id);
  };

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(newMessage);
    setNewMessage("");
    // input.current.focus();
  }

  return (
    <div className="Chatroom" style={{ height: "100%" }}>
      <div className="chat__translate h-100 border rounded">
        <div
          className="w-100"
          style={{
            maxHeight: "-webkit-fill-available",
            height: "-webkit-fill-available",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <header
            className="text-center text-white fs-5 mb-1 rounded-top"
            style={{
              backgroundColor: "#4a4a4a",
              height: 38,
              verticalAlign: "middle",
              display: "flex",
            }}
          >
            <p className="m-auto" style={{
              fontSize: "1rem",
              fontWeight: "600",
            }}>
              {/* Translate -{" "}
              {Object.keys(languageOptions).map((key) => {
                if (languageOptions[key] === customerLanguage[0]) {
                  return key;
                }
              })}{" "}
              ({customerLanguage[0]}) */}
              Translating{" "}
              {Object.keys(languageOptions).map((key) => {
                if (languageOptions[key] === customerLanguage[0]) {
                  return key;
                }
              })}{" "}
              {"↔"}{" "}
              {Object.keys(languageOptions).map((key) => {
                if (languageOptions[key] === currentAgentLang) {
                  return key;
                }
              })}
            </p>
          </header>
          <div
            className="agent__language input-group mb-2"
            style={{
              paddingLeft: "0.25em",
              paddingRight: "0.25em",
            }}
          >
            <label className="input-group-text" for="agentLangSelect">
              Language
            </label>
            <select
              className="form-select"
              id="agentLangSelect"
              defaultValue={currentAgentLang}
              onChange={(e) => {
                console.log("[EVENT]", e.target.value);
                setCurrentAgentLang(e.target.value);
              }}
            >
              {Object.keys(agentLanguages).map((language) => {
                const langCode = agentLanguages[language];
                return (
                  <option key={langCode} value={langCode}>
                    {language}
                  </option>
                );
              })}
            </select>
          </div>

          <div
            className="chat__messages"
            id="chat-messages"
            style={{
              overflow: "hidden auto",
              flex: "1 1 0%",
              paddingLeft: "0.25em",
              paddingRight: "0.25em",
              marginBottom: 60,
            }}
          >
            <ol className="list-group gap-3">
              {/* {console.log(Chats, currentContactId)} */}
              {
                // iterate over the Chats, and only display the messages for the currently active chat session
                Chats.map((chat) => {
                  // if (chat.contactId === currentContactId[0])
                  return (
                    <Message
                      key={chat.messageId}
                      chat={chat}
                      user={agentUsername}
                    />
                  );
                })
              }
            </ol>
          </div>
          <footer
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              backgroundColor: "#f2f2f2",
            }}
          >
            <form onSubmit={handleSubmit} className="m-2">
              <div className="messaging-field">
                <div className="input-group">
                  <input
                    ref={input}
                    maxLength="1024"
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={disableFormInput}
                    className="form-control"
                    placeholder="Type a message"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={disableFormInput}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
            {/* <form className="input" onSubmit={handleSubmit}>
              <input
                ref={input}
                maxLength="1024"
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <input type="submit" value="Submit" />
            </form> */}
          </footer>
        </div>
      </div>
    </div>
  );
}

export default Chatroom;
