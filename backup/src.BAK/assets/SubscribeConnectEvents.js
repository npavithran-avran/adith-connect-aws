// import { useState } from "react";

// function SubscribeConnectEvents() {
//   const [languageTranslate] = useGlobalState("languageTranslate");
//   var localLanguageTranslate = [];
//   const [Chats] = useGlobalState("Chats");
//   const [lang, setLang] = useState("");
//   const [currentContactId] = useGlobalState("currentContactId");
//   const [languageOptions] = useGlobalState("languageOptions");
//   const [agentChatSessionState, setAgentChatSessionState] = useState([]);
//   const [setRefreshChild] = useState([]);



//   window.connect.core.onViewContact(function (event) {
//     var contactId = event.contactId;
//     console.log("CDEBUG ===> onViewContact", contactId);
//     setCurrentContactId(contactId);
//   });

//   console.log("CDEBUG ===> subscribeConnectEvents");

//   if (window.connect.ChatSession) {
//     console.log("CDEBUG ===> Subscribing to Connect Contact Events for chats");
//     window.connect.contact((contact) => {
//       // This is invoked when CCP is ringing
//       contact.onConnecting(() => {
//         console.log(
//           "CDEBUG ===> onConnecting() >> contactId: ",
//           contact.contactId
//         );
//         let contactAttributes = contact.getAttributes();
//         console.log(
//           "CDEBUG ===> contactAttributes: ",
//           JSON.stringify(contactAttributes)
//         );
//         let contactQueue = contact.getQueue();
//         console.log("CDEBUG ===> contactQueue: ", contactQueue);
//       });

//       // This is invoked when the chat is accepted
//       contact.onAccepted(async () => {
//         console.log("CDEBUG ===> onAccepted: ", contact);
//         const cnn = contact
//           .getConnections()
//           .find((cnn) => cnn.getType() === window.connect.ConnectionType.AGENT);
//         const agentChatSession = await cnn.getMediaController();
//         setCurrentContactId(contact.contactId);
//         console.log("CDEBUG ===> agentChatSession ", agentChatSession);
//         // Save the session to props, this is required to send messages within the chatroom.js
//         setAgentChatSessionState((agentChatSessionState) => [
//           ...agentChatSessionState,
//           { [contact.contactId]: agentChatSession },
//         ]);

//         // Get the language from the attributes, if the value is valid then add to the store
//         localLanguageTranslate = contact.getAttributes().x_lang.value;
//         if (
//           Object.keys(languageOptions).find(
//             (key) => languageOptions[key] === localLanguageTranslate
//           ) !== undefined
//         ) {
//           console.log(
//             "CDEBUG ===> Setting lang code from attribites:",
//             localLanguageTranslate
//           );
//           languageTranslate.push({
//             contactId: contact.contactId,
//             lang: localLanguageTranslate,
//           });
//           setLanguageTranslate(languageTranslate);
//           setRefreshChild("updated"); // Workaround to force a refresh of the chatroom UI to show the updated language based on contact attribute.
//         }
//         console.log(
//           "CDEBUG ===> onAccepted, languageTranslate ",
//           languageTranslate
//         );
//       });

//       // This is invoked when the customer and agent are connected
//       contact.onConnected(async () => {
//         console.log(
//           "CDEBUG ===> onConnected() >> contactId: ",
//           contact.contactId
//         );
//         const cnn = contact
//           .getConnections()
//           .find((cnn) => cnn.getType() === window.connect.ConnectionType.AGENT);
//         const agentChatSession = await cnn.getMediaController();
//         getEvents(contact, agentChatSession);
//       });

//       // This is invoked when new agent data is available
//       contact.onRefresh(() => {
//         console.log(
//           "CDEBUG ===> onRefresh() >> contactId: ",
//           contact.contactId
//         );
//       });

//       // This is invoked when the agent moves to ACW
//       contact.onEnded(() => {
//         console.log("CDEBUG ===> onEnded() >> contactId: ", contact.contactId);
//       });

//       // This is invoked when the agent moves out of ACW to a different state
//       contact.onDestroy(() => {
//         console.log(
//           "CDEBUG ===> onDestroy() >> contactId: ",
//           contact.contactId
//         );
//         // TODO need to remove the previous chats from the store
//         //clearChat()
//         setCurrentContactId("");
//       });
//     });

//     /* 
//     **** Subscribe to the agent API **** 
//     See : https://github.com/aws/amazon-connect-streams/blob/master/Documentation.md
//     */

//     console.log("CDEBUG ===> Subscribing to Connect Agent Events");
//     window.connect.agent((agent) => {
//       agent.onStateChange((agentStateChange) => {
//         // On agent state change, update the React state.
//         let state = agentStateChange.newState;
//         console.log("CDEBUG ===> New State: ", state);
//       });
//     });
//   } else {
//     console.log("CDEBUG ===> waiting 3s");
//     setTimeout(function () {
//       SubscribeConnectEvents();
//     }, 3000);
//   }
//   return <></>;
// }
// export default SubscribeConnectEvents;
