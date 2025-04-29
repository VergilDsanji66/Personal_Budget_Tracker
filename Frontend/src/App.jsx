import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import DateSelector from './Components/DateSelector/DateSelector'
import Testing from './Testing'

const App = () => {
  return (
    <div>
      <Navbar/>
      <DateSelector/>
      <Testing/>
    </div>
  )
}

export default App