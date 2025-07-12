import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import Admin from './Pages/Admin/Admin'
import { useState } from 'react'

const App = () => {
  const [menu,setMenu]=useState("Shop")

  return (
    <div>
      <Navbar />
      <Admin/>
    </div>
  )
}

export default App
