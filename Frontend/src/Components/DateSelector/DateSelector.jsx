import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { format, parseISO, isBefore, isAfter } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import './DateSelector.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const DateSelector = ({ onDateRangeChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showPickers, setShowPickers] = useState(false);
  const [error, setError] = useState('');

  // Initialize with current month range
  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setStartDate(firstDay);
    setEndDate(lastDay);
  }, []);

  // Format date as "dd Month yyyy"
  const formatDisplayDate = (date) => {
    if (!date) return '';
    return format(date, 'dd MMMM yyyy');
  };

  // Current month/year display
  const currentMonthYear = format(new Date(), 'MMMM yyyy');

  const handleStartDateChange = (date) => {
    if (endDate && isAfter(date, endDate)) {
      setError('Start date cannot be after end date');
      return;
    }
    setError('');
    setStartDate(date);
    if (onDateRangeChange) {
      onDateRangeChange({ start: date, end: endDate });
    }
  };

  const handleEndDateChange = (date) => {
    if (startDate && isBefore(date, startDate)) {
      setError('End date cannot be before start date');
      return;
    }
    setError('');
    setEndDate(date);
    if (onDateRangeChange) {
      onDateRangeChange({ start: startDate, end: date });
    }
  };

  const togglePickers = () => {
    setShowPickers(!showPickers);
    setError(''); // Clear error when toggling
  };

  return (
    <div className="date-selector-container">
      <div className="date-display" onClick={togglePickers}>
        <div className="date-range-text">
          {startDate && endDate ? (
            <>
              <span>{formatDisplayDate(startDate)}</span>
              <span className="date-separator">to</span>
              <span>{formatDisplayDate(endDate)}</span>
            </>
          ) : (
            <span>{currentMonthYear}</span>
          )}
        </div>
        
        <button className="date-toggle-button" aria-label="Select date range">
          <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
        </button>
      </div>

      {showPickers && (
        <div className="date-picker-dropdown">
          <div className="picker-row">
            <div className="picker-group">
              <label>Start Date</label>
              <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
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
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
                className="date-picker-input"
              />
            </div>
          </div>
          
          {error && <div className="date-error">{error}</div>}
          
          <div className="picker-actions">
            <button 
              className="apply-button"
              onClick={() => {
                setShowPickers(false);
                if (onDateRangeChange) {
                  onDateRangeChange({ start: startDate, end: endDate });
                }
              }}
            >
              Apply Dates
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector;