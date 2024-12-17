import React, {useState} from 'react';



export default function Question() {
  const[currentImage, setCurrentImage] = useState(null);
  const totalImages = 3; 
  const options = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  const loadRandomImage = () =>{
    const randomImageNumber = Math.floor(Math.random() * totalImages) +1;
    setCurrentImage(`/assets/test${randomImageNumber}.png`);
  }

  return (
    <div className="d-flex justify-content-center align-items-center flex-column">
      
      <div>
        <img src={currentImage} alt="Test Image" />
      </div>
      <div className="d-flex justify-content-around mt-4 w-75">
        {options.map((option, index) => (
          <div className="form-check d-flex align-items-center" key={index}>
            <input
              className="form-check-input checkBoxLarge"
              type="checkbox"
              id={`checkbox-${option}`} 
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
      <button type="button" className="btn btn-success mt-5">
        Vyhodnotiť
      </button>
      <button 
      onClick={loadRandomImage}
      type="button" 
      className="btn btn-warning mt-5">
        Ďalšia otázka
      </button>
    </div>
  );
}

