import React from 'react'
import './Navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="logo">
            <h1>Personal Budget Tracker</h1>
            <p></p>
        </div>
        <div className="im-ex-port">
            <button className="port"> Import<FontAwesomeIcon className='icon' icon={faArrowUpFromBracket} /></button>
            <button className="port">Export <FontAwesomeIcon className='icon export' icon={faArrowUpFromBracket}/> </button>
        </div>
    </div>
  )
}

export default Navbar