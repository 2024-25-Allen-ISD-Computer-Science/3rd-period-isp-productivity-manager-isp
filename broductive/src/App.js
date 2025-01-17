import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [notes, setNotes] = useState(''); // State to hold the notes content

  return (
    <div className="container">
      {/* To-Do List Quadrant */}
      <div className="quadrant">
        <h2>To-Do List</h2>
        <p>Manage your tasks efficiently.</p>
      </div>

      {/* Notes Quadrant */}
      <div className="quadrant">
        <h2>Notes</h2>
        <textarea
          placeholder="Type your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="notes-textarea"
        />
      </div>

      {/* Timer Quadrant */}
      <div className="quadrant">
        <h2>Timer</h2>
        <p>Stay focused with a timer.</p>
      </div>

      {/* Calendar Quadrant */}
      <div className="quadrant">
        <h2>Calendar</h2>
        <p>Plan your schedule effectively.</p>
      </div>
    </div>
  );
};

export default App;
