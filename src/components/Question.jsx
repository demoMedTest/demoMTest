import React, { useState, useEffect } from 'react';

export default function Question() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index aktuálnej otázky
  const [answers, setAnswers] = useState({}); // Načítané odpovede
  const [questions, setQuestions] = useState([]); // Načítané otázky
  const [selectedOptions, setSelectedOptions] = useState({}); // Vybrané checkboxy
  const [results, setResults] = useState({}); // Uchováva stav správnych odpovedí
  const options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // Načítaj odpovede a otázky pri načítaní stránky
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}assets/answr.txt`)
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

    fetch(`${import.meta.env.BASE_URL}assets/question.txt`)
      .then((res) => res.text())
      .then((data) => {
        // Rozdeľ na riadky
        const lines = data.split('\n').filter((line) => line.trim() !== '');
        
        // Skupinovanie na bloky (otázka + 8 možností)
        const parsedQuestions = [];
        for (let i = 0; i < lines.length; i += 9) {
          const block = lines.slice(i, i + 9); // Vezmi 9 riadkov
          if (block.length !== 9) {
            console.log(`Skipping block due to incorrect line count:`, block);
            continue;
          }
    
          // Prvý riadok je otázka
          const questionText = block[0].replace(/^(\d+)\.\s*/, '');
          const questionNumber = block[0].match(/^(\d+)\./)?.[1] || '';
    
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
    
        console.log('Parsed Questions:', parsedQuestions); // Debugging načítaných otázok
        setQuestions(parsedQuestions);
      });
  }, []);

  // Načíta náhodnú otázku a resetuje stav
  const loadNextQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
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

    // Označí všetky správne odpovede
    options.forEach((option, index) => {
      if (correctAnswer[index] === "S") {
        newResults[option] = "correct";
      }
    });

    setResults(newResults);
  };

  return (
    <div className="d-flex  flex-column">
      <div className="text-light ">
  {questions.length > 0 ? (
    <>
      <h3>{`${currentQuestionIndex + 1}. ${questions[currentQuestionIndex]?.q || 'Načítavam otázky...'}`}</h3>
      <div className="d-flex mt-4 flex-column ">
        {Object.entries(questions[currentQuestionIndex] || {})
          .filter(([key]) => key !== 'q' && key !== 'number')
          .map(([key, value]) => (
            <div
              className="form-check d-flex align-items-center"
              key={key}
              style={{
                backgroundColor: results[key.toUpperCase()] === "correct" ? "#198754" : "transparent",
                borderRadius: "5px",
                padding: "5px",
              }}
            >
              <label
                className="form-check-label text-light hvrOption"
                htmlFor={`checkbox-${key}`}
                style={{
                  flex: "1", // Label zaberie dostupný priestor
                  marginBottom: "0", // Text zarovnaný bez medzery
                  wordBreak: "break-word", // Zalomí dlhý text
                  textAlign: "left", // Text zarovnaný naľavo
                }}
              >
                {value}
              </label>
              <input
                className="form-check-input checkBoxLarge"
                type="checkbox"
                id={`checkbox-${key}`}
                checked={!!selectedOptions[key.toUpperCase()]}
                onChange={() => handleCheckboxChange(key.toUpperCase())}
                style={{
                  marginLeft: "10px", // Medzera medzi textom a checkboxom
                }}
              />
            </div>
          ))}
      </div>
    </>
  ) : (
    <h3>Načítavam otázky...</h3>
  )}
</div>


      <button onClick={evaluateAnswers} type="button" className="btn btn-secondary mt-5">
        Vyhodnotiť
      </button>
      <button onClick={loadNextQuestion} type="button" className="btn btn-warning mt-5">
        Ďalšia otázka
      </button>
    </div>
  );
}

