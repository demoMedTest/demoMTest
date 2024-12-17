import { useState } from 'react'
import Question from './components/Question'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Question></Question>
    </div>
  )
}

export default App
