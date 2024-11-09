// components/Calendar.js
import React, { useState, useEffect } from 'react';
import './Calendar.css';

function Calendar() {
    const [calendar, setCalendar] = useState([]);
    const [closestRace, setClosestRace] = useState(null); // To track the closest upcoming race

    useEffect(() => {
        fetch('https://ergast.com/api/f1/current.json')
            .then((response) => response.json())
            .then((data) => {
                const races = data.MRData.RaceTable.Races;
                setCalendar(races);
                setClosestRace(findClosestRace(races));
            })
            .catch((error) => console.error("Error fetching calendar:", error));
    }, []);

    // Function to find the closest race that is more than 3 days away
    const findClosestRace = (races) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to the start of the day
    
        const upcomingRaces = races.filter(race => new Date(race.date) > today);
        
        // Find the closest upcoming race that is more than 3 days away
        return upcomingRaces.find(race => {
            const raceDate = new Date(race.date);
            raceDate.setHours(0, 0, 0, 0); // Set to the start of the day
            const diffDays = (raceDate - today) / (1000 * 60 * 60 * 24);
            return diffDays > 3;
        });
    };
    
    // Helper function to check if a race is live (within 3 days)
    const isLiveRace = (raceDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to the start of the day
        const raceDay = new Date(raceDate);
        raceDay.setHours(0, 0, 0, 0); // Set to the start of the day
        const diffDays = (raceDay - today) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 3;
    };
    

    return (
        <div className="home">
            <header className="header">
                <img src="https://www.formula1.com/etc/designs/fom-website/images/f1_logo.svg" alt="F1 Logo" className="f1-logo" />
                <h1>2024 F1 Season Calendar</h1>
            </header>
            <div className="calendar">
                {calendar.map((race) => {
                    const isSprint = race.Sprint ? true : false;
                    const raceDate = new Date(race.date);
                    const isLive = isLiveRace(race.date);
                    const isClosest = closestRace && closestRace.round === race.round;

                    return (
                        <div key={race.round} className={`${isSprint ? 'sprint-card' : 'race-card'} ${isLive ? 'live' : ''}`}>
                            <h2>{race.raceName}</h2>
                            {isLive && <span className="live-badge">LIVE</span>}
                            {isClosest && !isLive && <span className="closest-flag">UP NEXT</span>}
                            <p>{race.Circuit.circuitName}</p>
                            <p>{raceDate.toLocaleDateString()}</p>
                            {race.Circuit.Location ? (
                                <p>{race.Circuit.Location.locality}, {race.Circuit.Location.country}</p>
                            ) : (
                                <p>Location data not available</p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Calendar;
