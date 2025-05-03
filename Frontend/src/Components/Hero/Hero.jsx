import React, { useEffect, useState } from 'react';
import './Hero.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillWave,
  faMoneyCheckAlt,
  faWallet,
  faHandHoldingUsd,
  faExchangeAlt
} from '@fortawesome/free-solid-svg-icons';

const iconMap = {
  total_money_in: faMoneyBillWave,
  total_money_out: faMoneyCheckAlt,
  latest_balance: faWallet,
  fees: faHandHoldingUsd,
  transaction_count: faExchangeAlt
};

const labelMap = {
  total_money_in: 'Money In',
  total_money_out: 'Money Out',
  latest_balance: 'Balance',
  fees: 'Fees',
  transaction_count: 'Transactions'
};

const Hero = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/db1');

    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      const db2 = parsed.memory_db_2;
      const filteredKeys = ['total_money_in', 'total_money_out', 'latest_balance', 'fees', 'transaction_count'];
      const formatted = filteredKeys.map(key => ({
        id: key,
        label: labelMap[key],
        value: db2[key]
      }));
      setData(formatted);
    };

    ws.onerror = (err) => console.error('WebSocket error:', err);

    return () => ws.close();
  }, []);

  return (
    <div className="hero-grid">
      {data.map(item => (
        <div className="hero-card" key={item.id} id={item.id}>
          <div className="hero-detail">
            <FontAwesomeIcon className="icon" icon={iconMap[item.id] || faWallet} size="2x" />
            <div className="text">
              <div className="hero-label">{item.label}</div>
              <div className="hero-value">
                {item.id === 'transaction_count' ? item.value : `R ${item.value}`}
              </div>
            </div>
          </div>
          <div className="percentage">
            <div className="percentage-value">+5.2%</div>
            <div className="percentage-label">from last month</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Hero;
