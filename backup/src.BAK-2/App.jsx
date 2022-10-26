import { useEffect, useState } from "react";
import translateText from "./assets/translateText";
import Chatroom from "./components/Chatroom";
// import SubscribeConnectEvents from "./assets/SubscribeConnectEvents";
// import TranslateChat from "./components/TranslateChat";
import {
  addNewChatMsg,
  // addChat,
  setCurrentContactId,
  setCustomerLanguage,
  useChatMessages,
  useGlobalState,
} from "./hooks/state";

// function addNewChatMsg(newMsg) {
//   addChat((prevMsg) => [...prevMsg, newMsg]);
// }

function App() {
  const connect = window.connect;
  // useEffect(() => {}, [connect]);
  return (
    <div>
      {connect ? (
        <div className="container" style={{ display: "flex", gap: 10 }}>
          <CCP />
          {/* <TranslateChat /> */}
          {/* <TranslateText text={'hola'} lang={'en'} /> */}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function CCP() {
  const [agentChatSessionState, setAgentChatSessionState] = useState([]);
  const currentContactId = useGlobalState("currentContactId");
  const [chatMessages] = useChatMessages(currentContactId[0]);
  // useEffect(() => {
  //   console.log(chatMessages);
  // }, [chatMessages]);
  // *******
  // Subscribe to the chat session
  // *******
  function getEvents(contact, agentChatSession) {
    contact
      .getAgentConnection()
      .getMediaController()
      .then((controller) => {
        controller.onMessage((messageData) => {
          // console.log("[MESSAGE DATA]", messageData);
          if (messageData.data.Type === "MESSAGE") {
            if (
              messageData.chatDetails.participantId ===
              messageData.data.ParticipantId
            ) {
              console.log(
                `CDEBUG ===> Agent ${messageData.data.DisplayName} Says`,
                messageData.data.Content
              );
              processChatText(
                messageData.data.Content,
                messageData.data.Type,
                messageData.data.ContactId,
                "agent"
              );
            } else {
              console.log(
                `CDEBUG ===> Customer ${messageData.data.DisplayName} Says`,
                messageData.data.Content
              );
              processChatText(
                messageData.data.Content,
                messageData.data.Type,
                messageData.data.ContactId,
                "customer"
              );
            }
          }
        });
      });
  }
  // *******
  // Processing the incoming chat from the Customer
  // *******
  async function processChatText(content, type, contactId, msgAuthor) {
    // setLanguageTranslate(languageTranslate);

    let translatedMessage = await new translateText(
      content,
      "auto",
      "en"
    ).getTranslatedText();

    console.log(
      `CDEBUG ===>  [${msgAuthor}] Original Message: ` +
        content +
        `\n Translated Message: ` +
        translatedMessage.TranslatedText
    );
    // create the new message to add to Chats.
    let newMsg = {
      contactId: contactId,
      msgAuthor: msgAuthor,
      content: content,
      translatedMessageData: translatedMessage,
    };
    // Add the new message to the storefunction addNewChatMsg(newMsg) {
    // const prevChatMessages = chatMessages;
    // prevChatMessages.push(newMsg);
    // console.log(contactId);
    // localStorage.setItem(
    //   `chatMessages-${contactId}`,
    //   JSON.stringify(prevChatMessages)
    // );
    addNewChatMsg(newMsg);
    // console.log("OLD CHAT MESSAGES =>", chatMessages, [
    //   ...chatMessages,
    //   newMsg,
    // ]);
    // setChatMessages([newMsg]);

    if (msgAuthor === "customer") {
      setCustomerLanguage(translatedMessage.SourceLanguageCode || "en");
    }
  }

  function subscribeConnectEvents() {
    window.connect.core.onViewContact(function (event) {
      var contactId = event.contactId;
      // var contactChats = [];
      // chatMessages.map((chat) => {
      //   if (chat.msgAuthor === "customer" && chat.contactId === contactId) {
      //     contactChats.push(chat.translatedMessageData.SourceLanguageCode);
      //   }
      // });
      // setCustomerLanguage(contactChats[contactChats.length - 1] || "en");
      console.log("CDEBUG ===> onViewContact", contactId);
      setCurrentContactId(contactId);
    });

    // If this is a chat session
    if (window.connect.ChatSession) {
      console.log(
        "CDEBUG ===> Subscribing to Connect Contact Events for chats"
      );
      window.connect.contact((contact) => {
        // This is invoked when CCP is ringing
        contact.onConnecting(() => {
          console.log(
            "CDEBUG ===> onConnecting() >> contactId: ",
            contact.contactId
          );
          let contactQueue = contact.getQueue();
          console.log("CDEBUG ===> contactQueue: ", contactQueue);
        });

        contact.onAccepted(async () => {
          console.log("CDEBUG ===> onAccepted: ", contact);
          const cnn = contact
            .getConnections()
            .find(
              (cnn) => cnn.getType() === window.connect.ConnectionType.AGENT
            );
          const agentChatSession = await cnn.getMediaController();
          setCurrentContactId(contact.contactId);
          setAgentChatSessionState((agentChatSessionState) => [
            ...agentChatSessionState,
            { [contact.contactId]: agentChatSession },
          ]);
        });

        contact.onConnected(async () => {
          console.log(
            "CDEBUG ===> onConnected() >> contactId: ",
            contact.contactId
          );
          const cnn = contact
            .getConnections()
            .find(
              (cnn) => cnn.getType() === window.connect.ConnectionType.AGENT
            );
          const agentChatSession = await cnn.getMediaController();
          let contactAttributes = contact; // - customer details
          console.log(contactAttributes);
          setCurrentContactId(contact.contactId);
          setAgentChatSessionState((agentChatSessionState) => [
            ...agentChatSessionState,
            { [contact.contactId]: agentChatSession },
          ]);
          getEvents(contact, agentChatSession);
        });

        contact.onEnded(() => {
          console.log(
            "CDEBUG ===> onEnded() >> contactId: ",
            contact.contactId
          );
        });

        // This is invoked when the agent moves out of ACW to a different state
        contact.onDestroy(() => {
          console.log(
            "CDEBUG ===> onDestroy() >> contactId: ",
            contact.contactId
          );
          setCurrentContactId(null);
          setCustomerLanguage("en");
        });
      });

      console.log("CDEBUG ===> Subscribing to Connect Agent Events");
      window.connect.agent((agent) => {
        agent.onStateChange((agentStateChange) => {
          // On agent state change, update the React state.
          let state = agentStateChange.newState;
          // console.log(agent);
          console.log("CDEBUG ===> New State: ", state);
        });
      });
    } else {
      console.log("CDEBUG ===> waiting 3s");
      setTimeout(function () {
        subscribeConnectEvents();
      }, 3000);
    }
  }

  // *****
  // Loading CCP
  // *****
  useEffect(() => {
    const connectUrl = "https://avran.my.connect.aws/ccp-v2/";
    window.connect.agentApp.initApp("ccp", "ccp-container", connectUrl, {
      ccpParams: {
        loginPopup: true, // optional, defaults to `true`
        loginPopupAutoClose: true, // optional, defaults to `true`
        loginOptions: {
          // optional, if provided opens login in new window
          autoClose: true, // optional, defaults to `false`
          height: 600, // optional, defaults to 578
          width: 380, // optional, defaults to 433
          top: 0, // optional, defaults to 0
          left: 0, // optional, defaults to 0
        },
        region: "eu-west-2",
        pageOptions: {
          // optional
          enableAudioDeviceSettings: true, // optional, defaults to 'false'
          enablePhoneTypeSettings: true, // optional, defaults to 'true'
        },
        softphone: {
          // optional
          allowFramedSoftphone: true, // optional
          disableRingtone: false, // optional
        },
      },
    });
    subscribeConnectEvents();
  }, []);

  return (
    <main>
      <div style={{ display: "flex", gap: 10 }}>
        {/* CCP window will load here */}
        <div id="ccp-container" style={{ width: 380, height: 600 }}></div>
        {/* Translate window will laod here. We pass the agent state to be able to use this to push messages to CCP */}
        <div id="chatroom">
          <Chatroom session={agentChatSessionState} />{" "}
        </div>
      </div>
    </main>
  );
}

export default App;
