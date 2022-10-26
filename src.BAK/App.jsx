import { useEffect, useState } from "react";
import translateText from "./assets/translateText";
import Chatroom from "./components/Chatroom";
// import SubscribeConnectEvents from "./assets/SubscribeConnectEvents";
// import TranslateChat from "./components/TranslateChat";
import {
  addChat,
  addEndedContacts,
  addNewChatMsg,
  setCurrentContactId,
  setCustomerLanguage,
  useGlobalState,
} from "./hooks/state";

function App() {
  const connect = window.connect;
  // useEffect(() => {}, [connect]);
  return (
    <div className="App">
      {connect ? (
        <>
          <CCP />
          {/* <TranslateChat /> */}
          {/* <TranslateText text={'hola'} lang={'en'} /> */}
        </>
      ) : (
        ""
      )}
    </div>
  );
}

function CCP() {
  const [agentChatSessionState, setAgentChatSessionState] = useState([]);
  const [agentLanguages] = useGlobalState("agentLanguages");
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
                "agent",
                messageData
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
                "customer",
                messageData
              );
            }
          }
        });
      });
  }
  // *******
  // Processing the incoming chat from the Customer
  // *******
  async function processChatText(
    content,
    type,
    contactId,
    msgAuthor,
    messageData
  ) {
    // setLanguageTranslate(languageTranslate);
    const agentLang = localStorage.getItem("currentAgentLanguage");
    let translatedMessage = await new translateText(
      content,
      "auto",
      Object.values(agentLanguages).includes(agentLang) ? agentLang : "en"
    ).getTranslatedText();
    // console.log(currentAgentLanguage[0]);
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
      messageId: messageData.data.Id,
      timestamp: messageData.data.AbsoluteTime
    };
    // Add the new message to the store
    // addChat((prevMsg) => [...prevMsg, newMsg]);
    addNewChatMsg(newMsg);
    // if (msgAuthor === "customer") {
    //   setCustomerLanguage(translatedMessage.SourceLanguageCode);
    // }
  }

  function subscribeConnectEvents() {
    window.connect.core.onViewContact(function (event) {
      var contactId = event.contactId;
      setCurrentContactId(contactId);
      console.log("CDEBUG ===> onViewContact", contactId);
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
          setCurrentContactId(contact.contactId);
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

          addEndedContacts((prevContacts) => [
            ...prevContacts,
            contact.contactId,
          ]);
          localStorage.removeItem("chatMessages-" + contact.contactId);
        });

        // This is invoked when the agent moves out of ACW to a different state
        contact.onDestroy(() => {
          console.log(
            "CDEBUG ===> onDestroy() >> contactId: ",
            contact.contactId
          );
          setCurrentContactId(null);
          // setCustomerLanguage("en");
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
    <div className="CCP">
      <div className="d-flex gap-3">
        <div id="ccp-container" style={{ width: 380, height: 600 }}></div>
        <div id="chatroom" style={{ width: 380, height: 600 }}>
          <Chatroom session={agentChatSessionState} />{" "}
        </div>
      </div>
    </div>
  );
}

export default App;
