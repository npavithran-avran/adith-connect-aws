class translateText {
  constructor(text, source_lang, target_lang) {
    this.text = text;
    this.source_lang = source_lang;
    this.target_lang = target_lang;
  }
  async getTranslatedText() {
    const response = await fetch(
      "https://nip07a3jsf.execute-api.eu-west-2.amazonaws.com/dev/translate-endpoint",
      {
        method: "POST",
        body: JSON.stringify({
          text: this.text,
          source_lang: this.source_lang,
          target_lang: this.target_lang,
        }),
        headers: {
          accept: "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  }
}
export default translateText;
