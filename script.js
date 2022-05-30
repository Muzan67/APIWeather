$(document).ready(function() {

    // Weather API //
    const apiKey = "52926e6cab59a5ac00ea29afe5895e9f";
    
    // Display Weather //
    const cityEl = $("#city-search-form");
    const dateEl = $("#date");
    const weatherIconEl = $("#weather-icon");
    const temperatureEl = $("#temp");
    const humidityEl = $("#humidity")
    const windEl = $("#wind");
    const uvIndexEl = $("#uvindex");
    const cityListEl = $("div.cityList");
    const cityInput =$("#city-input");
    let pastCities = [];
    
    function compare(a,b) {
        const cityA = a.city.toUpperCase();
        const cityB = b.city.toUpperCase();
    
        let comparison = 0;
        if (cityA > cityB) {
            comparison =1;
        } else if (cityA < cityB) {
            comparison = -1;
        }
        return comparison;
    }
    
    // Load Cities //
    function loadCities() {
        const storedCities = JSON.parse(localStorage.getItem('pastCities'));
        if (storedCities) {
            pastCities = storedCities;
        }
    }
    
    // Store Cities //
    function storeCities() {
        localStorage.setItem('pastCities', JSON.stringify(pastCities));
    }
    
    // API Weather Calls from openweathermap.org //
    function buildURLFromInputs(city) {
        if (city) {
        return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${"52926e6cab59a5ac00ea29afe5895e9f"}`;
        }
    }
    
    function buildURLFormId(id) {
        return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${"52926e6cab59a5ac00ea29afe5895e9f"}`;
    }
    
    // Display searched cities //
    function displayCities(pastCities) {
        cityListEl.empty();
        pastCities.splice(5);
        let sortedCities = [...pastCities];
        sortedCities.sort(compare);
        sortedCities.forEach(function (location) {
            let cityDiv = $('<div>').addClass('col-12 city');
            let cityBtn = $('<button>').addClass('btn btn-light city-btn').text(location.city);
            cityDiv.append(cityBtn);
            cityListEl.append(cityDiv);
            
        });
    }
    
    // Display previous Cities // 
    function displayLastSearchedCity() {
        if (pastCities[0]) {
            let queryURL = buildURLFormId(pastCities[0].id);
            searchWeather(queryURL);
        } else {
            // if no city is selected always select NYC Manhattan//
            let queryURL = buildURLFormInputs("Manhattan");
            searchWeather(queryURL);
        }
    }
    
    // UV INdex If Else //
    function setUVIndexColor(uvi) {
        if (uvi < 2) {
            return 'green';
        } else if (uvi >=2 && uvi < 5) {
            return 'yellow';
        } else if (uvi >=5 && uvi < 7) {
            return 'orange';
        } else if (uvi >=7 && uvi < 10) {
            return 'red';
        } else return 'purple';
    }
    
    // AJAX search weather function //
    function searchWeather(queryURL) {

        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {

            let city = response.name;
            let id = response.id

            if (pastCities[0]) {
                pastCities = $.grep(pastCities, function (storedCity) {
                    return id !== storedCity.id;
                })
            }
            pastCities.unshift({ city, id });
            storeCities();
            displayCities(pastCities);
    
    // Display weather //
            cityEl.text(response.name);
            let formattedDate = moment.unix(response.dt).format('L');
            dateEl.text(formattedDate);
            let weatherIcon = response.weather[0].icon;
            weatherIconEl.attr('src', `http://openweathermap.org/img/wn/${weatherIcon}.png`).attr('alt', response.weather[0].description);
            temperatureEl.html(((response.main.temp - 273.15) * 1.8 + 32).toFixed(1));
            humidityEl.text(response.main.humidity);
            windEl.text((response.wind.speed * 2.237).toFixed(1));

    
            let lat = response.coord.lat;
            let lon = response.coord.lon;
            let queryURLAll = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${"52926e6cab59a5ac00ea29afe5895e9f"}`;
            $.ajax({
                url: queryURLAll,
                method: 'GET'
            }).then(function (response) {
                let uvIndex = response.current.uvi;
                let uvColor = setUVIndexColor(uvIndex);
                uvIndexEl.text(response.current.uvi);
                uvIndexEl.attr('style', `background-color: ${uvColor}; color: ${uvColor === "yellow" ? "black" : "white"}`);
                let fiveDay = response.daily;
    
                for (let i = 0; i <= 5; i++) {
                    let currDay = fiveDay[i];
                    //console.log (currDay.weather[0].icon)
                    $(`div.day-${i} .card-title`).text(moment.unix(currDay.dt).format('L'));
                    $(`div.day-${i} .five-day-img`).attr(
                        'src',
                        `http://openweathermap.org/img/wn/${currDay.weather[0].icon}.png`
                    ).attr('alt', currDay.weather[0].description);
                    $(`div.day-${i} .fiveDay-temp`).text(((currDay.temp.day - 273.15) * 1.8 + 32).toFixed(1));
                    $(`div.day-${i} .fiveDay-humid`).text(currDay.humidity);
                }
            });
        });
    }
    
    // search button //
    $('#search-btn').on('click', function (event) {
        event.preventDefault();
    // place cities in search bar //
        let city = cityInput.val().trim();
        city = city.replace(' ', '%20');
        cityInput.val('');
    
        if (city) {
            let queryURL = buildURLFromInputs(city);
            searchWeather(queryURL);
        }
    });


    // button to receive Weather from city of choice//
    $(document).on("click", "button.city-btn", function(event) {
        let clickedCity = $(this).text();
        let foundCity = $.grep(pastCities, function (storedCity) {
            return clickedCity === storedCity.city;
        })
        let queryURL = buildURLFormId(foundCity[0].id)
        searchWeather(queryURL);
    });
    
    loadCities();
    displayCities(pastCities);
    
    displayLastSearchedCity();
    
});
    
    