import React, { useState, useEffect } from 'react';

export default function Question() {
  const [currentImage, setCurrentImage] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null); 
  const [answers, setAnswers] = useState({}); // Načítané odpovede
  const [selectedOptions, setSelectedOptions] = useState({}); // Vybrané checkboxy
  const [results, setResults] = useState({}); // Uchováva stav správnych odpovedí
  const totalImages = 3;
  const options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  // Načítaj odpovede pri načítaní stránky
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}assets/answr.txt`)
      .then((res) => res.text())
      .then((data) => {
        const parsedAnswers = data.split("\n").reduce((acc, line) => {
          const [question, answer] = line.split(".");
          acc[parseInt(question)] = answer.trim();
          return acc;
        }, {});
        setAnswers(parsedAnswers);
      });
    loadRandomImage();
  }, []);

  // Načíta náhodný obrázok a resetuje stav
  const loadRandomImage = () => {
    const randomImageNumber = Math.floor(Math.random() * totalImages) + 1;
    setCurrentImage(`${import.meta.env.BASE_URL}assets/test${randomImageNumber}.png`);
    setCurrentQuestion(randomImageNumber);
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
    const correctAnswer = answers[currentQuestion] || "";
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
    <div className="d-flex justify-content-center align-items-center flex-column">
      <div>
        <img src={currentImage} alt="Test Image" />
      </div>
      <div className="d-flex justify-content-around mt-4 w-75">
  {options.map((option) => (
    <div
      className="form-check d-flex flex-column align-items-center"
      key={option}
      style={{
        backgroundColor: results[option] === "correct" ? "#198754" : "transparent",
        borderRadius: "5px",
        padding: "5px",
      }}
    >
      <label
        className="form-check-label text-light"
        htmlFor={`checkbox-${option}`}
        style={{
          marginBottom: "5px", // Malá medzera medzi label a checkboxom
          textAlign: "center", // Zarovná text na stred
        }}
      >
        {option}
      </label>
      <input
        className="form-check-input checkBoxLarge"
        type="checkbox"
        id={`checkbox-${option}`}
        checked={!!selectedOptions[option]}
        onChange={() => handleCheckboxChange(option)}
        style={{
          margin: "0 auto", // Uistí sa, že checkbox je presne na stred
        }}
      />
    </div>
  ))}
</div>
      <button onClick={evaluateAnswers} type="button" className="btn btn-success mt-5">
        Vyhodnotiť
      </button>
      <button onClick={loadRandomImage} type="button" className="btn btn-warning mt-5">
        Ďalšia otázka
      </button>
    </div>
  );
}



