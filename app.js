mapboxgl.accessToken =
  'pk.eyJ1IjoiaW5zMGxpdHVkMyIsImEiOiJjbHJueDJ0cjAxYjE2MnJvY3pwdDZxdDRnIn0.mtsKOzz-TUCCfERD68hFmg'

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [0, 0],
  zoom: 8,
})

async function getWeather() {
  const cityInput = document.getElementById('cityInput').value

  try {
    const response = await fetch(`http://localhost:3000/weather?city=${cityInput}`)
    const data = await response.json()

    const weatherInfoElement = document.getElementById('weather-info')
    weatherInfoElement.innerHTML = `
       
      <p class="result-label">Temperature:</p>
      <p class="result-value">${data.temp}</p>

      <p class="result-label">Feels Like:</p>
      <p class="result-value">${data.feels}</p>

      <p class="result-label">Description:</p>
      <p class="result-value">${data.desc}</p>

      <p class="result-label">Humidity:</p>
      <p class="result-value">${data.humid}</p>

      <p class="result-label">Pressure:</p>
      <p class="result-value">${data.press}</p>

      <p class="result-label">Wind Speed:</p>
      <p class="result-value">${data.wspeed}</p>

      <p class="result-label">Country Code:</p>
      <p class="result-value">${data.countryCod}</p>

      <p class="result-label">Coordinates:</p>
      <p class="result-value">${data.coord} (lon), ${data.coord2} (lat)</p>

      <img class="result-icon" src="${data.iconURL}" alt="Weather Icon">
    `
    updateMap(data.coord, data.coord2)
  } catch (error) {
    console.error(error)
  }
}

function updateMap(lon, lat) {
  map.flyTo({
    center: [lon, lat],
    essential: true,
    speed: 0.8,
  })
}

document.getElementById('getWeatherButton').addEventListener('click', getWeather)
