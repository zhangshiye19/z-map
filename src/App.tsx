// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useEffect } from 'react'
import './App.css'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import cmap from './CMapInst'

function App() {
  // const [count, setCount] = useState(0)

  useEffect(() => {
    console.log(cmap)
  },[])

  return (
    <>
    </>
  )
}

export default App
