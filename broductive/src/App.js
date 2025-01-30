import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [workTime, setWorkTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workTime * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);

  // Add a task for the selected day
  const addTask = () => {
    if (newTask.trim() && taskTime) {
      const updatedTasks = { ...tasks };
      updatedTasks[selectedDay] = [...(updatedTasks[selectedDay] || []), { text: newTask, time: taskTime }];
      updatedTasks[selectedDay].sort((a, b) => a.time.localeCompare(b.time)); // Sort tasks by time
      setTasks(updatedTasks);
      setNewTask("");
      setTaskTime("");
    }
  };

  // Delete a task
  const deleteTask = (index) => {
    const updatedTasks = { ...tasks };
    updatedTasks[selectedDay] = updatedTasks[selectedDay].filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // Pomodoro Timer Logic
  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) return prev - 1;
          setIsWorkTime(!isWorkTime);
          return isWorkTime ? breakTime * 60 : workTime * 60;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning, isWorkTime, workTime, breakTime]);

  const formatTime = (seconds) => {
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  };

  return (
    <div className="container">
      <h1>Minimal Productivity App</h1>

      {/* Day Selector Tabs */}
      <div className="tabs">
        {daysOfWeek.map((day) => (
          <button key={day} className={selectedDay === day ? "active" : ""} onClick={() => setSelectedDay(day)}>
            {day}
          </button>
        ))}
      </div>

      {/* Task Input */}
      <div className="task-input">
        <input type="text" placeholder="New Task" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
        <input type="time" value={taskTime} onChange={(e) => setTaskTime(e.target.value)} />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Task List */}
      <div className="task-list">
        <h3>{selectedDay}'s Tasks</h3>
        {tasks[selectedDay]?.length > 0 ? (
          <ul>
            {tasks[selectedDay].map((task, index) => (
              <li key={index}>
                {task.time} - {task.text}
                <button onClick={() => deleteTask(index)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks for {selectedDay}.</p>
        )}
      </div>

      {/* Pomodoro Timer */}
      <div className="pomodoro">
        <h3>Pomodoro Timer</h3>
        <div className="timer">{formatTime(timeLeft)}</div>
        <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Pause" : "Start"}</button>
        <button onClick={() => { setIsRunning(false); setTimeLeft(workTime * 60); setIsWorkTime(true); }}>Reset</button>

        {/* Timer Settings */}
        <div className="timer-settings">
          <label>
            Work:
            <input type="number" value={workTime} onChange={(e) => setWorkTime(Number(e.target.value))} />
          </label>
          <label>
            Break:
            <input type="number" value={breakTime} onChange={(e) => setBreakTime(Number(e.target.value))} />
          </label>
        </div>
      </div>
    </div>
  );
}

export default App;
