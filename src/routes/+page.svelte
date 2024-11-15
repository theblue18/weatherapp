<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchWeather } from '$lib/api.js';
	import { weatherData, loading, error } from '$lib/stores/weatherStore.js';
	import cities from '../lib/data/cities.json';

	/**
	 * Interface defining the structure of a city.
	 * 
	 * @typedef {Object} City
	 * @property {string} name - The name of the city.
	 * @property {number} latitude - The latitude of the city.
	 * @property {number} longitude - The longitude of the city.
	 */
	interface City {
		name: string;
		latitude: number;
		longitude: number;
	}

	/**
	 * The currently selected city as a JSON string.
	 * @type {string | null}
	 */
	let selectedCity: string | null = null;

	/**
	 * Fetches and updates weather information for the selected city.
	 *
	 * @async
	 * @function getWeather
	 * @returns {Promise<void>} Updates weather data in the store.
	 */
	const getWeather = async () => {
		if (!selectedCity) return;

		// Parse the selected city from a JSON string to a City object
		const city: City = JSON.parse(selectedCity);

		// Set the loading state and clear previous errors
		loading.set(true);
		error.set(null);

		try {
			// Fetch weather data for the selected city's coordinates
			const { temperature, time } = await fetchWeather(city.latitude, city.longitude);

			// Update the weather store with the fetched data
			weatherData.set({ temperature, city: city.name, time });
		} catch (err: any) {
			// Handle errors and set the error state
			error.set(err.message);
		} finally {
			// Clear the loading state
			loading.set(false);
		}
	};



	/**
	 * Lifecycle hook to initialize the app with a default selected city.
	 */
	onMount(() => {
		// Set the default city to the first city in the list
		selectedCity = JSON.stringify(cities[0]);
		getWeather();
	});
</script>

<main>
	<h1 class="app-title">Weather App</h1>

	<div class="city-selector">
		<label for="city">Select a city:</label>

		<select id="city" bind:value={selectedCity} on:change={getWeather}>
			{#each cities as city}
				<option value={JSON.stringify(city)}>{city.name}</option>
			{/each}
		</select>
	</div>

	{#if $loading}
		<p class="loading">Loading...</p>
	{:else if $error}
		<p class="error">{$error}</p>
	{:else if $weatherData}
		<div class="weather-info">
			<p>
				Current temperature in {$weatherData.city}: <strong>{$weatherData.temperature}°C</strong>
			</p>
			<p>Measured at: <strong>{$weatherData.time}</strong></p>
		</div>
	{/if}
</main>

<style>
	/* App styles */
	main {
		font-family: Arial, sans-serif;
		text-align: center;
		margin: 20px;
	}

	.app-title {
		color: #4caf50;
		font-size: 2rem;
		margin-bottom: 20px;
	}

	.city-selector {
		margin-bottom: 20px;
	}

	.city-selector label {
		font-weight: bold;
		margin-right: 10px;
		font-size: large;
	}

	select {
		padding: 5px;
		font-size: 1rem;
	}

	.loading {
		font-style: italic;
		font-size: large;
	}

	.error {
		color: red;
		font-weight: bold;
	}

	.weather-info {
		margin-top: 20px;
		padding: 15px;
		font-size: large;
		border: 1px solid #ccc;
		border-radius: 5px;
		display: inline-block;
		background-color: #f9f9f9;
		text-align: left;
	}

	.weather-info p {
		margin: 5px 0;
	}
</style>
