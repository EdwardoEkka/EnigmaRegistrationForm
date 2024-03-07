import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Display from "../components/Display";
import "./welcome.css";
import logo from "../components/images/EnigmaLogo.png";
import Matrix from "./Matrix";
import Marquee from "react-fast-marquee";

const Welcome = () => {
  const navigate = useNavigate();
  const endTime = new Date("March 11, 2024 00:00:00").getTime();
  const [currentTime, setcurrentTime] = useState(new Date().getTime());

  const gap = endTime - currentTime;

  const seconds = 1000;
  const minutes = seconds * 60;
  const hours = minutes * 60;
  const days = hours * 24;

  const remainingDays = Math.floor(gap / days);
  const remainingHours = Math.floor((gap % days) / hours);
  const remainingMinutes = Math.floor((gap % hours) / minutes);
  const remainingSeconds = Math.floor((gap % minutes) / seconds);

  useEffect(() => {
    setTimeout(() => setcurrentTime(new Date().getTime()), 1000);
  }, [currentTime]);

  return (
    <div>
      <div className="matrix-container">
        <Matrix />
      </div>

      {/* <div
        style={{
          display: "flex",
          alignItems: "center",
          borderRadius: 0.5,
        }}
      >
        <img src={logo} alt="Logo" style={{ height: "80px", width: "80px" }} />
      </div> */}

      <div
        className="logo-container"
        style={{
          position: "fixed",
          top: "0px", 
          left: "0px", 
          zIndex: "999", 
        }}
      >
        <a href="https://enigmavssut.com/" rel="noreferrer" target="_blank" ><img src={logo} alt="Logo" style={{ height: "80px", width: "80px" }} /></a>
      </div>

      

      <center>
        <Display
          days={remainingDays}
          hours={remainingHours}
          minutes={remainingMinutes}
          seconds={remainingSeconds}
        />
      </center>

      <div>
        <Marquee direction="left">
          <h3 data-text="REGISTRATION BEGINS 7th MAR ">
            <span>REGISTRATION BEGINS 7th MAR</span>
          </h3>
        </Marquee>
        <Marquee direction="right">
          <h3 data-text="REGISTRATION ENDS 10th MAR">
            <span>REGISTRATION ENDS 10th MAR</span>
          </h3>
        </Marquee>
      </div>
      <div class="info">
        INFO SESSION : 11th MAR
      </div>

      <div
        className="foo"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
        className="button-71"
          style={{ marginBottom: "3px" }}
          onClick={() => {
            navigate("/form");
          }}
        >
          Proceed To Registration
        </button>
      </div>
    </div>
  );
};

export default Welcome;
