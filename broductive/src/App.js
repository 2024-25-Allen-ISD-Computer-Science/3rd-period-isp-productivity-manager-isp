import React, { useState, useEffect } from 'react';
import './App.css';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const App = () => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [tasks, setTasks] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [viewMode, setViewMode] = useState('calendar');
  const [taskInput, setTaskInput] = useState({
    description: '',
    duration: '00:30',
    startTime: getDefaultTime(),
    date: getToday()
  });

  useEffect(() => {
    const stored = localStorage.getItem('calendarTasks');
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    const newTask = { ...taskInput, completed: false, alerted: false, id: Date.now() };
    setTasks(prev => ({
      ...prev,
      [taskInput.date]: [...(prev[taskInput.date] || []), newTask]
    }));
    setShowPopup(false);
    setTaskInput({ description: '', duration: '00:30', startTime: getDefaultTime(), date: selectedDate });
  };

  const toggleTaskComplete = (id) => {
    const updated = tasks[selectedDate].map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(prev => ({ ...prev, [selectedDate]: updated }));
  };

  const getProgress = (date = selectedDate) => {
    const list = tasks[date] || [];
    if (list.length === 0) return 0;
    const completed = list.filter(t => t.completed).length;
    return Math.round((completed / list.length) * 100);
  };

  const getStreak = (date = selectedDate) => {
    const list = tasks[date] || [];
    return list.filter(t => t.completed).length;
  };

  const sortByTime = (arr) => {
    return [...arr].sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const sortedTasks = () => {
    const all = tasks[selectedDate] || [];
    const pending = sortByTime(all.filter(t => !t.completed));
    const done = sortByTime(all.filter(t => t.completed));
    return [...pending, ...done];
  };

  function getToday() {
    return new Date().toISOString().split('T')[0];
  }

  function getDefaultTime() {
    const now = new Date();
    const hour = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    return `${hour}:${min}`;
  }

  function formatTime(time24) {
    const [hourStr, minute] = time24.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  }

  function formatDuration(duration) {
    const [hrs, mins] = duration.split(':');
    const parts = [];
    if (hrs !== '00') parts.push(`${parseInt(hrs, 10)} hr${hrs === '01' ? '' : 's'}`);
    if (mins !== '00') parts.push(`${parseInt(mins, 10)} min${mins === '01' ? '' : 's'}`);
    return parts.join(' ');
  }

  function calculateEndTime(start, duration) {
    const [sh, sm] = start.split(':').map(Number);
    const [dh, dm] = duration.split(':').map(Number);
    const endMinutes = sm + dm;
    const endHours = sh + dh + Math.floor(endMinutes / 60);
    const minutes = endMinutes % 60;
    const hours = endHours % 24;
    return formatTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`);
  }

  const navigateDate = (offset) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + offset);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  return (
    <div className="app">
      <div className="view-toggle">
        <button className={viewMode === 'calendar' ? 'active' : ''} onClick={() => setViewMode('calendar')}>📅 Calendar View</button>
        <button className={viewMode === 'weekly' ? 'active' : ''} onClick={() => setViewMode('weekly')}>📆 Weekly View</button>
      </div>

      {viewMode === 'calendar' ? (
        <div className="calendar-nav">
          <button onClick={() => navigateDate(-1)}>← Prev</button>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <button onClick={() => navigateDate(1)}>Next →</button>
        </div>
      ) : (
        <div className="tabs">
          {daysOfWeek.map((day, idx) => {
            const today = new Date();
            const date = new Date();
            const currentDay = today.getDay();
            const delta = idx - (currentDay === 0 ? 6 : currentDay - 1);
            date.setDate(today.getDate() + delta);
            const dayDate = date.toISOString().split('T')[0];
            return (
              <div
                key={day}
                className={`tab ${selectedDate === dayDate ? 'active' : ''}`}
                onClick={() => setSelectedDate(dayDate)}
              >
                <div>{day}</div>
                <small className="streak">🔥 {getStreak(dayDate)} done</small>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${getProgress(dayDate)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="task-section">
        <div className="task-section-header">
          <h2>Tasks for {selectedDate}</h2>
          <button className="add-task-btn" onClick={() => setShowPopup(true)}>+ Add Task</button>
        </div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${getProgress()}%` }}></div>
        </div>
        <ul>
          {sortedTasks().map((task) => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div>
                <strong>{task.description}</strong><br />
                <span className="highlight">🕓 Duration:</span> <strong>{formatDuration(task.duration)}</strong><br />
                <span className="highlight">⏰ Start:</span> <strong>{formatTime(task.startTime)}</strong><br />
                <span className="highlight">🚀 End:</span> <strong>{calculateEndTime(task.startTime, task.duration)}</strong>
              </div>
              <input
                type="checkbox"
                className="checkbox-large"
                checked={task.completed}
                onChange={() => toggleTaskComplete(task.id)}
              />
            </li>
          ))}
        </ul>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Add New Task</h3>
            <input
              type="text"
              placeholder="Task Description"
              value={taskInput.description}
              onChange={(e) => setTaskInput({ ...taskInput, description: e.target.value })}
            />
            <input
              type="time"
              value={taskInput.startTime}
              onChange={(e) => setTaskInput({ ...taskInput, startTime: e.target.value })}
            />
            <select
              value={taskInput.duration}
              onChange={(e) => setTaskInput({ ...taskInput, duration: e.target.value })}
            >
              <option value="00:15">15 minutes</option>
              <option value="00:30">30 minutes</option>
              <option value="00:45">45 minutes</option>
              <option value="01:00">1 hour</option>
              <option value="01:30">1.5 hours</option>
              <option value="02:00">2 hours</option>
            </select>
            <input
              type="date"
              value={taskInput.date}
              onChange={(e) => setTaskInput({ ...taskInput, date: e.target.value })}
            />
            <div className="popup-buttons">
              <button onClick={handleAddTask}>Add</button>
              <button onClick={() => setShowPopup(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
