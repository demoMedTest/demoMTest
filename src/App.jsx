import { useState } from 'react'
import Question from './components/Question'
import './App.css'
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

ReactGA.initialize('G-56FMP4MD64'); // Nahraď "TVOJ_TRACKING_ID" tvojím Tracking ID
ReactGA.pageview(window.location.pathname + window.location.search); // Zaznamená načítanie stránky

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Question></Question>
    </div>
  )
}

export default App
