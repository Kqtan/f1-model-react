import React, { useEffect, useState } from 'react';

function App2() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('/data/main')
            .then(res => res.json())
            .then(data => {
                console.log("Received data:", data);
                setData(data);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            <h1>
                {console.log(data)}
                {data ? data.message : "Loading..."}
            </h1>
        </div>
    );
}

export default App2;
