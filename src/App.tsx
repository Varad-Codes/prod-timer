import { useEffect, useState } from "react";
// import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [currentTime, setCurrentTime] = useState('25:00');
  const [isRunning, setIsRunning] = useState(false);
  const [cycle, setCycle] = useState('work');
  const [userWorkTime, setUserWorkTime] = useState(25);
  const [userBreakTime, setUserBreakTime] = useState(5);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId: number;

    if (isRunning) {
      intervalId = setInterval(() => {
        handleTick();
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, currentTime, cycle, userWorkTime, userBreakTime]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setCurrentTime(`${userWorkTime}:00`); // Use user-defined work time for reset
    setCycle('work');
    setIsRunning(false);
  };

  const handleTick = () => {
    let minutes = parseInt(currentTime.slice(0, 2));
    let seconds = parseInt(currentTime.slice(3));
    
    const totalDuration = cycle === 'work' ? userWorkTime : userBreakTime;
    const remainingTime = parseInt(currentTime.slice(0, 2)) * 60 + parseInt(currentTime.slice(3));
    const progress = remainingTime === 0 ? 100 : (totalDuration - remainingTime) / totalDuration * 100;
    // const finalProgress = Math.min(Math.max(progress, 2), 100); // Ensure valid progress value
    setProgress(progress);

    if (seconds === 0) {
      if (minutes === 0) {
        switchCycle();
      } else {
        minutes--;
        seconds = 59;
      }
    } else {
      seconds--;
    }

    setCurrentTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };

  const switchCycle = () => {
    setCycle(cycle === 'work' ? 'break' : 'work');
    console.log("setting current pomodoro cycle to " + cycle);
    setCurrentTime(cycle === 'work' ? `${userWorkTime}:00` : `${userBreakTime}:00`);
  };

  const handleWorkTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (Number.isInteger(value) && value > 0) {
      setUserWorkTime(value);
      if (cycle === 'work') {
        setCurrentTime(`${value}:00`); // Update current time based on new work time
      }
    }
  };

  const handleBreakTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (Number.isInteger(value) && value > 0) {
      setUserBreakTime(value);
      if (cycle === 'break') {
        setCurrentTime(`${value}:00`); // Update current time based on new break time
      }
    }
  };

  return (
    <div className="container">
      <h1>{cycle}</h1>
      <div>{currentTime}</div>
      <progress value={progress} max="100"></progress>
      
      <br />
      <input type="number" value={userWorkTime} onChange={handleWorkTimeChange} placeholder="Work Time (minutes)" />
      <input type="number" value={userBreakTime} onChange={handleBreakTimeChange} placeholder="Break Time (minutes)" />
      
      <div className="control-btn">
      <button onClick={isRunning ? handlePause : handleStart}>{isRunning ? 'Pause' : 'Start'}</button>
      <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}

export default App;
