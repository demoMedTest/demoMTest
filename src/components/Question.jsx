import React, { useState, useEffect } from "react";

export default function Question() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index aktuálnej otázky
  const [answers, setAnswers] = useState({}); // Načítané odpovede
  const [questions, setQuestions] = useState([]); // Načítané otázky
  const [selectedOptions, setSelectedOptions] = useState({}); // Vybrané checkboxy
  const [results, setResults] = useState({}); // Uchováva stav správnych odpovedí
  const [range, setRange] = useState({ min: 0, max: 1000 }); // Rozsah pre generovanie
  const options = ["A", "B", "C", "D", "E", "F", "G", "H"];

  // Načítaj odpovede a otázky pri načítaní stránky
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}assets/B_odpovede.txt`)
      .then((res) => res.text())
      .then((data) => {
        const parsedAnswers = data.split("\n").reduce((acc, line) => {
          if (line.trim() === "") return acc; // Preskočí prázdne riadky
          const [question, answer] = line.trim().split(" ");
          acc[parseInt(question)] = answer; // Priradí číslo otázky a odpoveď
          return acc;
        }, {});
        setAnswers(parsedAnswers);
      });

    fetch(`${import.meta.env.BASE_URL}assets/B_otazky.txt`)
      .then((res) => res.text())
      .then((data) => {
        // Rozdeľ na riadky
        const lines = data.split("\n").filter((line) => line.trim() !== "");

        // Skupinovanie na bloky (otázka + 8 možností)
        const parsedQuestions = [];
        for (let i = 0; i < lines.length; i += 9) {
          const block = lines.slice(i, i + 9); // Vezmi 9 riadkov
          if (block.length !== 9) {
            console.log(`Skipping block due to incorrect line count:`, block);
            continue;
          }

          // Prvý riadok je otázka
          const questionText = block[0].replace(/^\d+\.\s*/, "");
          const questionNumber = block[0].match(/^\d+\./)?.[0]?.slice(0, -1) || "";

          // Zvyšné riadky sú možnosti
          const questionOptions = block.slice(1).reduce((acc, line, index) => {
            const key = String.fromCharCode(97 + index); // Generuje 'a', 'b', 'c', ...
            acc[key] = line.trim();
            return acc;
          }, {});

          // Ulož otázku do výsledku
          parsedQuestions.push({
            number: questionNumber,
            q: questionText,
            ...questionOptions,
          });
        }
        setQuestions(parsedQuestions);
      });
  }, []);

  // Načíta náhodnú otázku a resetuje stav
  const loadNextQuestion = () => {
    const min = range.min === "" ? 0 : range.min; // Default na 0, ak je prázdne
    const max = range.max === "" ? 1000 : range.max; // Default na 1000, ak je prázdne
  
    const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    setCurrentQuestionIndex(randomIndex);
    setSelectedOptions({}); // Reset checkboxov
    setResults({}); // Reset výsledkov
  };
  

  // Spracuje zmenu checkboxu
  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  // Porovná odpovede a nastaví správne checkboxy na zeleno
  const evaluateAnswers = () => {
    const correctAnswer = answers[currentQuestionIndex + 1] || ""; // Odpovede sú indexované od 1
    const newResults = {};

    // Prejdite cez všetky možnosti
    options.forEach((option, index) => {
      if (correctAnswer[index] === "S") {
        // Správna odpoveď
        newResults[option] =
          selectedOptions[option] === true ? "correct" : "missed"; // Ak nebola zvolená, označte ako "missed"
      } else {
        // Nesprávna odpoveď
        newResults[option] =
          selectedOptions[option] === true ? "wrong" : "neutral"; // Neutral pre nezvolenú nesprávnu
      }
    });

    setResults(newResults);
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
  
    setRange((prev) => ({
      ...prev,
      [name]: value === "" ? "" : parseInt(value, 10), // Ak je pole prázdne, nechá hodnotu prázdnu
    }));
  };
  

  return (
    <div className="d-flex flex-column mainContainer">
      <div className="input-group mb-3 rangeHolder">
      <span className="input-group-text">Rozsah:</span>
      <input
        type="number"
        name="min"
        value={range.min}
        onChange={handleRangeChange}
        className="form-control"
        placeholder="Od"
        aria-label="Od"
      />
      <span className="input-group-text">-</span>
      <input
        type="number"
        name="max"
        value={range.max}
        onChange={handleRangeChange}
        className="form-control"
        placeholder="Do"
        aria-label="Do"
      />
    </div>
      <div className="text-light">
        {questions.length > 0 ? (
          <>
            <h3>{`${currentQuestionIndex + 1}. ${
              questions[currentQuestionIndex]?.q || "Načítavam otázky..."
            }`}</h3>
            <div className="d-flex mt-4 flex-column">
              {Object.entries(questions[currentQuestionIndex] || {})
                .filter(([key]) => key !== "q" && key !== "number")
                .map(([key, value]) => (
                  <div
                    className="form-check d-flex align-items-center p-1 mt-2"
                    key={key}
                  >
                    <input
                      className="form-check-input me-2 hvrOption"
                      type="checkbox"
                      id={`checkbox-${key}`}
                      checked={!!selectedOptions[key.toUpperCase()]}
                      onChange={() => handleCheckboxChange(key.toUpperCase())}
                    />
                    <label
                      className="form-check-label hvrOpt"
                      htmlFor={`checkbox-${key}`}
                      style={{
                        wordBreak: "break-word",
                        backgroundColor:
                          results[key.toUpperCase()] === "correct"
                            ? "#5e9f58"
                            : results[key.toUpperCase()] === "wrong"
                            ? "#a84d4d"
                            : results[key.toUpperCase()] === "missed"
                            ? "#a84d4d"
                            : "transparent",
                        color:
                          results[key.toUpperCase()] === "correct" ||
                          results[key.toUpperCase()] === "wrong" ||
                          results[key.toUpperCase()] === "missed"
                            ? "#fff"
                            : "",
                        borderRadius: "5px",
                        padding: "5px",
                      }}
                    >
                      {value}
                    </label>
                  </div>
                ))}
            </div>
          </>
        ) : (
          <h3>Načítavam otázky...</h3>
        )}
      </div>
      <button
        onClick={evaluateAnswers}
        type="button"
        className="btn btn-secondary mt-5"
      >
        Vyhodnotiť
      </button>
      <button
        onClick={loadNextQuestion}
        type="button"
        className="btn btn-warning mt-5"
      >
        Ďalšia otázka
      </button>
    </div>
  );
}


