import React, { useState } from 'react';
import './App.css';

function generateDays(startDate, count) {
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    return {
      name: date.toLocaleDateString(undefined, { weekday: 'long' }),
      date: date.toLocaleDateString(undefined, { month: 'long', day: 'numeric' }),
      key: date.toISOString().split('T')[0],
    };
  });
}

export default function App() {
  const startDate = new Date('2025-04-03');
  const [days] = useState(generateDays(startDate, 1000));
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ description: '', startTime: '', duration: '', key: '' });
  const [tasks, setTasks] = useState({}); // key = date string, value = array of tasks

  const handleAddTaskClick = (key) => {
    setShowModal(true);
    setNewTask({ description: '', startTime: '', duration: '', key });
  };

  const handleClose = () => {
    setShowModal(false);
    setNewTask({ description: '', startTime: '', duration: '', key: '' });
  };

  const handleSubmit = () => {
    if (!newTask.description || !newTask.key) return;

    const newEntry = {
      description: newTask.description,
      startTime: newTask.startTime,
      duration: newTask.duration,
    };

    setTasks((prev) => ({
      ...prev,
      [newTask.key]: [...(prev[newTask.key] || []), newEntry],
    }));

    handleClose();
  };

  const handleDelete = (dayKey, index) => {
    setTasks((prev) => {
      const updated = [...(prev[dayKey] || [])];
      updated.splice(index, 1);
      return { ...prev, [dayKey]: updated };
    });
  };

  return (
    <div className="app-container">
      <div className="days-scroll">
        {days.map(({ name, date, key }) => (
          <div key={key} className="day-card">
            <h2 className="day-name">{name}</h2>
            <p className="day-date">{date}</p>

            {(tasks[key] || []).map((task, idx) => (
              <div key={idx} className="task-box">
                <div className="task-header">
                  <strong>{task.description}</strong>
                  <button className="delete-btn" onClick={() => handleDelete(key, idx)}>✕</button>
                </div>
                <p className="task-meta">
                  ⏰ {task.startTime || 'N/A'} &nbsp;&nbsp; 🕓 {task.duration || 'N/A'}
                </p>
              </div>
            ))}

            <button className="add-btn" onClick={() => handleAddTaskClick(key)}>+</button>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Add Task for {newTask.key}</h3>
            <input
              type="text"
              placeholder="Task description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Start time (e.g., 10:00 AM)"
              value={newTask.startTime}
              onChange={(e) => setNewTask({ ...newTask, startTime: e.target.value })}
            />
            <input
              type="text"
              placeholder="Duration (e.g., 1h, 30m)"
              value={newTask.duration}
              onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
            />
            <div className="modal-buttons">
              <button className="cancel-btn" onClick={handleClose}>Cancel</button>
              <button className="submit-btn" onClick={handleSubmit}>Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}