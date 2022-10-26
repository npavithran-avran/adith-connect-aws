import React from "react";
import { findActualTextFromId } from "../hooks/state";

// This function creates the HTML to add the chats to the store, controlling the layout
const Message = ({ chat, user }) => {
  // const timestampObj = new Date(chat.timestamp);
  // const timestamp = `${timestampObj.getHours()% 12 || 12}:${timestampObj.getMinutes()}`;
  const timestamp = new Date(chat.timestamp).toLocaleTimeString("en-US", {
    // en-US can be set to 'default' to use user's browser settings
    hour: "2-digit",
    minute: "2-digit",
  });
  const translatedText =
    chat.msgAuthor === "agent"
      ? chat.content
      : chat.translatedMessageData.TranslatedText;
  const msgId = chat.messageId;
  const sourceText =
    chat.msgAuthor === "agent"
      ? findActualTextFromId(msgId) || chat.content
      : chat.content;
  const msgAuthor = chat.msgAuthor;
  return (
    <li
      className="Message"
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: msgAuthor === "agent" ? "row-reverse" : 'unset',
      }}
    >
      <div
        className="border rounded px-3 py-2 w-75"
        style={{
          backgroundColor: msgAuthor === "agent" ? "#e8f6f8" : "#ededed",
        }}
      >
        <p className="fw-semibold">{sourceText}</p>
        <p className="text-danger">{translatedText}</p>
      </div>
      <p className="m-auto text-muted">{timestamp}</p>
    </li>
  );
};

/* <b>{translatedText}</b> ({sourceText}) - {msgAuthor} */

export default Message;
