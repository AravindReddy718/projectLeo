import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MessMenu.css';

export default function MessMenu() {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState('current');
  const [messMenu, setMessMenu] = useState({
    current: {
      Monday: {
        breakfast: 'Idli, Sambar, Chutney, Tea/Coffee',
        lunch: 'Rice, Dal, Vegetable Curry, Rasam, Curd',
        dinner: 'Chapati, Dal, Paneer Curry, Rice'
      },
      Tuesday: {
        breakfast: 'Dosa, Sambar, Chutney, Tea/Coffee',
        lunch: 'Rice, Sambar, Vegetable Fry, Rasam, Buttermilk',
        dinner: 'Rice, Dal, Chicken Curry, Vegetable'
      },
      Wednesday: {
        breakfast: 'Upma, Chutney, Tea/Coffee',
        lunch: 'Rice, Dal, Mixed Vegetable, Rasam, Curd',
        dinner: 'Chapati, Dal, Fish Curry, Rice'
      },
      Thursday: {
        breakfast: 'Poha, Tea/Coffee',
        lunch: 'Rice, Sambar, Cabbage Fry, Rasam, Buttermilk',
        dinner: 'Rice, Dal, Mutton Curry, Vegetable'
      },
      Friday: {
        breakfast: 'Paratha, Curry, Tea/Coffee',
        lunch: 'Rice, Dal, Aloo Gobi, Rasam, Curd',
        dinner: 'Chapati, Dal, Egg Curry, Rice'
      },
      Saturday: {
        breakfast: 'Bread, Jam, Tea/Coffee',
        lunch: 'Rice, Sambar, Bhindi Fry, Rasam, Buttermilk',
        dinner: 'Rice, Dal, Chicken Biryani, Raita'
      },
      Sunday: {
        breakfast: 'Puri, Aloo Sabzi, Tea/Coffee',
        lunch: 'Rice, Dal, Special Curry, Rasam, Curd',
        dinner: 'Chapati, Dal, Paneer Butter Masala, Rice'
      }
    }
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const meals = ['breakfast', 'lunch', 'dinner'];

  return (
    <div className="mess-menu-page">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate('/student/dashboard')}>
          ← Back to Dashboard
        </button>
        <h1>Mess Menu</h1>
      </div>

      <div className="mess-menu-container">
        <div className="menu-header">
          <h2>Weekly Mess Menu</h2>
          <div className="week-selector">
            <button 
              className={currentWeek === 'current' ? 'active' : ''}
              onClick={() => setCurrentWeek('current')}
            >
              Current Week
            </button>
          </div>
        </div>

        <div className="menu-grid">
          {days.map(day => (
            <div key={day} className="day-menu">
              <h3 className="day-title">{day}</h3>
              {meals.map(meal => (
                <div key={meal} className="meal-section">
                  <h4 className="meal-title">{meal.charAt(0).toUpperCase() + meal.slice(1)}</h4>
                  <p className="meal-items">{messMenu[currentWeek][day][meal]}</p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="menu-info">
          <div className="info-card">
            <h3>Mess Timings</h3>
            <div className="timings">
              <p><strong>Breakfast:</strong> 7:30 AM - 9:30 AM</p>
              <p><strong>Lunch:</strong> 12:00 PM - 2:00 PM</p>
              <p><strong>Dinner:</strong> 7:00 PM - 9:00 PM</p>
            </div>
          </div>
          
          <div className="info-card">
            <h3>Special Notes</h3>
            <ul>
              <li>Menu is subject to change based on availability</li>
              <li>Special meals on festivals and occasions</li>
              <li>Vegetarian options available for all meals</li>
              <li>Contact mess manager for dietary requirements</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
