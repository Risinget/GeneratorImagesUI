import { useState } from 'react'
import Component from './layouts/image-generator'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Component />
    </>
  )
}

export default App
