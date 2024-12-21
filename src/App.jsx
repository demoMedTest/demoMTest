import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import Question from './components/Question';
import './App.css';

// Inicializácia Google Analytics
ReactGA.initialize('G-56FMP4MD64'); 

function App() {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return (
    <div>
      <Question />
    </div>
  );
}

export default App;
