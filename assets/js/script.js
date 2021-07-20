var APIKey = "b372a22e914d50542c7875db61ca6a6e";
//Keep the units as imperial to return values in farenheit
var queryBaseURL = "http://api.openweathermap.org/data/2.5/weather?units=imperial&appid=" + APIKey;

var removeAllChildElements = function (parentElem) {
  //Remove all child elements
  while (parentElem.firstChild) {
    parentElem.removeChild(parentElem.firstChild);
  }
}

var weatherDashboard = {

  searchHistoryList: [],
  city: "",

  // Function to display the weather details
  displayWeather: function (data) {
    var today = moment().format("M-d-y");
    var weatherElem = document.getElementById("weatherSummary");

    //Remove all child elements
    removeAllChildElements(weatherElem);

    //Create and add title element
    var titleElem = document.createElement("h2");
    titleElem.innerHTML = this.city + " (" + today + ")";
    weatherElem.appendChild(titleElem);

    //Create and add temparature element
    var temparatureElem = document.createElement("div");
    temparatureElem.innerHTML = "Temp: " + data.main.temp + "&deg;F";
    weatherElem.appendChild(temparatureElem);

    //Create and add wind element
    var windElem = document.createElement("div");
    windElem.innerHTML = "Wind: " + data.wind.speed + " MPH";
    weatherElem.appendChild(windElem);

    //Create and add wind element
    var humidityElem = document.createElement("div");
    humidityElem.innerHTML = "Humidity: " + data.main.humidity + " %";
    weatherElem.appendChild(humidityElem);

    //Create and add uvindex element
    var uvIndexElem = document.createElement("div");
    uvIndexElem.innerHTML = "UV Index: " + (data.uvi || "-");
    weatherElem.appendChild(uvIndexElem);


  },

  // Function to fetch weather details for the entered city from the openweathermap API
  searchWeather: function () {
    var cityElem = document.getElementById("txtCity");
    this.city = cityElem.value;

    var queryURL = queryBaseURL + "&q=" + this.city;
    fetch(queryURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        weatherDashboard.displayWeather(data);
        console.log(data);
      });
  },

  // Load search history from the local storage
  loadSearchHistory: function () {
    var searchHistoryKey = "search-list";
    this.searchHistoryList = JSON.parse(localStorage.getItem(searchHistoryKey));
    if (this.searchHistoryList == null) this.searchHistoryList = [];
    console.log(this.searchHistoryList);
  },

  // Save search history to the local storage
  addToSearchHistory: function (cityName) {
    var searchHistoryKey = "search-list";
    //TODO: check if the city already exist
    //Add item as first item in the array to keep the recent search on top
    this.searchHistoryList.unshift(cityName);
    localStorage.setItem(searchHistoryKey, JSON.stringify(this.searchHistoryList));
    this.displaySearchHistory();
  },

  // Clear search history from the local storage
  clearSearchHistory: function () {
    var searchHistoryKey = "search-list";
    this.searchHistoryList = [];
    localStorage.setItem(searchHistoryKey, JSON.stringify(this.searchHistoryList));
    this.displaySearchHistory();
  },

  // Display search history in the left panel
  displaySearchHistory: function () {
    var searchHistoryElem = document.getElementById("search-history");
    removeAllChildElements(searchHistoryElem);

    // Loop through Search history array and add buttons for each city 
    // in the search history section 
    for (var i = 0; i < this.searchHistoryList.length; i++) {
      var historyElem = document.createElement("button");
      var cityName = this.searchHistoryList[i];
      historyElem.innerHTML = cityName;
      historyElem.setAttribute("data-city", cityName);
      historyElem.className = "search-history-item"
      historyElem.addEventListener("click", this.onSearchItemClick);
      searchHistoryElem.appendChild(historyElem);
    }
  },

  // Search history item click
  onSearchItemClick: function (event) {
    var searchItemElem = event.target;
    var cityName = searchItemElem.getAttribute("data-city");
    var cityElem = document.getElementById("txtCity");
    cityElem.value = cityName; 
    weatherDashboard.searchWeather();
  }

};

// Function to initialize the page
function init() {

  // Attach event listener to the search button
  var btnSearch = document.getElementById("btnSearch");
  btnSearch.addEventListener("click", function () {
    weatherDashboard.searchWeather();
    weatherDashboard.addToSearchHistory(weatherDashboard.city);
  });

  // Clear Search History
  //weatherDashboard.clearSearchHistory();

  // Load Search History
  weatherDashboard.loadSearchHistory();

  // Show the search history when the page loads
  weatherDashboard.displaySearchHistory();

}

init();