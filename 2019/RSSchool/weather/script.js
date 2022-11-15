import { 
    getReadableMonth,
    getDay,
    getHours,
    getPeriod,
    getMinutes,
    getCurrentDay,
} from './time.js';

const startingLocation = {};
let weatherObj = {};
let geoObj = {};
let currentLanguage;
let currentUnit;
let currentInput = '';
let offset;
const lang = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'search', 'feels like', 'wind', 'humidity', 'm/s'],
  ru: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'поиск', 'по ощущению', 'ветер', 'влажность', 'м/с'],
};

window.onload = () => {
  init();
  getStartingData();
  console.log('Heey! What are you doing there?');
};

window.setInterval(updateTime, 1000);
$(window).on('resize', changeBackgroundSize);

$('.celsius').on('click', selectUnits);
$('.fahrenheit').on('click', selectUnits);
$('.nav-mobile img').on('click', displayHideInputField);
$('.city button').on('click', displayHideDesktopInputField);
$('.desktop-input-wrapper button').on('click', desktopRequestData);
$(document).on('keydown', desktopRequestDataOnKey);
$(document).on('keydown', mobileRequestDataOnKey);

//  functions ------------------------------------------------------------------------------------------------------------

function refreshHTML() {
  $('.temp').html(getTemp(weatherObj.currently.temperature));
  $('.description').html(weatherObj.currently.summary);
  if (weatherObj.minutely !== undefined) {
    $('.quote').html(weatherObj.minutely.summary);
  } else if (weatherObj.hourly !== undefined) {
    $('.quote').html(weatherObj.hourly.summary);
  } else $('.quote').html('');

  if (weatherObj.currently.icon !== undefined) {
    $('.mobile-icon').attr('src', getIcon());
  }

  $('.details-table-wrapper .right-table li')[0].innerHTML = `${getTemp(weatherObj.currently.apparentTemperature)}°`;
  $('.details-table-wrapper .right-table li')[1].innerHTML = `${Math.round(weatherObj.currently.precipProbability * 100)}%`;
  $('.details-table-wrapper .right-table li')[2].innerHTML = `${Math.round(weatherObj.currently.cloudCover * 100)}%`;
  $('.details-table-wrapper .right-table li')[3].innerHTML = `${Math.round(weatherObj.currently.humidity * 100)}%`;
  $('.details-table-wrapper .right-table li')[4].innerHTML = `${Math.round(weatherObj.currently.windSpeed)} m/s`;

  $('.wind .value').html(`${Math.round(weatherObj.currently.windSpeed)}`);
  $('.rain .value').html(`${Math.round(weatherObj.currently.precipProbability * 100)}`);
  $('.humidity .value').html(`${Math.round(weatherObj.currently.humidity * 100)}`);

  $('.wind .bar-front').css('width', windSpeedWidth(Math.round(weatherObj.currently.windSpeed)));
  $('.wind .bar-front').css('background-color', getColor(Math.round((weatherObj.currently.windSpeed / 20) * 100)));

  $('.rain .bar-front').css('width', `${Math.round(weatherObj.currently.precipProbability * 100)}%`);
  $('.rain .bar-front').css('background-color', getColor(weatherObj.currently.precipProbability * 100));

  $('.humidity .bar-front').css('width', `${Math.round(weatherObj.currently.humidity * 100)}%`);
  $('.humidity .bar-front').css('background-color', getColor(weatherObj.currently.humidity * 100));

  $('.city-name').html(getCityName());
  $('.city-name-mobile').html(getCityNameMobile());
  $('.location').html(getLocationString());

  [0, 1, 2, 3, 4, 5].forEach((n) => {
    $('.next-days-table-wrapper .left-table li')[n].innerHTML = getCurrentDay(n + 1, currentLanguage);
  });
  [0, 1, 2, 3, 4, 5].forEach((n) => {
    $('.next-days-table-wrapper .right-table li')[n].innerHTML = `${getTemp((weatherObj.daily.data[n + 1].temperatureHigh + weatherObj.daily.data[n + 1].temperatureLow) / 2)}°`;
  });

  getImage();
}

