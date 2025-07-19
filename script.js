const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const statusMessageDiv = document.getElementById("statusMessage");
const weatherResultDiv = document.getElementById("weatherResult");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();
    weatherResultDiv.innerHTML = "";
    weatherResultDiv.classList.add("opacity-0", "scale-95");

    if (!city) {
        statusMessageDiv.textContent = "Please enter a city name.";
        return;
    }

    statusMessageDiv.textContent = `Fetching weather for ${city}...`;

    try {
        const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`);
        if (!response.ok) {
            throw new Error(`City not found or network error.`);
        }

        const weatherData = await response.json();

        const nearestArea = (weatherData.nearest_area || [])[0] || {};
        const areaName = (nearestArea.areaName || [])[0]?.value || "";
        
        // Error handling: check if the returned area name matches search city (rough check)
        if (!areaName || !areaName.toLowerCase().includes(city.toLowerCase())) {
            throw new Error("Invalid city. Please enter a valid city name.");
        }

        statusMessageDiv.textContent = "";
        displayWeatherData(weatherData);

    } catch (error) {
        console.error(`Error fetching the data: ${error.message}`);
        statusMessageDiv.textContent = `⚠️ ${error.message}`;
        weatherResultDiv.classList.add("opacity-0", "scale-95");
    }
});

function displayWeatherData(data) {
    const currentCondition = (data.current_condition || [])[0] || {};
    const nearestArea = (data.nearest_area || [])[0] || {};
    const weatherDesc = (currentCondition.weatherDesc || [])[0] || {};
    const areaName = (nearestArea.areaName || [])[0] || {};
    const country = (nearestArea.country || [])[0] || {};

    const weatherHTML = `
        <div class="flex justify-between items-start">
            <div>
                <h2 class="text-2xl font-bold">${areaName.value || 'Unknown Location'}</h2>
                <p class="text-indigo-200">${country.value || ''}</p>
            </div>
            <div class="text-4xl font-bold text-right">
                ${currentCondition.temp_C || 'N/A'}&deg;C
            </div>
        </div>
        <div class="mt-6">
            <p class="text-lg font-medium">${weatherDesc.value || 'No description'}</p>
            <p class="text-indigo-200">Feels like ${currentCondition.FeelsLikeC || 'N/A'}&deg;C</p>
        </div>
        <div class="mt-6 border-t border-indigo-400 pt-4 flex justify-between text-sm">
            <div>
                <span class="text-indigo-200">Wind Speed</span>
                <p class="font-semibold">${currentCondition.windspeedKmph || 'N/A'} km/h</p>
            </div>
            <div>
                <span class="text-indigo-200">Humidity</span>
                <p class="font-semibold">${currentCondition.humidity || 'N/A'}%</p>
            </div>
            <div>
                <span class="text-indigo-200">Visibility</span>
                <p class="font-semibold">${currentCondition.visibility || 'N/A'} km</p>
            </div>
        </div>
    `;

    weatherResultDiv.innerHTML = weatherHTML;
    weatherResultDiv.classList.remove("opacity-0", "scale-95");
}
