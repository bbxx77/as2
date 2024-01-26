const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"index.html"));
});

app.post("/weather", async (req, res) => {
  const city = req.body.city;

  try {
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=0251242d9b37d306eff9cb8f37c06f3d&units=metric`
    );
    const weatherData = weatherResponse.data;

    console.log("Weather Data:", weatherData);

    const temperature = weatherData.main.temp;
    const feelsLike = weatherData.main.feels_like;
    const weatherIcon = weatherData.weather[0].icon;

    const weatherContent = `
      <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; margin-top: 20px;">
        <h2 style="color: #333;">Weather in ${city}</h2>
        <p style="color: #666; font-size: 18px;">Temperature: ${temperature} &deg;C</p>
        <p style="color: #666; font-size: 18px;">Feels Like: ${feelsLike} &deg;C</p>
        <p>Weather Icon: <img src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png" alt="Weather Icon"></p>
      </div>
    `;

    let existingHtml = fs.readFileSync(__dirname + "index.html", "utf8");

    existingHtml = existingHtml.replace('</body>', `${weatherContent}</body>`);

    res.send(existingHtml);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching weather data");
  }
});

app.post("/mapping", async (req, res) => {
  const city = req.body.city;

  try {
    const geocodingResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=b7a46591c7msh9fd0404fd28ff29p1a4c3ejsn4be6a293c2f2`
    );

    const locationData = geocodingResponse.data.results[0].geometry.location;

    const mapContent = `
      <div id="map" style="width: 100%; height: 300px;"></div>
      <script src="https://maps.googleapis.com/maps/api/js?key=b7a46591c7msh9fd0404fd28ff29p1a4c3ejsn4be6a293c2f2&callback=initMap" async defer></script>
      <script>
        function initMap() {
          const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: ${locationData.lat}, lng: ${locationData.lng} },
            zoom: 12
          });

          new google.maps.Marker({
            position: { lat: ${locationData.lat}, lng: ${locationData.lng} },
            map: map,
            title: '${city}'
          });
        }
      </script>
    `;

    let existingHtml = fs.readFileSync(__dirname + "index.html", "utf8");

    existingHtml = existingHtml.replace('</body>', `${mapContent}</body>`);

    res.send(existingHtml);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching mapping data");
  }
});

app.post('/currency', async (req, res) => {
  const { amount, fromCurrency, toCurrency } = req.body;

  const options = {
    method: 'GET',
    url: 'https://currencyapi-net.p.rapidapi.com/convert',
    params: {
      from: fromCurrency,
      to: toCurrency,
      amount: amount,
      output: 'JSON'
    },
    headers: {
      'X-RapidAPI-Key': 'b7a46591c7msh9fd0404fd28ff29p1a4c3ejsn4be6a293c2f2',
      'X-RapidAPI-Host': 'currencyapi-net.p.rapidapi.com'
    }
  };

  try {
    const response = await axios.request(options);
    const result = response.data;
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching currency data' });
  }
});

app.post("/urban-dictionary", async (req, res) => {
  const term = req.body.term;

  try {
    const response = await axios.request({
      method: "GET",
      url: "https://mashape-community-urban-dictionary.p.rapidapi.com/define",
      params: { term: term },
      headers: {
        "X-RapidAPI-Key": "b7a46591c7msh9fd0404fd28ff29p1a4c3ejsn4be6a293c2f2",
        "X-RapidAPI-Host": "mashape-community-urban-dictionary.p.rapidapi.com",
      },
    });

    const definitions = response.data.list;
    res.json({ definitions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching Urban Dictionary data" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
