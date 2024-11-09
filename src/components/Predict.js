import React, { useEffect, useState } from 'react';
import './Predict.css';

function Predict() {
    const [data, setData] = useState(null);
    const [constructors, setConstructors] = useState([]);
    const [drivers, setDrivers] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedDrivers, setSelectedDrivers] = useState({});
    const [latestRaceName, setLatestRaceName] = useState('');
    const [latestRaceDate, setLatestRaceDate] = useState('');
    const [nextRaceCircuit, setNextRaceCircuit] = useState('');
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        fetch('/predict/1')
            .then(res => res.json())
            .then(data => setData(data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const fetchConstructors = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://ergast.com/api/f1/2024/constructors.json');
                const data = await response.json();
                setConstructors(data.MRData.ConstructorTable.Constructors);
                
                for (const constructor of data.MRData.ConstructorTable.Constructors) {
                    const driversResponse = await fetch(`https://ergast.com/api/f1/2024/constructors/${constructor.constructorId}/drivers.json`);
                    const driversData = await driversResponse.json();
                    setDrivers(prev => ({
                        ...prev,
                        [constructor.constructorId]: driversData.MRData.DriverTable.Drivers,
                    }));
                }
            } catch (error) {
                console.error("Error fetching constructors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConstructors();
    }, []);

    useEffect(() => {
        const fetchAllRaces = async () => {
            try {
                const response = await fetch('https://ergast.com/api/f1/2024.json');
                const data = await response.json();
                const races = data.MRData.RaceTable.Races;
                const today = new Date().toISOString().split('T')[0];
                const latestRace = races
                    .filter(race => race.date >= today)
                    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];
    
                if (latestRace) {
                    setLatestRaceName(latestRace.raceName);
                    setLatestRaceDate(latestRace.date);
                    setNextRaceCircuit(latestRace.Circuit.circuitName); // Store the circuit name
                } else {
                    setLatestRaceName('No upcoming races found');
                    setLatestRaceDate('');
                    setNextRaceCircuit('');
                }
            } catch (error) {
                console.error("Error fetching races:", error);
            }
        };
    
        fetchAllRaces();
    }, []);

    const driverConstructorPairs = [];

    constructors.forEach(constructor => {
        const constructorDrivers = drivers[constructor.constructorId] || [];
        constructorDrivers.forEach(driver => {
            driverConstructorPairs.push({
                driverId: driver.driverId,
                constructorId: constructor.constructorId,
                driverName: `${driver.givenName} ${driver.familyName}`,
                constructorName: constructor.name,
            });
        });
    });

    const handleSelectDriver = (driverId, constructorId) => {
        const key = `${driverId}-${constructorId}`;
        setSelectedDrivers(prev => ({
            ...prev,
            [key]: !prev[key], // Toggle selection
        }));
    };

    // Calculate the number of selected drivers
    const selectedCount = Object.values(selectedDrivers).filter(selected => selected).length;
    
    // Modify the handlePostData function
    const handlePostData = async () => {
        const driverNames = [];
        const constructorNames = [];
    
        // Collect driver and constructor pairs
        Object.keys(selectedDrivers)
            .filter(key => selectedDrivers[key]) // Filter for selected drivers
            .forEach(key => {
                const [driverId, constructorId] = key.split('-');
                const driverPair = driverConstructorPairs.find(pair => pair.driverId === driverId && pair.constructorId === constructorId);
                if (driverPair) {
                    driverNames.push(driverPair.driverName); // Add driver name to array
                    constructorNames.push(driverPair.constructorName); // Add constructor name to array
                }
            });
    
        const jsonData = {
            data: {
                driver: driverNames, // Array of driver names
                constructor: constructorNames, // Array of constructor names
            },
            GP_name: nextRaceCircuit, // Include circuit name
        };
    
        console.log(jsonData);
        try {
            const response = await fetch('predict/2', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log("API Result:", result); // Log the API result
    
                // Check if result.data is a string and parse it
                const parsedData = typeof result.data === 'string' ? JSON.parse(result.data) : [];
    
                // Set results to the parsed data
                setResults(parsedData);
                setShowResults(true);
            } else {
                console.error('Error posting data');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const renderResults = () => {
        return results.map(({ driver, constructor, prediction }) => {
            let predictionLabel;
            let badgeClass;
    
            switch (prediction) {
                case 1:
                    predictionLabel = "Podium Finish";
                    badgeClass = "badge badge-podium";
                    break;
                case 2:
                    predictionLabel = "Points Finish";
                    badgeClass = "badge badge-points";
                    break;
                case 3:
                    predictionLabel = "No Points/DNF";
                    badgeClass = "badge badge-dnf";
                    break;
                default:
                    predictionLabel = "Unknown Outcome";
                    badgeClass = "badge"; // Default class without specific color
            }
    
            return (
                <div key={`${driver}-${constructor}`} className="prediction-card">
                    <div className="prediction-driver-name">
                        <div>{driver}</div>
                        <div className="prediction-constructor-name">({constructor})</div>
                    </div>
                    <div className="prediction-details">
                        <span className={badgeClass}> {predictionLabel}</span>
                    </div>
                </div>
            );
        });
    };
    

    return (
        <div className="predict-container">
    
            {loading ? (
                <p>Waiting McLaren to admit they have the fastest car...</p>
            ) : showResults ? ( // Conditional rendering
                <div className="result-container">
                    <h1>Prediction</h1>
                    {renderResults()}
                    <div className="result-button-container">
                        <button className="result-button" onClick={() => setShowResults(false)}>Back to Selection</button>
                    </div>
                </div>
            ) : (
                <div>
                    <h1>{data ? data.message : "Loading..."}</h1>
                    <p className="predict-race-info">Next Race: {latestRaceName} on {latestRaceDate}</p>
                    <p>Selected Drivers: {selectedCount}</p>
                    <div className="button-container">
                        <button className="button" onClick={handlePostData} disabled={selectedCount === 0}>Submit Selected Drivers</button>
                    </div>
                    {driverConstructorPairs.length === 0 ? (
                        <p>No drivers found.</p>
                    ) : (
                        <div className="predict-drivers">
                            {driverConstructorPairs.map(pair => {
                                const isSelected = selectedDrivers[`${pair.driverId}-${pair.constructorId}`];
                                return (
                                    <div
                                        key={`${pair.driverId}-${pair.constructorId}`}
                                        className={`predict-driver-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleSelectDriver(pair.driverId, pair.constructorId)}
                                    >
                                        <div className="predict-driver-name">{pair.driverName}</div>
                                        <div className="predict-constructor-name">{pair.constructorName}</div>
                                        <div className="predict-driver-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleSelectDriver(pair.driverId, pair.constructorId)}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
    
}

export default Predict;
