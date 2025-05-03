import React, { useEffect, useState } from 'react';

const Testing = () => {
  const [financialData, setFinancialData] = useState({
    total_balance: 0,
    total_money_in: 0,
    total_money_out: 0,
    fees: 0,
    transaction_count: 0,
    last_updated: null
  });
  const [dateRange, setDateRange] = useState({ start_date: null, end_date: null });
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket('ws://localhost:8000/ws/db1');
    setSocket(ws);

    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send('get_date_range');
      setIsLoading(false);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Data received:', data);
      
      if (data.memory_db_1) {
        setDateRange(data.memory_db_1);
      }
      
      if (data.memory_db_2) {
        setFinancialData(prev => ({
          ...prev,
          ...data.memory_db_2
        }));
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsLoading(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return (
    <div className="financial-dashboard">
      <h2>Financial Dashboard</h2>
      
      {isLoading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <>
          <div className="date-range-section">
            <h3>Selected Date Range</h3>
            {dateRange.start_date && dateRange.end_date ? (
              <p>
                {new Date(dateRange.start_date).toLocaleDateString()} to {' '}
                {new Date(dateRange.end_date).toLocaleDateString()}
              </p>
            ) : (
              <p>No date range selected</p>
            )}
          </div>

          <div className="financial-metrics">
            <div className="metric-card">
              <h4>Total Balance</h4>
              <p className="amount">{formatCurrency(financialData.total_balance)}</p>
            </div>
            
            <div className="metric-card">
              <h4>Money In</h4>
              <p className="amount positive">{formatCurrency(financialData.total_money_in)}</p>
            </div>
            
            <div className="metric-card">
              <h4>Money Out</h4>
              <p className="amount negative">{formatCurrency(financialData.total_money_out)}</p>
            </div>
            
            <div className="metric-card">
              <h4>Fees</h4>
              <p className="amount negative">{formatCurrency(financialData.fees)}</p>
            </div>
            
            <div className="metric-card">
              <h4>Transactions</h4>
              <p className="count">{financialData.transaction_count}</p>
            </div>
          </div>

          <div className="last-updated">
            <p>Last updated: {formatDate(financialData.last_updated)}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Testing;