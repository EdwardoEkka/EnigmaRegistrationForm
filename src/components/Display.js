import React from "react";
import "./Display.css";

const Display = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="countdown-container">
<div className="typewriter">Lift off C++</div>
<h1 class="animated-shadow" data-shadow='Countdown Begins'>Countdown Begins</h1>

      <div className="countdown-timer">
        <div className="countdown-item">
          <div className="countdown-value">{days}</div>
          <div className="countdown-label">Day</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{hours}</div>
          <div className="countdown-label">Hour</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{minutes}</div>
          <div className="countdown-label">Minutes</div>
        </div>
        <div className="countdown-item">
          <div className="countdown-value">{seconds}</div>
          <div className="countdown-label">Seconds</div>
        </div>
      </div>
     
    </div>
  );
};

export default Display;