function init() {
  currentLanguage = 'en';
  currentUnit = 'cel';
  $('.celsius').css('background', 'rgba(21, 94, 150, 0.4)');
}

async function getWeatherData() {
  if (currentInput !== '') {
    const overlay = $('.loading-overlay');
    const text = $('.loading-overlay p');
    const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${currentInput}&key=93a85429eb9e4bd4ba181eaec6abb06b&pretty=1&language=${currentLanguage}`;
    const request = new XMLHttpRequest();

    overlay.css('visibility', 'visible');
    overlay.css('opacity', '0.8');
    text.css('opacity', '1');

    request.open('GET', geoUrl, true);
    request.send();

    request.onload = async () => {
      const data = JSON.parse(request.responseText);
      if (data.results.length < 1) {
        setTimeout(alert(`I can't find the thing you typed in. Try entering international city name.`), 1500);
        overlay.css('visibility', 'hidden');
          overlay.css('opacity', '0');
          text.css('opacity', '0');
        return;
      }

      const coords = data.results[0].geometry;
      geoObj = data;

      const weatherUrl = `https://api.darksky.net/forecast/9714c5c26777551a3e1ac6c8be82a2dd/${coords.lat},${coords.lng}?lang=${currentLanguage}`;
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      fetch(proxyUrl + weatherUrl)
        .then((response) => response.json())
        .then((weatherData) => {
          weatherObj = weatherData;
        })
        .then(refreshHTML)
        .then(() => {
          overlay.css('visibility', 'hidden');
          overlay.css('opacity', '0');
          text.css('opacity', '0');
        });
    };
  }
}

