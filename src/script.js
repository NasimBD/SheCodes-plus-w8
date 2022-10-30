let cityTempC;
let cityName;

let apiKey = '3c9531b76267799b3c856843d5e623c0';
let baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

let weatherInfo = document.querySelector('#weatherInfo');
let searchCityForm = document.querySelector('#searchCityForm');
// let currentBtn = document.querySelector('#current_btn');
// let currentLocation = document.querySelector('#current_location');
let city = document.querySelector('#city');
let currentIcon = document.querySelector('#current_icon');
let currentTemp = document.querySelector('#currentTemp');
let degreeF = document.querySelector('#degreeF');
let degreeC = document.querySelector('#degreeC');
// let precipitation = document.querySelector('#precipitation');
// let feelsLike = document.querySelector('#feels_like');
let humidity = document.querySelector('#humidity');
let wind = document.querySelector('#wind');
let currentDescription = document.querySelector('#currentDescription');
let todayDate = document.querySelector('#today_day');
let currentTime = document.querySelector('#current_time');
let dailyForecast = document.querySelector('#dailyForecast');

let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'saturday'];

weatherInfo.style.display = "none";
// currentLocation.style.display = "none";


searchCityForm.addEventListener('submit', getWeather);
function getWeather(event){
  event.preventDefault();
  // currentLocation.style.display = "none";
  cityName =  document.querySelector('#searchCityForm [type="search"]').value.trim().toLocaleLowerCase();
  if(cityName){
    let weatherApi = `${baseUrl}?q=${cityName}&units=metric&appid=${apiKey}`;
    axios.get(weatherApi).then(getLatLongByCityName).catch(function (error) {
      // handle error
      console.log(error);
      alert(error.message);
    });
  }
}

degreeC.addEventListener('click', activateCentigrade);
function activateCentigrade() {
  currentTemp.innerHTML = cityTempC;
  degreeF.classList.remove('fw-bold', 'text-dark');
  degreeF.classList.add('text-primary', 'opacity-75');
  degreeC.classList.remove('text-primary');
  degreeC.classList.add('fw-bold', 'text-dark', 'opacity-100');
}

degreeF.addEventListener('click', activateFahrenheit);
function activateFahrenheit() {
  let cityTempF = convertToFahrenheit(cityTempC);
  currentTemp.innerHTML = cityTempF;
  degreeC.classList.remove('fw-bold', 'text-dark');
  degreeC.classList.add('text-primary', 'opacity-75');
  degreeF.classList.remove('text-primary');
  degreeF.classList.add('fw-bold', 'text-dark', 'opacity-100');
  
}

// converts the temperature unit
function convertToFahrenheit(c) {
  return Math.round(9/5 * c + 32);
}

// by city name 
function getLatLongByCityName(response){
  console.log('response GetLAtBy', response.data);
  let data = response.data;
  let requestedLatitude = data.coord.lat;
  let requestedLongitude = data.coord.lon;
  getWeatherByLatLong(requestedLatitude, requestedLongitude);
}

// gets weather response from a weather api
function processResponse(response){
  let data = response.data;
  let current = data.current;
  console.log(data);
  cityTempC = Math.round(current.temp);
  currentTemp.innerHTML = cityTempC;
  let systemDateObj = new Date(current.dt);
  let sysTimezoneOffset = systemDateObj.getTimezoneOffset() * 60; //*1 --> 'UTC' relative to 'system'
  setDateTime((current.dt + sysTimezoneOffset + data.timezone_offset) * 1000); //*2
  populateDailyForecast(data.daily);
  // precipitation.innerHTML = data.main;
  // feelsLike.innerHTML = data.main.feels_like;
  humidity.innerHTML = current.humidity;
  wind.innerHTML = Math.round(current.wind_speed);
  currentDescription.innerHTML = current.weather[0].description;
  city.innerHTML = cityName;
  currentIcon.innerHTML = `<img src="http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png" alt="weather icon">`;
  weatherInfo.style.display = "block";
}

// --------------------------------------------------------------
// on pressing 'Current' button
// currentBtn.addEventListener('click', getCurrentLocationData);

function getCurrentLocationData(){
  navigator.geolocation.getCurrentPosition(getCurrentLocationWeather);
}

// gets latitude & longitude from position returned from navigator.geolocation.getCurrentPosition
function getCurrentLocationWeather(position){
  let currentLat = position.coords.latitude;
  let currentLong = position.coords.longitude;
  getWeatherByLatLong(currentLat, currentLong);
}

// gets data from api by latitude & longitude and populates the respective elements
function getWeatherByLatLong(latitude, longitude) {
  if(typeof latitude !== 'undefined' && typeof longitude !== 'undefined'){
    let weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely,alerts&units=metric&appid=3c9531b76267799b3c856843d5e623c0`;
    // https://api.openweathermap.org/data/2.5/onecall?lat=${currentLat}.7267&lon=${currentLong}&exclude=current,hourly,minutely,alerts&units=metric&appid=3c9531b76267799b3c856843d5e623c0
    axios.get(weatherApi).then(processResponse).catch(function (error) {
      // handle error
      console.log(error);
      alert(error.message);
    });;
  }
  // populateCurrentLocationElem(latitude, longitude);
}

// populates the elements related to the current location
function populateCurrentLocationElem(latP, longP){
  let currentLatElem = document.getElementById('current_lat');
  let currentLongElem = document.getElementById('current_long');
  currentLatElem.innerHTML = latP;
  currentLongElem.innerHTML = longP;
  currentLocation.style.display = "block";
}

// --------------------------------------------------------------
// populates the elements related to the current time & date
function setDateTime(timeStamp){
  let dateObj = new Date(timeStamp); 
  todayDate.innerHTML = days[dateObj.getDay()];
  currentTime.innerHTML = dateObj.getHours() + ':' + dateObj.getMinutes();
}


//1-  getTimezoneOffset() returns the difference between UTC time and local time. It returns the difference in minutes.
//2-  timezone: Shift in seconds from UTC


// --------------------------------------------------------------
// populate #dailyForecast
function populateDailyForecast(dailyArr){
  let dailyForecastHtml = '';
  dailyArr.forEach((dayObj, indx) => {
    if(indx < 7){
      console.log(dayObj);
      dailyForecastHtml += `
        <div class="col-2 col-sm-2 col-md-1 text-center d-flex  flex-column">
          <span class="day fw-bold text-center">
              ${days[indx].slice(0,3)}
          </span>
          <span class="icon">
          <img class="daily_icon" src="http://openweathermap.org/img/wn/${dayObj.weather[0].icon}@2x.png" alt="weather icon - ${dayObj.weather[0].description}">
          </span>
          <span class="temperatures d-flex justify-content-around">
              <span class="maxTemp small fw-bold">${Math.round(dayObj.temp.max)}&deg;</span>&nbsp;
              <span class="minTemp small">${Math.round(dayObj.temp.min)}&deg;</span>
          </span>
        </div>
      `;
      dailyForecast.innerHTML = dailyForecastHtml;
    }

  })
}

// axios.get('https://api.openweathermap.org/data/2.5/onecall?lat=38.7267&lon=-9.1403&exclude=hourly,minutely,alerts&units=metric&appid=3c9531b76267799b3c856843d5e623c0').then(e => console.log(e.data))