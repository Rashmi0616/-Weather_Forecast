const apiKey = 'e6c4fb35de9c71ae69853bb928814eb6';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast';
let units = 'metric'; // Default to Celsius


function getWeather() {
    const cityInput = document.getElementById('cityInput').value;
    if (cityInput.trim() === '') {
        alert('Please enter a city name.');
        return;
    }

    // Current Weather API call
    fetch(`${apiUrl}?q=${cityInput}&appid=${apiKey}&units=${units}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayCurrentWeather(data);
        })
        .catch(error => {
            alert(error.message);
        });

    // 5-day Forecast API call
    fetch(`${forecastUrl}?q=${cityInput}&appid=${apiKey}&units=${units}`)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
        });
}

function displayCurrentWeather(data) {
    const weatherDetails = document.getElementById('weather-details');
    weatherDetails.classList.add('weather_item');
    weatherDetails.innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p>Temperature: ${data.main.temp} °${getTemperatureUnit()}</p>
        <p>Min/Max Temperature: ${data.main.temp_min} °${getTemperatureUnit()} / ${data.main.temp_max} °${getTemperatureUnit()}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s, ${data.wind.deg}°</p>
        <p>Description: ${data.weather[0].description}</p>
        <img class="icon" src="http://openweathermap.org/img/w/${data.weather[0].icon}.png" alt="Weather Icon">
    `;
}

function displayForecast(data) {
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = '';

    for (let i = 0; i < data.list.length; i += 8) {
        const forecastData = data.list[i];
        const date = new Date(forecastData.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('day');
        forecastItem.innerHTML = `
            <h4> ${day}</h4>
            <p>Avg. Temp: ${forecastData.main.temp} ${getTemperatureUnit()}</p>
            <p>Description: ${forecastData.weather[0].description}</p>
            <img class="icon" src="http://openweathermap.org/img/w/${forecastData.weather[0].icon}.png" alt="Weather Icon">
        `;

        forecastDiv.appendChild(forecastItem);
    }
}
function toggleUnits() {
    const unitSwitch = document.getElementById('unitSwitch');
    const unitLabel = document.getElementById('unitLabel');
    units = unitSwitch.checked ? 'imperial' : 'metric';
    unitLabel.textContent = unitSwitch.checked ? 'Fahrenheit' : 'Celsius';

    getWeather();
}

function getTemperatureUnit() {
    return units === 'metric' ? 'C' : 'F';
}