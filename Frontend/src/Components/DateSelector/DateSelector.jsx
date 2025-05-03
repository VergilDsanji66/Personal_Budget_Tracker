import React, { useEffect, useState } from 'react';
import './DateSelector.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, isAfter } from 'date-fns';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const DateSelector = () => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [savedDates, setSavedDates] = useState({ start_date: '', end_date: '' });
  const [socket, setSocket] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateError, setDateError] = useState('');

  const currentMonthYear = format(new Date(), 'MMMM yyyy');

  // Helper function to format the date correctly
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return format(dateObj, 'dd MMMM yyyy');
  };

  // Handle date changes with validation
  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && isAfter(date, endDate)) {
      setDateError('Start date cannot be after end date');
    } else {
      setDateError('');
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (startDate && isAfter(startDate, date)) {
      setDateError('End date cannot be before start date');
    } else {
      setDateError('');
    }
  };

  // Handle submission with validation
  const handleSubmit = async (customStartDate = startDate, customEndDate = endDate) => {
    if (isAfter(customStartDate, customEndDate)) {
      setDateError('Start date cannot be after end date');
      return;
    }

    const formattedStart = customStartDate ? format(customStartDate, 'yyyy-MM-dd') : null;
    const formattedEnd = customEndDate ? format(customEndDate, 'yyyy-MM-dd') : null;

    try {
      await fetch('http://localhost:8000/date_range/db1', { // Ensure you're using the correct endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: formattedStart,
          end: formattedEnd,
        }),
      });
      setShowDatePicker(false);
      setDateError('');
    } catch (error) {
      console.error('Error submitting date range:', error);
    }
  };

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/db1'); // Use the correct WebSocket endpoint
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connection established');
      ws.send('get_date_range');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data) {
        setSavedDates(data.memory_db_1);  // For date display
        
        // Debug output to verify financial data
        console.log("Financial Data:", data.memory_db_2); 
        
        if (!data.memory_db_1.start_date && !data.memory_db_1.end_date) {
          const now = new Date();
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
          setStartDate(startOfMonth);
          setEndDate(endOfMonth);
          handleSubmit(startOfMonth, endOfMonth);
        }
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return (
    <div className='date-selector-container'>
      <div className="date-display" onClick={() => setShowDatePicker(!showDatePicker)}>
        <div className="date-range-text">
          <h3>Monthly summary from:</h3>
          {savedDates.start_date && savedDates.end_date ? (
            <div className="date-range">
              <span>{formatDate(savedDates.start_date)}</span>
              <span className='date-separator'>to</span>
              <span>{formatDate(savedDates.end_date)}</span>
            </div>
          ) : (
            <span>{currentMonthYear}</span>
          )}
        </div>

        <button 
          className="date-toggle-button" 
          aria-label="Select date range"
        >
          <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
        </button>
      </div>

      {showDatePicker && (
        <div className="datepicker-dropdown">
          <div className="picker-group-container">
            <div className="picker-row">
              <div className="picker-group">
                <label>Start Date</label>
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                  className="date-picker-input"
                />
              </div>

              <div className="picker-group">
                <label>End Date</label>
                <DatePicker
                  selected={endDate}
                  onChange={handleEndDateChange}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                  className="date-picker-input"
                />
              </div>
            </div>

            {dateError && <div className="date-error">{dateError}</div>}

            <div className="picker-actions">
              <button 
                onClick={() => handleSubmit()} 
                disabled={!startDate || !endDate || dateError}
                className="apply-button"
              >
                Apply Dates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;
