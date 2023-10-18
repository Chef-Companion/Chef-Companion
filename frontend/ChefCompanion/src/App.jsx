import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [backend, setBackend] = useState(false);

  useEffect(() => {
    fetch('/api')
      .then(x => x.json())
      .then(data => setBackend(data.working));
  }, [])

  return (
    <div className='App'>
      Frontend: Working
      <br></br>
      Backend Connection:
      {backend ? ' Working' : ' Not Working'}
    </div>
  )
}

export default App