async function getStartingData() {
  const ipUrl = 'https://ipinfo.io/json?token=7236266f062db3';

  const weatherRequest = new XMLHttpRequest();
  weatherRequest.open('GET', ipUrl, true);
  weatherRequest.send();

  weatherRequest.onload = async () => {
    const data = JSON.parse(weatherRequest.responseText);

    startingLocation.lat = data.loc.split(',')[0];
    startingLocation.lng = data.loc.split(',')[1];
    const url = `https://api.darksky.net/forecast/9714c5c26777551a3e1ac6c8be82a2dd/${startingLocation.lat},${startingLocation.lng}?lang=${currentLanguage}`;
    const proxyUrl = 'https://api.allorigins.win/raw?url=';

    fetch(proxyUrl + url)
      .then((response) => response.json())
      .then((weatherData) => {
        weatherObj = weatherData;
        offset = weatherObj.offset;
      })
      .then(() => {
        const geoRequest = new XMLHttpRequest();
        const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${startingLocation.lat}%2C${startingLocation.lng}&key=93a85429eb9e4bd4ba181eaec6abb06b&pretty=1&language=${currentLanguage}`;
        geoRequest.open('GET', geoUrl, true);
        geoRequest.send();

        geoRequest.onload = async () => {
          geoObj = JSON.parse(geoRequest.responseText);
          refreshHTML();
          removeFirstLoadingOverlay();
        };
      });
  };
}

function languageChange() {
  currentLanguage = $('.language').val();
  getWeatherData();
  refreshHTML();
}

function updateTime() {
  if (weatherObj.offset !== undefined) {
    const time = new Date(new Date().getTime() + (weatherObj.offset * 1000 * 3600) - (offset * 1000 * 3600));
    $('.year').html(time.getFullYear());
    $('.month').html(getReadableMonth(time.getMonth(), currentLanguage));
    $('.day').html(time.getDate());
    $('.week-day').html(getDay(time, currentLanguage));
    $('.period').html(getPeriod(time));
    $('.time').html(`${getHours(time)}:${getMinutes(time)}`);
  }
}

function getTemp(temp) {
  if (currentUnit === 'cel') return `${Math.round(((temp - 32) * 5) / 9)}`;
  return `${Math.round(temp)}`;
}

function getImage() {
  const body = $('body')[0];
  const width = window.innerWidth;
  const weatherString = weatherObj.currently.summary.toLowerCase();
  let str;

  if (width < 751) {
    str = 'mobile';
    body.classList.add('mob');
  } else str = 'desktop';

  if (weatherString.includes('overcast')) {
    body.style.backgroundImage = `url('assets/images/${str}/overcast (${Math.floor(Math.random() * 12) + 1}).jpg')`;
  } else if (weatherString.includes('cloud')) {
    body.style.backgroundImage = `url('assets/images/${str}/clouds (${Math.floor(Math.random() * 12) + 1}).jpg')`;
  } else if (weatherString.includes('clear')) {
    body.style.backgroundImage = `url('assets/images/${str}/clear (${Math.floor(Math.random() * 6) + 1}).jpg')`;
  } else if (weatherString.includes('rain') || weatherString.includes('drizzle') || weatherString.includes('hail')) {
    body.style.backgroundImage = `url('assets/images/${str}/rain (${Math.floor(Math.random() * 7) + 1}).jpg')`; 
  } else if (weatherString.includes('snow')) {
    body.style.backgroundImage = `url('assets/images/${str}/snow (${Math.floor(Math.random() * 8) + 1}).jpg')`;
  } else if (weatherString.includes('fog')) {
    body.style.backgroundImage = `url('assets/images/${str}/fog (${Math.floor(Math.random() * 11) + 1}).jpg')`;
  } else if (weatherString.includes('thunder') || weatherString.includes('storm')) {
    body.style.backgroundImage = `url('assets/images/${str}/thunder (${Math.floor(Math.random() * 5) + 1}).jpg')`;
  } else if (weatherString.includes('tornado')) {
    body.style.backgroundImage = `url('assets/images/${str}/tornado (${Math.floor(Math.random() * 3) + 1}).jpg')`;
  } else {
    body.style.backgroundImage = `url('assets/images/${str}/default.jpg')`;
  }

  if (width < 751) {
    body.style.backgroundSize = `auto ${document.body.scrollHeight}px`;

    let image = new Image();
    image.src = body.style.backgroundImage.slice(5, -2);
    image.onload = () => {
      if (Math.round(image.width * document.body.scrollHeight / image.height, window.innerWidth) < window.innerWidth) {
        body.style.backgroundSize = `${window.innerWidth}px auto`;
      }
    }
  }
}

function selectUnits(e) {
  $('.celsius').css('background', '');
  $('.fahrenheit').css('background', '');

  $(this)[0].style.background = 'rgba(21, 94, 150, 0.4)';

  if (e.target.innerHTML === '°F') {
    currentUnit = 'far';
  }

  if (e.target.innerHTML === '°C') {
    currentUnit = 'cel';
  }

  $('.temp').html(getTemp(weatherObj.currently.temperature));
  $('.details-table-wrapper .right-table li')[0].innerHTML = `${getTemp(weatherObj.currently.apparentTemperature)}°`;
  [0, 1, 2, 3, 4, 5].forEach((n) => {
    $('.next-days-table-wrapper .right-table li')[n].innerHTML = `${getTemp((weatherObj.daily.data[n + 1].temperatureHigh + weatherObj.daily.data[n + 1].temperatureLow) / 2)}°`;
  });
}

function displayHideInputField() {
  const input = $('.nav-mobile input')[0];
  if (input.style.width !== '70%') {
    input.style.width = '70%';
    input.style.opacity = '1';
    input.focus();
  } else {
    input.style.width = '0%';
    input.style.opacity = '0';
    input.blur();
  }
  currentInput = input.value;
  if (input.value !== '') {
    input.value = '';
    getWeatherData();
  }
}

function displayHideDesktopInputField() {
  const input = $('.desktop-input-wrapper')[0];

  if (input.style.marginTop !== '0px') input.style.marginTop = '0px';
  else input.style.marginTop = '-40px';
  $('.desktop-input')[0].focus();
}

function desktopRequestData() {
  const inputWrapper = $('.desktop-input-wrapper')[0];
  const input = $('.desktop-input')[0];
  currentInput = input.value;

  if (input.value !== '') {
    inputWrapper.style.marginTop = '-40px';
    input.value = '';
    getWeatherData();
  }
}

function desktopRequestDataOnKey(e) {
  if (e.key === 'Enter') {
    if ($('.desktop-input')[0] === document.activeElement) {
      desktopRequestData();
    }
  }
}

function mobileRequestDataOnKey(e) {
  if (e.which === 13) {
    if ($('.mobile-input')[0] === document.activeElement) {
      displayHideInputField();
    }
  }
}

function windSpeedWidth(speed) {
  const maxSpeed = 20;

  const width = Math.round((speed / maxSpeed) * 100);

  if (width > 100) return '100%';
  return `${width}%`;
}

function getColor(value) {
  if (value > 80) return 'rgb(201, 46, 35)';
  if (value > 60) return 'rgb(201, 115, 35)';
  if (value > 40) return 'rgb(201, 190, 35)';
  if (value > 20) return 'rgb(143, 201, 35)';
  return 'rgb(35, 201, 109)';
}

function getLocationString() {
  let city;
  let country;

  if (geoObj.results[0].components.city !== undefined) city = geoObj.results[0].components.city;
  else if (geoObj.results[0].components.state !== undefined) city = geoObj.results[0].components.state;
  else if (geoObj.results[0].components.state_district !== undefined) city = geoObj.results[0].components.state_district;
  else city = '';

  if (geoObj.results[0].components.country !== undefined) country = geoObj.results[0].components.country;
  else if (geoObj.results[0].components.continent !== undefined) country = geoObj.results[0].components.continent;
  else country = '';

  if (city === '') return country;
  return `${city}, ${country}`;
}

function changeBackgroundSize() {
  const body = $('body')[0];

  if (window.innerWidth > 751) {
    body.style.backgroundSize = '';

    if (body.classList.contains('mob')) {
      body.classList.remove('mob');
      getImage();
    }
  } else {
    if (!body.classList.contains('mob')) {
      body.classList.add('mob');
      getImage();
    }

    body.style.backgroundSize = `auto ${document.body.scrollHeight}px`;

    let image = new Image();
    image.src = body.style.backgroundImage.slice(5, -2);
    if (Math.round(image.width * document.body.scrollHeight / image.height, window.innerWidth) < window.innerWidth) {
      body.style.backgroundSize = `${window.innerWidth}px auto`;
    }
  }
}

function getIcon() {
  const key = weatherObj.currently.icon;

  switch (key) {
    case 'clear-day':
      return `assets/icons/sunny.png`;

    case 'clear-night':
      return `assets/icons/moon.png`;

    case 'partly-cloudy-day':
      return `assets/icons/partly-cloudy.png`;

    case 'partly-cloudy-night':
      return `assets/icons/partly-cloudy.png`;

    case 'rain':
      return `assets/icons/rain-1.png`;

    case 'snow':
      return `assets/icons/snow.png`;

    case 'sleet':
      return `assets/icons/sleet.png`;

    case 'wind':
      return `assets/icons/storm.png`;

    case 'fog':
      return `assets/icons/foggy.png`;

    case 'cloudy':
      return `assets/icons/cloudy.png`;

    case 'hail':
      return `assets/icons/hail.png`;

    case 'thunderstorm':
      return `assets/icons/thunder.png`;

    case 'tornado':
      return `assets/icons/tornado.png`;

    default:
      return '';
  }
}

function getCityName() {
  let str;

  if (geoObj.results[0].components.city !== undefined)  str = geoObj.results[0].components.city;
  else if (geoObj.results[0].components.state !== undefined)  str = geoObj.results[0].components.state;
  else if (geoObj.results[0].components.state_district !== undefined)  str = geoObj.results[0].components.state_district;
  else str = '';

  if (str.length > 20) str = `${str.slice(0, 12)}...`;
  return str;
}

function getCityNameMobile() {
  let str;

  if (geoObj.results[0].components.city !== undefined)  str = geoObj.results[0].components.city;
  else if (geoObj.results[0].components.state !== undefined)  str = geoObj.results[0].components.state;
  else if (geoObj.results[0].components.state_district !== undefined)  str = geoObj.results[0].components.state_district;
  else str = '';

  return str;
}

function removeFirstLoadingOverlay() {
  const overlay = $('.first-loading-overlay');
  overlay.css('visibility', 'hidden');
  overlay.css('opacity', '0');
}