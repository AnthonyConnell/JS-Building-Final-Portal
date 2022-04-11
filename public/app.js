//Get user location
async function userCoords() {
  const pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  return pos;
}

var myMap;
var lat;
var long;
var query;
var myIcon = L.icon({
    iconUrl: ".assets/red-pin.png",
    iconSize: [30, 30],
  });

// Initialize map
window.onload = async () => {
  const coords = await userCoords();
  myMap = await L.map("map").setView(
    [coords.coords.latitude, coords.coords.longitude],
    5
  );
  lat = coords.coords.latitude;
  long = coords.coords.longitude;
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: "15",
  }).addTo(myMap);

  const home = L.marker([coords.coords.latitude, coords.coords.longitude])
    .bindPopup(`<b>You are here</b><br>Latitude: ${lat}<br>Longitude: ${long}`)
    .openPopup()
    .addTo(myMap)
};

// FourSquare API
async function findShops(query, myIcon) {
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: 'fsq3yoPPDEKRn2XVMvPBtN9dfa+blK7+k/ZDgR+oArUKllo=',
    },
  };
  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?query=${query}&ll=${lat}%2C${long}&limit=5`,
    options
  );
  const data = await response.text();
  let parseData = JSON.parse(data);
  let businesses = parseData.results;
  console.log(businesses);
  businesses.forEach((business) => {
    let marker = L.marker([
      business.geocodes.main.latitude,
      business.geocodes.main.longitude,
    ], {icon: myIcon});
    marker
      .addTo(myMap)
      .bindPopup(`<b>${business.name}</b><br>${business.location.address}`)
      .openPopup();
  });
}

//Bonus UI
 function places() {
  let place = document.querySelector("#business");
  if (place.value === "coffee") {
    var myIcon = L.icon({
      iconUrl: "assets/red-pin.png",
      iconSize: [30, 30],
    });
    findShops("coffee", myIcon);
  } else if (place.value === "restaurant") {
    var myIcon = L.icon({
      iconUrl: "assets/red-pin.png",
      iconSize: [30, 30],
    });
    findShops("restaurant", myIcon);
  } else if (place.value === "hotel") {
    var myIcon = L.icon({
      iconUrl: "assets/red-pin.png",
      iconSize: [30, 30],
    });
    findShops("hotel", myIcon);
  } else if (place.value === "market") {
    var myIcon = L.icon({
      iconUrl: "assets/red-pin.png",
      iconSize: [30, 30],
    });
    findShops("grocery", myIcon);
  }
}