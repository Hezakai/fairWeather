const API_KEY = '4e9556b884c154f3742cc9f66d300af2'

const searchBtn = document.getElementById('searchBtn')
const searchInput = document.getElementById('searchInput')
const cityCurrSection = document.getElementById('cityCurr')
const fiveDaySection = document.getElementById('fiveDaySec')
const searchHistorySection = document.getElementById('searchHistory')

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []

searchBtn.addEventListener('click', function(e) {
    e.preventDefault()

    var city = searchInput.value
    callCurrentF(city)
})

function callCurrentF(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)

        let lat = data.coord.lat
        let lon = data.coord.lon
        displayCurrentF(data.name, data.weather[0].description, data.main.temp, data.main.humidity, data.wind.speed)
        call5D(lat, lon)
        addToSearchHistory(data.name)
    })
}

function call5D(lat, lon) {
    fiveDaySection.innerHTML = '';
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&appid=${API_KEY}`)
    .then(response => response.json())
    .then(fiveData => {
        console.log(fiveData)
        
        fiveData.list.forEach(data => {
            let date = new Date(data.dt * 1000).toLocaleDateString()
            let time = new Date(data.dt * 1000).toLocaleTimeString()
            let temp = data.main.temp
            let desc = data.weather[0].description
            displayFiveDay(date, time, temp, desc)
        })
    })
}

function displayCurrentF(city, desc, temp, humidity, wind) {
    cityCurrSection.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h1>${city}</h1>
                <p>${desc}</p>
                <p>Temperature: ${temp}</p>
                <p>Humidity: ${humidity}</p>
                <p>Wind Speed: ${wind}</p>
            </div>
        </div>
    `
}

function displayFiveDay(date, time, temp, desc) {
    let card = document.createElement('div')
    card.classList.add('card')
    card.innerHTML = `
        <div class="card-body">
            <h2>${date}</h2>
            <p>${time}</p>
            <p>Temperature: ${temp}</p>
            <p>${desc}</p>
        </div>
    `
    fiveDaySection.appendChild(card)
}

function addToSearchHistory(city) {
    if (searchHistory.includes(city)) {
        return
    }
    searchHistory.push(city)
    if (searchHistory.length > 6) {
        searchHistory.shift()
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
    displaySearchHistory()
}

function displaySearchHistory() {
    searchHistorySection.innerHTML = ''
    searchHistory.forEach(city => {
        let button = document.createElement('button')
        button.classList.add('btn', 'btn-secondary', 'mr-1', 'mb-1')
        button.textContent = city
        button.addEventListener('click', function(e) {
            e.preventDefault()
            callCurrentF(city)
        })
        searchHistorySection.appendChild(button)
    })
}

displaySearchHistory()
