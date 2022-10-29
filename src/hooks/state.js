import { useEffect, useState } from "react";
import { createGlobalState } from "react-hooks-global-state";

const { setGlobalState, useGlobalState } = createGlobalState({
  languageTranslate: [],
  // Chats: [],
  endedContacts: [],
  connectedContacts: [],
  currentContactId: null,
  customerLanguage: "en",
  languageOptions: {
    Afrikaans: "af",
    Albanian: "sq",
    Amharic: "am",
    Arabic: "ar",
    Armenian: "hy",
    Azerbaijani: "az",
    Bengali: "bn",
    Bosnian: "bs",
    Bulgarian: "bg",
    Catalan: "ca",
    "Chinese (Simplified)": "zh",
    "Chinese (Traditional)": "zh-TW",
    Croatian: "hr",
    Czech: "cs",
    Danish: "da",
    Dari: "fa-AF",
    Dutch: "nl",
    English: "en",
    Estonian: "et",
    "Farsi (Persian)": "fa",
    "Filipino Tagalog": "tl",
    Finnish: "fi",
    French: "fr",
    "French (Canada)": "fr-CA",
    Georgian: "ka",
    German: "de",
    Greek: "el",
    Gujarati: "gu",
    "Haitian Creole": "ht",
    Hausa: "ha",
    Hebrew: "he",
    Hindi: "hi",
    Hungarian: "hu",
    Icelandic: "is",
    Indonesian: "id",
    Italian: "it",
    Japanese: "ja",
    Kannada: "kn",
    Kazakh: "kk",
    Korean: "ko",
    Latvian: "lv",
    Lithuanian: "lt",
    Macedonian: "mk",
    Malay: "ms",
    Malayalam: "ml",
    Maltese: "mt",
    Mongolian: "mn",
    Norwegian: "no",
    Persian: "fa",
    Pashto: "ps",
    Polish: "pl",
    Portuguese: "pt",
    Romanian: "ro",
    Russian: "ru",
    Serbian: "sr",
    Sinhala: "si",
    Slovak: "sk",
    Slovenian: "sl",
    Somali: "so",
    Spanish: "es",
    "Spanish (Mexico)": "es-MX",
    Swahili: "sw",
    Swedish: "sv",
    Tagalog: "tl",
    Tamil: "ta",
    Telugu: "te",
    Thai: "th",
    Turkish: "tr",
    Ukrainian: "uk",
    Urdu: "ur",
    Uzbek: "uz",
    Vietnamese: "vi",
    Welsh: "cy",
  },
  currentAgentLanguage: "en",
  agentLanguages: {
    English: "en",
    Spanish: "es",
    Hindi: "hi",
    "Chinese (Simplified)": "zh",
  },
});

// export const addChat = (Chats, contactId) => {
//   setGlobalState("Chats", Chats);
// };

// export const clearChat = () => {
//   setGlobalState("Chats", []);
// };

// export const setLanguageTranslate = (state) => {
//   setGlobalState("languageTranslate", state);
// };

export const setCurrentAgentLanguage = (lang) => {
  localStorage.setItem("currentAgentLanguage", lang);
};
export const addEndedContacts = (endedContacts) => {
  setGlobalState("endedContacts", endedContacts);
};
export const addConnectedContacts = (connectedContacts) => {
  setGlobalState("connectedContacts", connectedContacts);
};

export const setCustomerLanguage = (lang) => {
  setGlobalState("customerLanguage", lang);
};

export const setCurrentContactId = (contactId) => {
  setGlobalState("currentContactId", contactId);
};

export const addNewChatMsg = (newMsg) => {
  const previousMsgs =
    JSON.parse(localStorage.getItem("chatMessages-" + newMsg.contactId)) || [];
  const msgAlreadyAdded = previousMsgs.map(
    (msg) => msg.messageId === newMsg.messageId
  );
  console.log(msgAlreadyAdded);
  if (!msgAlreadyAdded.includes(true)) {
    previousMsgs.push(newMsg);
    localStorage.setItem(
      "chatMessages-" + newMsg.contactId,
      JSON.stringify(previousMsgs)
    );
  }
  var event = new Event("newChatMessage");
  document.dispatchEvent(event);
};

export function useChatMessages(contactId) {
  const [chatMessages, setChatMessages] = useState([]);

  let getMsgsFromLocalStorage = () => {
    const data =
      JSON.parse(localStorage.getItem("chatMessages-" + contactId)) || [];
    // console.log(data);
    console.log("[CHECKPOINT]");
    var languageList = [];
    data.map((message) => {
      if (message.msgAuthor === "customer") {
        languageList.push(message.translatedMessageData.SourceLanguageCode);
      }
    });
    const langToChange = languageList[languageList.length - 1];
    if (langToChange) {
      setCustomerLanguage(langToChange);
    } else {
      setCustomerLanguage("en");
    }
    setChatMessages(data);
    // return data;
  };

  useEffect(() => {
    console.log(contactId);
    if (contactId !== null) {
      getMsgsFromLocalStorage();
      document.addEventListener("newChatMessage", getMsgsFromLocalStorage);

      // Cleanup
      return () =>
        document.removeEventListener("newChatMessage", getMsgsFromLocalStorage);
    }
  }, [contactId]);
  return [chatMessages];
}

export function findActualTextFromId(textId) {
  const textID_DB = JSON.parse(localStorage.getItem("textID-DB")) || {};
  return textID_DB[textId];
}
export function addActualTextFromId(textContent, textId) {
  var textID_DB = JSON.parse(localStorage.getItem("textID-DB")) || {};
  textID_DB[textId] = textContent;
  localStorage.setItem("textID-DB", JSON.stringify(textID_DB));
}
export function clearActualTextFromIdDB() {
  localStorage.removeItem("textID-DB");
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    let currentValue;

    try {
      currentValue = JSON.parse(
        localStorage.getItem(key) || String(defaultValue)
      );
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

export { useGlobalState };
