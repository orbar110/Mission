import React, { useState, useEffect } from "react";

// Mission 1 - events class
class MyactionBusMission1 {
  constructor() {
    this._handlers = {};
  }

  registerListener(name, callback) {
    if (!this._handlers[name]) {
      this._handlers[name] = [];
    }
    this._handlers[name].push(callback);
  }

  removeListener(name) {
    delete this._handlers[name];
  }

  emit(name, payload) {
    if (!this._handlers[name]) {
      console.log(`Cannot trigger unknown event: "${name}"`);
    }

    else
    {
      this._handlers[name].forEach((cb) => cb(payload));
    }
  }
}

const actionBusMission1 = new MyactionBusMission1();

actionBusMission1.registerListener("PRINT", (data) =>
  console.log(`Don't tell me what I ${data} or ${data}'t do`)
  );
  
actionBusMission1.registerListener("PRINT", (data) =>
console.log(`I eat pickles right of the ${data}`)
);
  
actionBusMission1.emit("PRINT", "Can");
actionBusMission1.removeListener("PRINT");
actionBusMission1.emit("PRINT", "Can");


// Mission2 - virtual keyboard using the events class
const actionBusMission2 = new MyactionBusMission1();

// Checks if word exists using a free api
const checkWordInDictionary = async (word) => {
  const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
  return response.ok;
};

// Letter box component
const LetterBox = ({ value, state }) => {
  const borderStyles = {
    idle: "#999",
    success: "#28a745",
    error: "#dc3545",
  };

  return (
    <div
      style={{
        width: 50,
        height: 50,
        border: `2px solid ${borderStyles[state]}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        margin: 6,
        boxSizing: "border-box",
      }}
    >
      {value}
    </div>
  );
};

// virtual keyboard component
const VirtualKeyboard = () => {
  const keys = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", maxWidth: 320 }}>
      {keys.map((char) => (
        <button
          key={char}
          onClick={() => actionBusMission2.emit("CHAR", char)}
          style={{ margin: 4 }}
        >
          {char}
        </button>
      ))}
      <button onClick={() => actionBusMission2.emit("DELETE")}>⌫</button>
      <button onClick={() => actionBusMission2.emit("SUBMIT")}>Enter</button>
    </div>
  );
};

const App = () => {
  const [chars, setChars] = useState([]);
  const [boxState, setBoxState] = useState("idle");

  useEffect(() => {
    // Emit event when clicking a letter
    const addChar = (char) => {
      setBoxState("idle");
      setChars((prev) => (prev.length < 5 ? [...prev, char] : prev));
    };

    // Emit event when deleting a letter
    const deleteChar = () => {
      setBoxState("idle");
      setChars((prev) => prev.slice(0, -1));
    };

    // Emit event when submitting word
    const submit = async () => {
      if (chars.length === 5) {
        const word = chars.join("").toLowerCase();
        const exists = await checkWordInDictionary(word);
        setBoxState(exists ? "success" : "error");
      }
    };

    actionBusMission2.registerListener("CHAR", addChar);
    actionBusMission2.registerListener("DELETE", deleteChar);
    actionBusMission2.registerListener("SUBMIT", submit);

    return () => {
      actionBusMission2.removeListener("CHAR");
      actionBusMission2.removeListener("DELETE");
      actionBusMission2.removeListener("SUBMIT");
    };
  }, [chars]);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex" }}>
        {Array.from({ length: 5 }, (_, idx) => (
          <LetterBox key={idx} value={chars[idx] || ""} state={boxState} />
        ))}
      </div>
      <VirtualKeyboard />
    </div>
  );
};

export default App;
