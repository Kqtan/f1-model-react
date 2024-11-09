// components/Driver.js
import React, { useState, useEffect } from 'react';
import './Driver.css';

function Driver() {
    const [drivers, setDrivers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('https://ergast.com/api/f1/2024/drivers.json')
            .then((response) => response.json())
            .then((data) => setDrivers(data.MRData.DriverTable.Drivers))
            .catch((error) => console.error("Error fetching drivers:", error));
    }, []);

    const calculateAge = (birthday) => {
        const today = new Date();
        const birthDate = new Date(birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const filteredDrivers = drivers.filter(driver => 
        driver.givenName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        driver.familyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="driver-container">
            <header className="header">
                <h1>F1 Drivers 2024</h1>
                <input 
                    type="text" 
                    placeholder="Search Drivers" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
            </header>
            <div className="drivers">
                {filteredDrivers.map(driver => (
                    <div key={driver.driverId} className="driver-card">
                        <div className="driver-name">
                            <div>{driver.givenName}</div>
                            <div className='driver-last-name'>{driver.familyName.toUpperCase()}</div>
                        </div>
                        <div className="driver-details">
                            <div>{driver.nationality}</div>
                            {/* <div>{new Date(driver.dateOfBirth).toLocaleDateString()}</div> */}
                            <div>Age: {calculateAge(driver.dateOfBirth)}</div> {/* Display age */}
                        </div>
                        <div className="permanent-number">{driver.permanentNumber}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Driver;
