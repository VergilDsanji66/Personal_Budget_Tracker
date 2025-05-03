import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import DateSelector from './Components/DateSelector/DateSelector'
import Hero from './Components/Hero/Hero'
import SummaryBreakDown from './Components/SummaryBreakDown/SummaryBreakDown'
// import Testing from './Testing'

const App = () => {
  return (
    <div>
      <Navbar/>
      <DateSelector/>
      <Hero/>
      <div className="grid">
        <SummaryBreakDown/>
      </div>
      {/* <Testing/> */}
    </div>
  )
}

export default App