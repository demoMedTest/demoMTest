import React, { useState, useEffect } from 'react';

export default function Question() {
  const [currentImage, setCurrentImage] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null); 
  const [answers, setAnswers] = useState({}); // Načítané odpovede
  const [selectedOptions, setSelectedOptions] = useState({}); // Vybrané checkboxy
  const totalImages = 3;
  const options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];


  useEffect(() => {
    fetch("/assets/answr.txt")
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

  // Načíta náhodný obrázok a otázku
  const loadRandomImage = () => {
    const randomImageNumber = Math.floor(Math.random() * totalImages) + 1;
    setCurrentImage(`/assets/test${randomImageNumber}.png`);
    setCurrentQuestion(randomImageNumber);
    setSelectedOptions({}); // Reset checkboxov
  };

  // Spracuje zmenu checkboxu
  const handleCheckboxChange = (option) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };
  // Porovná vybrané odpovede
  const evaluateAnswers = () => {
    console.log("current q"+currentQuestion)
    const correctAnswer = answers[currentQuestion] || "";
    const selectedAnswer = options
      .map((option, index) => (selectedOptions[option] ? "S" : "N"))
      .join("");
    if (correctAnswer === selectedAnswer) {
      alert("Správne!");
    } else {
      alert(`Nesprávne! Správna odpoveď je: ${correctAnswer}`);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-column">
      <div>
        <img src={currentImage} alt="Test Image" className="max-w-200" />
      </div>
      <div className="d-flex justify-content-around mt-4 w-75">
        {options.map((option) => (
          <div className="form-check d-flex align-items-center" key={option}>
            <input
              className="form-check-input checkBoxLarge"
              type="checkbox"
              id={`checkbox-${option}`}
              checked={!!selectedOptions[option]}
              onChange={() => handleCheckboxChange(option)}
            />
            <label
              className="form-check-label ms-2 text-light"
              htmlFor={`checkbox-${option}`}
            >
              {option}
            </label>
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


