$(document).ready(function() {

// Weather API //
const apiKey = "52926e6cab59a5ac00ea29afe5895e9f";

// Display Weather //
const cityEl = $("h2#city");
const dataEl = $("h3#date");
const weatherIconEl = $("img#weather-icon");
const temperatureEl = $("span#temperature");
const humidityEl = $("span#whumidity")
const windEl = $("span#wind");
const uvIndexEl = $("span#uv-index");
const cityListEl = $("div.cityList");

// Input City //
const cityInput =$("#city-input");

// Past Cities Searched //
let pastCities = [];

function compare(a,b) {
    const cityA = a.city.toUpperCase();
    const cityB = b.city.toUpperCase();

    let comparison = 0;
    if (cityA > cityB) {
        comparison =1;
        } else if (cityA < cityB) {
            comparison =-1;
        }
        return comparison;
    }

// Load Cities //
    function loadCities() {
        const storedCities = JSON.parse(localStorage.getItem("pastCities"));
        if (storedCities) {
            pastCities = storedCities;
        }
    }

// Store Cities //
    function storeCities() {
        localStorage.setItem("pastCities", JSON.stringify(pastCities));
    }

// API Weather Calls from openweathermap.org //
    function buildURLFromInputs(city) {
        if (city) {
            return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        }
    }
    
    function buildURLFormId(id) {
        return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
    }









})

