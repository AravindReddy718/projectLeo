import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import './ChairmanFinancial.css';

const FinancialReports = () => {
  const [financialData, setFinancialData] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [timeRange, setTimeRange] = useState('quarterly');

  useEffect(() => {
    // Mock data - replace with API
    setFinancialData({
      totalRevenue: 2456700,
      totalExpenses: 1876500,
      netProfit: 580200,
      revenueGrowth: 12.5,
      expenseGrowth: 8.2
    });

    setRevenueData([
      { category: 'Room Rent', amount: 1567800, percentage: 63.8, trend: 'up' },
      { category: 'Mess Charges', amount: 654300, percentage: 26.6, trend: 'up' },
      { category: 'Amenities Fee', amount: 198400, percentage: 8.1, trend: 'stable' },
      { category: 'Other Income', amount: 36200, percentage: 1.5, trend: 'down' }
    ]);

    setExpenseData([
      { category: 'Staff Salaries', amount: 856000, percentage: 45.6 },
      { category: 'Maintenance', amount: 423500, percentage: 22.6 },
      { category: 'Utilities', amount: 287300, percentage: 15.3 },
      { category: 'Food Supplies', amount: 214700, percentage: 11.4 },
      { category: 'Administrative', amount: 95000, percentage: 5.1 }
    ]);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Layout>
      <div className="financial-reports">
        <div className="reports-header">
          <h1>Financial Reports & Analysis</h1>
          <div className="report-controls">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="time-selector"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="financial-summary">
          <div className="summary-card revenue">
            <h3>Total Revenue</h3>
            <p className="amount">{formatCurrency(financialData.totalRevenue)}</p>
            <p className="growth positive">+{financialData.revenueGrowth}% vs last period</p>
          </div>
          <div className="summary-card expenses">
            <h3>Total Expenses</h3>
            <p className="amount">{formatCurrency(financialData.totalExpenses)}</p>
            <p className="growth negative">+{financialData.expenseGrowth}% vs last period</p>
          </div>
          <div className="summary-card profit">
            <h3>Net Profit</h3>
            <p className="amount">{formatCurrency(financialData.netProfit)}</p>
            <p className="growth positive">23.6% Profit Margin</p>
          </div>
        </div>

        <div className="financial-content">
          {/* Revenue Breakdown */}
          <div className="revenue-section">
            <h3>Revenue Breakdown</h3>
            <div className="revenue-chart">
              {revenueData.map((item, index) => (
                <div key={item.category} className="revenue-item">
                  <div className="revenue-info">
                    <span className="category">{item.category}</span>
                    <span className="amount">{formatCurrency(item.amount)}</span>
                    <span className="percentage">{item.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${item.trend}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="expense-section">
            <h3>Expense Breakdown</h3>
            <div className="expense-chart">
              {expenseData.map(item => (
                <div key={item.category} className="expense-item">
                  <div className="expense-info">
                    <span className="category">{item.category}</span>
                    <span className="amount">{formatCurrency(item.amount)}</span>
                    <span className="percentage">{item.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill expense"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hall-wise Financial Performance */}
          <div className="hall-financial-section">
            <h3>Hall-wise Financial Performance</h3>
            <div className="hall-financial-grid">
              {[
                { hall: 'Hall 1', revenue: 245000, expenses: 189000, profit: 56000 },
                { hall: 'Hall 2', revenue: 231000, expenses: 175000, profit: 56000 },
                { hall: 'Hall 3', revenue: 268000, expenses: 205000, profit: 63000 },
                { hall: 'Hall 4', revenue: 252000, expenses: 192000, profit: 60000 },
                { hall: 'Hall 5', revenue: 238000, expenses: 181000, profit: 57000 }
              ].map(hall => (
                <div key={hall.hall} className="hall-financial-card">
                  <h4>{hall.hall}</h4>
                  <div className="financial-stats">
                    <div className="financial-stat">
                      <span>Revenue</span>
                      <strong>{formatCurrency(hall.revenue)}</strong>
                    </div>
                    <div className="financial-stat">
                      <span>Expenses</span>
                      <strong>{formatCurrency(hall.expenses)}</strong>
                    </div>
                    <div className="financial-stat profit">
                      <span>Profit</span>
                      <strong>{formatCurrency(hall.profit)}</strong>
                    </div>
                  </div>
                  <div className="profit-margin">
                    Margin: {((hall.profit / hall.revenue) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FinancialReports;