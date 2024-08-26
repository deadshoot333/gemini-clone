import React from "react";
import { useState } from "react";
const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const surpriseOptions = [
    "What are you?",
    "What is life?",
    "Never gonna let you down",
  ];
  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };
  const getResponse = async () => {
    if (!value) {
      setError("Without asking anything I can provide nothing");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      console.log(data);
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [value],
        },
        {
          role: "model",
          parts: [data],
        },
      ]);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong :(");
    }
  };
  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };
  return (
    <div className="app">
      <p>
        What you want to know from me?
        <button className="pookie" onClick={surprise} disabled={!chatHistory}>
          Pookie
        </button>
      </p>
      <div className="input-container">
        <input
          value={value}
          placeholder="Type Here..."
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse}>Ask me</button>}
        {error && <button onClick={clear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-section">
        {chatHistory.map((chatitem, _index) => (
          <div key={_index}>
            <p className="answer">
              {chatitem.role}: {chatitem.parts.join("\n")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
