import axios from 'axios';
import geoip from 'geoip-lite';
import { IncomingMessage } from 'http';
import { WeatherApiRawResponse, WeatherApiResponse, WeatherData } from './types';

export async function fetchWeather(req: IncomingMessage): Promise<WeatherApiResponse> {
    const ip =
        req.headers['x-forwarded-for']?.toString().split(',')[0] ||
        req.socket.remoteAddress ||
        '';

    // Default to Istanbul NewMindAi coordinates if geo lookup fails
    const geo = geoip.lookup(ip) || { ll: [41.06000643659152, 28.97809208650589] };

    if (!geo || !geo.ll) {
        return {
            success: false,
            error: 'Could not determine location from IP'
        };
    }

    const [lat, lon] = geo.ll;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
        return {
            success: false,
            error: 'Missing weather API key'
        };
    }

    try {
        const response = await axios.get<WeatherApiRawResponse>(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const weatherData: WeatherData = {
            city: response.data.name,
            temperature: response.data.main.temp,
            condition: response.data.weather[0].main
        };

        return {
            success: true,
            data: weatherData
        };
    } catch (error) {
        const errMessage = error instanceof Error ? error.message : 'Unknown error';
        return {
            success: false,
            error: `Weather fetch failed: ${errMessage}`
        };
    }
}
