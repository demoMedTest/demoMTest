import React, { useState, useEffect } from "react";
import 'bootstrap';


export default function Question() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index aktuálnej otázky
  const [answers, setAnswers] = useState({}); // Načítané odpovede
  const [questions, setQuestions] = useState([]); // Načítané otázky
  const [selectedOptions, setSelectedOptions] = useState({}); // Vybrané checkboxy
  const [results, setResults] = useState({}); // Uchováva stav správnych odpovedí
  const [range, setRange] = useState({ min: 1, max: 1000 }); // Rozsah pre generovanie
  const[mode, setMode] = useState(false);
  const[nextQuestionRandom, setNextQuestionRandom] = useState(true);
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
      setMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.body.style.background = window.matchMedia('(prefers-color-scheme: dark)').matches ? "#212529" : "#F8F9FA";
  }, []);

  const changeMode = () => {
    setMode((prev)=>!prev);
    if(mode){
      document.body.style.background = "#F8F9FA"
    }
    else{
      document.body.style.background = "#212529"
    }
  }

  const loadNextQuestion = () => {
    const min = range.min === "" ? 1 : range.min; // Default na 1, ak je prázdne
    const max = range.max === "" ? 1000 : range.max; // Default na 1000, ak je prázdne
    
    if(nextQuestionRandom){
    let randomIndex;
  
    do {
      randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (randomIndex - 1 === currentQuestionIndex); // Kontrola, aby sa nevygenerovalo rovnaké číslo
  
    setCurrentQuestionIndex(randomIndex - 1); // Nastav index na otázku (offset o -1)
    }else{
      if(currentQuestionIndex>=min-1 && currentQuestionIndex<=max-1){
        if(currentQuestionIndex+1 == max){
        setCurrentQuestionIndex(min-1);
      } else{
        setCurrentQuestionIndex(currentQuestionIndex+1);
      }
      
    }else{
      setCurrentQuestionIndex(min-1);
    }
    }

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

  const handleUnFocused = (e) => {
    let { name, value } = e.target;

    if (name === "min" && (value < 1 || value >= 1000)) value = 1;
    if (name === "max" && (value < 1 || value > 1000)) value = 1000;
  
    if (range.min === range.max) {
      setRange({ min: range.min, max: 1000 });
      if (name === "max") {
        value = 1000;
      }
    } else if (range.min > range.max) {
      
      setRange({ min: range.min, max: 1000 });
      if (name === "max") {
        value = 1000;
      }
    }
  
    setRange((prev) => ({
      ...prev,
      [name]: value === "" ? "" : parseInt(value, 10), 
    }));
  };

  const handleSelectionOrderChange = (e) =>{
      if(e.target.id =="btnradio1"){
        setNextQuestionRandom(true);
      } else{
        setNextQuestionRandom(false);
      }
  }
  
  return (
    <div className="d-flex flex-column mainContainer">
      
      
      <div className="input-group mb-3 rangeHolder ms-auto fixed-top mb-5 d-flex justify-content-center">
        <div className="d-flex mb-3 doubleMenu justify-content-center align-items-center m-0">
        <div className="form-check form-switch modeWrapper">
          <input className="form-check-input toggler" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={changeMode} checked={mode? true: false}></input>
        </div>

        <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" className="btn-check" name="btnradio" id="btnradio1" defaultChecked={true} onChange={handleSelectionOrderChange}></input>
          <label className="btn btn-outline-success" htmlFor="btnradio1">Náhodný výber</label>

          <input type="radio" className="btn-check" name="btnradio" id="btnradio2" onChange={handleSelectionOrderChange}></input>
          <label className="btn btn-outline-success" htmlFor="btnradio2">Podľa poradia</label>
        </div>
      </div>
      <div className="d-flex rangeSizer">
      <span className="input-group-text rozsahText">Rozsah:</span>
      <input
        type="number"
        name="min"
        value={range.min}
        onChange={handleRangeChange}
        onBlur={handleUnFocused}
        className="form-control borderForm"
        placeholder="Od"
        aria-label="Od"
      />
      <span className="input-group-text">-</span>
      <input
        type="number"
        name="max"
        value={range.max}
        onChange={handleRangeChange}
        onBlur={handleUnFocused}
        className="form-control maxNmb"
        placeholder="Do"
        aria-label="Do"
      />
      </div>
    </div>
      <div className={mode ? "text-light" : "text-dark"}>
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
                    className="form-check d-flex align-items-center p-1"
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
        className="btn btn-warning mt-4"
        id="resolve"
      >
        Ďalšia otázka
      </button>
    </div>
  );
}


