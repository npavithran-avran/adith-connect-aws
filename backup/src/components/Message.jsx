import React from "react";

// This function creates the HTML to add the chats to the store, controlling the layout
const Message = ({ chat, user }) => {
  const translatedText = chat.translatedMessageData.TranslatedText;
  const sourceText = chat.content;
  const msgAuthor = chat.msgAuthor;
  return (
    <div>
      <p>
        <b>{translatedText}</b> ({sourceText}) - {msgAuthor}
      </p>
    </div>
  );
};

export default Message;
