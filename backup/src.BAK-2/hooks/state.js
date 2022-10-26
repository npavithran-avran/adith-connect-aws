import { createGlobalState } from "react-hooks-global-state";
import { useState, useEffect } from "react";

const { setGlobalState, useGlobalState } = createGlobalState({
  languageTranslate: [],
  // Chats: [],
  currentContactId: '',
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
});

// export const addChat = (Chats, contactId) => {
//   setGlobalState("Chats", Chats);
// };

// export const clearChat = () => {
//   setGlobalState("Chats", []);
// };

export const setLanguageTranslate = (state) => {
  setGlobalState("languageTranslate", state);
};

export const setCustomerLanguage = (lang) => {
  setGlobalState("customerLanguage", lang);
};

export const setCurrentContactId = (contactId) => {
  setGlobalState("currentContactId", contactId);
};

export { useGlobalState };

export const addNewChatMsg = (newMsg) => {
  const previousMsgs =
    JSON.parse(localStorage.getItem("chatMessages-" + newMsg.contactId)) || [];
  previousMsgs.push(newMsg);
  localStorage.setItem(
    "chatMessages-" + newMsg.contactId,
    JSON.stringify(previousMsgs)
  );
  var event = new Event("newChatMessage");
  document.dispatchEvent(event);
};

function useChatMessages(contactId) {
  function getMsgsFromLocalStorage(id) {
    const data = JSON.parse(localStorage.getItem("chatMessages-" + id)) || [];
    return data;
  }
  const [chatMessages, setChatMessages] = useState([]);
  useEffect(() => {
    setChatMessages(getMsgsFromLocalStorage(contactId));
  }, []);
  useEffect(() => {
    document.addEventListener(
      "newChatMessage",
      function (e) {
        // console.log("Called");
        setChatMessages(getMsgsFromLocalStorage());
      },
      false
    );
  });
  return [chatMessages];
}



export { useChatMessages };
