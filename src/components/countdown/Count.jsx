import React, { useEffect, useState } from "react";
import "./c.css";
import log from "../../assets/logo.jpg";

const Count = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Target date (Venerdì 19 Dicembre at 00:00 in user's timezone)
    const targetDate = new Date("2025-12-19T00:00:00");

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="count">
      <div className="cos">
        <img src="https://i.imgur.com/VIxCbIE.png" className="copers rum" alt="" />
      </div>

      <div className="co">
        <img src="https://i.imgur.com/VIxCbIE.png" className="coper rum" alt="" />
      </div>
      <h2 className="count_title">The Countdown</h2>

      <div className="count_grid">
        <div className="count_sub">
          <h2 className="count_date">{timeLeft.days}</h2>
          <h2 className="count_date_value">Giorni</h2>
        </div>

        <div className="count_sub">
          <h2 className="count_date">{timeLeft.hours}</h2>
          <h2 className="count_date_value">Ore</h2>
        </div>

        <div className="count_sub per">
          <img src={log} alt="Logo" className="count_img" />
        </div>

        <div className="count_sub">
          <h2 className="count_date">{timeLeft.minutes}</h2>
          <h2 className="count_date_value">Minuti</h2>
        </div>

        <div className="count_sub">
          <h2 className="count_date">{timeLeft.seconds}</h2>
          <h2 className="count_date_value">Secondi</h2>
        </div>
      </div>
    </div>
  );
};

export default Count;
