import React, { useState, useEffect } from 'react';
import './App.css';
import BirthdayForm from './components/BirthdayForm';
import BirthdayList from './components/BirthdayList';
import api from './api/api';

function App() {
  const [birthdays, setBirthdays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [todaysBirthdays, setTodaysBirthdays] = useState([]);

  useEffect(() => {
    fetchBirthdays();
    fetchTodaysBirthdays();
    const interval = setInterval(() => {
      fetchTodaysBirthdays();
    }, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const fetchBirthdays = async () => {
    setLoading(true);
    try {
      const response = await api.get('/birthdays');
      setBirthdays(response.data.data);
    } catch (error) {
      setMessage('Error fetching birthdays');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodaysBirthdays = async () => {
    try {
      const response = await api.get('/birthdays/today');
      setTodaysBirthdays(response.data.data);
    } catch (error) {
      console.error('Error fetching today\'s birthdays:', error);
    }
  };

  const handleAddBirthday = async (formData) => {
    try {
      await api.post('/birthdays', formData);
      setMessage('Birthday added successfully!');
      fetchBirthdays();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error adding birthday');
      console.error(error);
    }
  };

  const handleDeleteBirthday = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await api.delete(`/birthdays/${id}`);
        setMessage('Birthday deleted successfully');
        fetchBirthdays();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error deleting birthday');
        console.error(error);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎂 Birthday Reminder App 🎂</h1>
        <p>Never miss a birthday celebration!</p>
      </header>

      <main className="app-main">
        {message && <div className="message">{message}</div>}

        {todaysBirthdays.length > 0 && (
          <section className="todays-birthdays">
            <h2>🎉 Today's Birthdays</h2>
            <div className="birthday-alert">
              <p>It's someone's special day! Send them birthday wishes 🎈</p>
              {todaysBirthdays.map((birthday) => (
                <div key={birthday._id} className="today-birthday-item">
                  <span>{birthday.username} ({birthday.email})</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="container">
          <section className="form-section">
            <h2>Add Birthday</h2>
            <BirthdayForm onSubmit={handleAddBirthday} />
          </section>

          <section className="list-section">
            <h2>All Birthdays ({birthdays.length})</h2>
            {loading ? (
              <p>Loading...</p>
            ) : birthdays.length > 0 ? (
              <BirthdayList birthdays={birthdays} onDelete={handleDeleteBirthday} />
            ) : (
              <p>No birthdays added yet. Add one to get started!</p>
            )}
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2026 Birthday Reminder App. Spread joy and celebrate every birthday! 🎁</p>
      </footer>
    </div>
  );
}

export default App;