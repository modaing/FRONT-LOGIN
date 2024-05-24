import React, { useState, useEffect } from 'react';
import '../css/weather.css';

function Weather() {
    const [position, setPosition] = useState({});
    const [cityName, setCityName] = useState('');
    const [weather, setWeather] = useState({});
    const [wind, setWind] = useState({});
    const [temperature, setTemperature] = useState('');
    const [icon, setIcon] = useState('');
    const [imgUrl, setImgUrl] = useState('');

    const API_KEY = process.env.REACT_APP_API_KEY;

    async function getEmoji(weather) {

        let emojiName = '';
        switch (weather) {
            case 'Clear': emojiName = 'sunny'; break;
            case 'Rain': emojiName = 'umbrella'; break;
            case 'Thunderstom': emojiName = 'cloud_with_lightning_and_rain'; break;
            case 'Drizzle': emojiName = 'cloud_with_rain'; break;
            case 'Snow': emojiName = 'snowman'; break;
            case 'Clouds': emojiName = 'cloud'; break;
            case 'Atmosphere': emojiName = 'airplane'; break;
        }

        const emojiResponse = await fetch('https://api.github.com/emojis');
        const emojiList = await emojiResponse.json();

        setImgUrl(emojiList[emojiName]);
    }

    function getPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((currentPosition) => {
                setPosition({
                    longitude: currentPosition.coords.longitude,
                    latitude: currentPosition.coords.latitude
                });

                resolve(currentPosition.coords);
            });
        })
    }

    function getWeather(coords) {
        return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}&units=metric`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                return response.json(); // 응답 데이터를 JSON 형식으로 변환
            })
            .then(data => {
                if (data.weather && data.weather.length > 0) {
                    return data;
                } else {
                    throw new Error('Weather data is not available');
                }
            });
    }

    useEffect(() => {

        async function setWeatherState() {
            const currentPosition = await getPosition();
            const weatherResponse = await getWeather(currentPosition);
            setCityName(weatherResponse.name);
            setWeather(weatherResponse.weather[0]);
            setWind(weatherResponse.wind);
            setTemperature(weatherResponse.main.temp);
            const weatherEmoji = await getEmoji(weatherResponse.weather[0].main);
        }

        setWeatherState();
    },
        []);

    return (
        <div className="weather-container">
            <div className='weather'>
                <p className="weather-description-main" style={{ fontSize: '20px' }}>{cityName}</p>
                <p className="weather-description">{`온도: ${temperature} °C`}</p>
                <p className="weather-description">{`날씨: ${weather.main}`}</p>
            </div>
            <div className="image-container">
                <img src={imgUrl} alt="Weather Icon" />
            </div>
        </div>

    );
}

export default Weather;
