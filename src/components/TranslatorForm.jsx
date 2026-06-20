import { useState } from "react";
import logo from "../assets/pollyglot.png";

function TranslatorForm() {
  const [language, setLanguage] = useState("French");
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleTranslate() {
    if (!text.trim()) {
      alert("Please enter text first.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-120b",
            messages: [
              {
                role: "user",
                content: `
You are a professional translator.

Translate the text below into ${language}.

Rules:
- Return ONLY the translation
- Do NOT explain anything
- Keep meaning natural and fluent

Text:
${text}
`,
              },
            ],
            temperature: 0.4,
            max_tokens: 200,
          }),
        },
      );

      const data = await response.json();

      const translation =
        data?.choices?.[0]?.message?.content || "No translation received";

      setTranslatedText(translation);
      setShowResult(true);
    } catch (error) {
      console.error(error);
      setTranslatedText("Translation failed. Try again.");
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setText("");
    setTranslatedText("");
    setShowResult(false);
  }

  function speakTranslation() {
    const speech = new SpeechSynthesisUtterance(translatedText);

    speechSynthesis.speak(speech);
  }

  function copyTranslation() {
    navigator.clipboard.writeText(translatedText);

    alert("Translation copied!");
  }

  return (
    <div className="translator-card">
      <div className="logo-section">
        <div className="banner">
          <img src={logo} alt="PollyGlot Logo" />
          <div className="banner-text">
            <h1>PollyGlot</h1>
            <p>Perfect Translation Every Time</p>
          </div>
        </div>
      </div>
      {!showResult ? (
        <>

        <div className="text-part">
            <p className="head-text">Text to translate 👇</p>
          <textarea
            placeholder="Write something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <p className="counter"> {text.length}/5000 Characters</p>

          <div className="section-title">
            <h3>🌎 Choose Language 👇</h3>
          </div>

          <div className="languages">
            <label>
              <input
                type="radio"
                name="language"
                checked={language === "French"}
                onChange={() => setLanguage("French")}
              />
              French 🇫🇷
            </label>

            <label>
              <input
                type="radio"
                name="language"
                checked={language === "Spanish"}
                onChange={() => setLanguage("Spanish")}
              />
              Spanish 🇪🇸
            </label>

            <label>
              <input
                type="radio"
                name="language"
                checked={language === "Japanese"}
                onChange={() => setLanguage("Japanese")}
              />
              Japanese  🇯🇵
            </label>
          </div>

          {loading && <p className="loading">🦜 Polly is translating...</p>}

          <button onClick={handleTranslate} disabled={loading || !text.trim()}>
            🚀 Translate
          </button>

          </div>
        </>
      ) : (
        <>

         <div className="text-part">


          <h2 className="result-title"> Original Text 👇</h2>
          <div className="result-box">{text}</div>

    
          <h2 className="result-title">
            Translation ({language})
          </h2>
          <div className="result-box">{translatedText}</div>

        


          <button onClick={copyTranslation} className="result-btn">📋 Copy Translation</button>

          <button onClick={speakTranslation} className="result-btn">🔊 Listen</button>

          <button onClick={handleReset} className="result-btn">🔄 Start Over</button>

         </div>


        
        </>
      )}
    </div>
  );
}

export default TranslatorForm;
