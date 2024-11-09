// components/Home.js
import React, { useState, useEffect } from 'react';
import './Home.css';

function Home() {
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        fetch('/time')
            .then(res => res.json())
            .then(data => {
                setCurrentTime(data.time);
            });
    }, []);

    const calculateTime = (time) => {
        const utcDate = new Date(time);
        return utcDate.toLocaleString();
    }

    const returnTime = () => {
        const today = new Date();
        return today.toLocaleString();
    }
    return (
        <div className="home">
            <header className="header">
                <p>The current time is {currentTime}.</p>
                <p>The js time is {calculateTime(currentTime)}</p>
                <p>{returnTime()}</p>
            </header>
        </div>
    );
}

export default Home;
