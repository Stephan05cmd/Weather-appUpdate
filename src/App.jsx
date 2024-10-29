import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/detail/:cityName" element={<DetailView />} />
      </Routes>
    </Router>
  );
};

const Dashboard = () => {
  const API_KEY = "998559d8900f4d3ba358aa8714782c8f";
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemp, setFilterTemp] = useState('');
  const [filterWeather, setFilterWeather] = useState('');

  const fetchWeatherData = async (city) => {
    try {
      const response = await fetch(`https://api.weatherbit.io/v2.0/current?city=${city}&country=US&key=${API_KEY}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWeatherData((prevData) => [...prevData, data.data[0]]); 
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddCity = (e) => {
    e.preventDefault();
    if (city && !weatherData.some((data) => data.city_name.toLowerCase() === city.toLowerCase())) {
      fetchWeatherData(city);
      setCity('');
    }
  };

  const filteredData = weatherData
    .filter((data) => data.city_name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((data) => (filterTemp ? data.temp >= filterTemp : true))
    .filter((data) => (filterWeather ? data.weather.description.toLowerCase().includes(filterWeather.toLowerCase()) : true));

  const totalCities = weatherData.length;
  const avgTemp = totalCities > 0 ? (weatherData.reduce((sum, data) => sum + data.temp, 0) / totalCities).toFixed(2) : 0;
  const maxTemp = totalCities > 0 ? Math.max(...weatherData.map((data) => data.temp)) : 0;

  return (
    <div className="App">
      <header className="header">
        <h1>Weather Dashboard</h1>
      </header>
      <div className="content">
        <form onSubmit={handleAddCity}>
          <input 
            type="text" 
            placeholder="Enter city name..." 
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit">Add City</button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="filters">
          <input 
            type="text" 
            placeholder="Search by city..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Filter by min temp (°C)..." 
            value={filterTemp}
            onChange={(e) => setFilterTemp(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Filter by weather condition..." 
            value={filterWeather}
            onChange={(e) => setFilterWeather(e.target.value)}
          />
        </div>

        <div className="summary">
          <h3>Summary Statistics</h3>
          <p>Total Cities: {totalCities}</p>
          <p>Average Temperature: {avgTemp} °C</p>
          <p>Maximum Temperature: {maxTemp} °C</p>
        </div>

        <LineChart width={600} height={300} data={weatherData}>
          <XAxis dataKey="city_name" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#f5f5f5" />
          <Line type="monotone" dataKey="temp" stroke="#ff7300" />
        </LineChart>

        <div className="weather-list">
          {filteredData.length > 0 ? (
            filteredData.map((data, index) => (
              <div key={index} className="weather-card">
                <h2>{data.city_name}</h2>
                <p>Temperature: {data.temp} °C</p>
                <p>Weather: {data.weather.description}</p>
                <Link to={`/detail/${data.city_name}`}>View Details</Link>
              </div>
            ))
          ) : (
            <p>No matching data found</p>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailView = () => {
  const { cityName } = useParams();
  
  return (
    <div className="detail-view">
      <h2>Details for {cityName}</h2>
      Welcome to one of the best CITY'S EVERRRR!!!!
    </div>
  );
};

export default App;
