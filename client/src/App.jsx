import React, { useState, useEffect } from 'react';

function App() {
    const [apiData, setApiData] = useState(""); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api');
                const data = await response.json();
                console.log(data);
                setApiData(data.message);  
            } catch (error) {
                console.error(error);
                setApiData("Failed to fetch data");  
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container">
            <p className="alert alert-success">Message: {apiData}</p>
        </div>
    );
}

export default App;
