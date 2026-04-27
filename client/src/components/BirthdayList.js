import React from 'react';

function BirthdayList({ birthdays, onDelete }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getMonthDay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="birthday-list">
      {birthdays.map((birthday) => (
        <div key={birthday._id} className="birthday-item">
          <div className="birthday-info">
            <div className="birthday-name">{birthday.username}</div>
            <div className="birthday-email">{birthday.email}</div>
            <div className="birthday-date">
              📅 {formatDate(birthday.dateOfBirth)} ({getMonthDay(birthday.dateOfBirth)})
            </div>
          </div>
          <button
            className="delete-btn"
            onClick={() => onDelete(birthday._id)}
            title="Delete this entry"
          >
            🗑️ Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default BirthdayList;