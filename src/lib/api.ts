import axios from 'axios';
import { formatToDateTime } from './utils/utils.js';

interface WeatherResponse {
	temperature: number;
	time: string;
}

interface WeatherError {
	status: number;
	message: string;
}

/**
 * Fetches the current weather for a given latitude and longitude.
 *
 * @param latitude - The latitude of the location.
 * @param longitude - The longitude of the location.
 * @returns A promise resolving to the current temperature.
 */
export async function fetchWeather(latitude: number, longitude: number): Promise<WeatherResponse> {
	try {
		const response = await axios.get(
			`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
		);

		const { current_weather } = response.data;

		if (!current_weather) {
			throw new Error('No weather data available.');
		}

		return {
			temperature: response.data.current_weather.temperature,
			time: formatToDateTime(response.data.current_weather.time)
		};
	} catch (error: any) {
		if (error.response) {
			// HTTP Errors
			const status = error.response.status;
			const message =
				status >= 400 && status < 500
					? 'Invalid coordinates or request.'
					: 'Server error. Please try again later.';
			throw { status, message } as WeatherError;
		} else if (error.request) {
			throw { status: 0, message: 'Unable to connect to the server.' } as WeatherError;
		} else {
			throw { status: -1, message: 'An unexpected error occurred.' } as WeatherError;
		}
	}
}
