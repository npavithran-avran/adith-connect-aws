import React from "react";

function SendMessage() {
  const session = retrieveValue(currentContactId[0]);

  function retrieveValue(key) {
    var value = "";
    for (var obj in props.session) {
      for (var item in props.session[obj]) {
        if (item === key) {
          value = props.session[obj][item];
          break;
        }
      }
    }
    return value;
  }
  sendMessage(session, translatedMessage);

  return <div className="SendMessage">Send</div>;
}

export default SendMessage;
