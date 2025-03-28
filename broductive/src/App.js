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
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const [dailyWins, setDailyWins] = useState({
    academic: { checked: false, description: "" },
    physical: { checked: false, description: "" },
    mental: { checked: false, description: "" }
  });
  const [streak, setStreak] = useState(() => Number(localStorage.getItem("streak")) || 0);
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem("darkMode")) || false);

  useEffect(() => {
    localStorage.setItem("streak", streak);
  }, [streak]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.documentElement.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    if (isRunning) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 0) return prev - 1;
          setPomodorosCompleted((prev) => prev + 1);
          return workTime * 60;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning, workTime]);

  const updateStreak = () => {
    setStreak(streak + 1);
  };

  const addTask = () => {
    if (newTask.trim() && taskTime) {
      setTasks((prev) => {
        const updatedTasks = { ...prev };
        updatedTasks[selectedDay] = [...(updatedTasks[selectedDay] || []), { text: newTask, time: taskTime, completed: false }];
        updatedTasks[selectedDay].sort((a, b) => a.time.localeCompare(b.time));
        return updatedTasks;
      });
      setNewTask("");
      setTaskTime("");
    }
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <div className="daily-wins-panel">
        <h3>Daily Wins</h3>
        {Object.keys(dailyWins).map((type) => (
          <div key={type} className="daily-win">
            <label>
              <input
                type="checkbox"
                checked={dailyWins[type].checked}
                onChange={() => updateStreak()}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)} Win
            </label>
            <input
              type="text"
              placeholder={`Describe your ${type} win`}
              value={dailyWins[type].description}
              onChange={(e) => setDailyWins(prev => ({
                ...prev,
                [type]: { ...prev[type], description: e.target.value }
              }))}
            />
          </div>
        ))}
        <p>🔥 Streak: {streak} days</p>
      </div>
      
      <div className="container">
        <h1>Minimal Productivity App</h1>
        <button onClick={() => setDarkMode((prev) => !prev)}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <div className="tabs">
          {daysOfWeek.map((day) => (
            <button key={day} className={selectedDay === day ? "active" : ""} onClick={() => setSelectedDay(day)}>
              {day}
            </button>
          ))}
        </div>
        
        <div className="task-input">
          <input type="text" placeholder="New Task" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
          <input type="time" value={taskTime} onChange={(e) => setTaskTime(e.target.value)} />
          <button onClick={addTask}>Add Task</button>
        </div>

        <div className="pomodoro">
          <h3>Pomodoro Timer</h3>
          <div className="timer">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</div>
          <button onClick={() => setIsRunning(!isRunning)}>{isRunning ? "Pause" : "Start"}</button>
          <button onClick={() => { setIsRunning(false); setTimeLeft(workTime * 60); }}>Reset</button>
        </div>
      </div>
      
      <div className="spotify-panel">
        <h3>Focus Music</h3>
        <iframe
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DX6VdMW310YC7"
          width="100%"
          height="380"
          frameBorder="0"
          allowtransparency="true"
          allow="encrypted-media"
          title="Focus Music"
        ></iframe>
      </div>
    </div>
  );
}

export default App;
