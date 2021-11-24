// kaardi kuvamine setViews on kolm parameetrit latitude, longitude ja siis zoom
const map = L.map("map").setView([58.74784438655941, 25.765440580418264], 8);
// osm muutuja ehk open street map
// rohkem kaardi layereid titlelayer provideris
const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});
//osm.addTo(map);
// teistsuguse kaardi kihi katsetus . addTo(map) kirjutab eelmise üle
const OpenTopoMap = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 17,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }
);
//OpenTopoMap.addTo(map);

// google mapsi katsetus
//Street
const googleStreets = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

googleStreets.addTo(map);

// Satellite
googleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
  maxZoom: 20,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
});

//googleSat.addTo(map);

//Terrain
googleTerrain = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
// googleTerrain.addTo(map);
let resetbtn = document.getElementById("reset");
// MARKERI LISAMINE jms

// minu elukohad lisatud functioni siin sees  kasutan ka layerGroup  funktsiooni mis võimaldab markereid korraga eemalda kaardi kihis
const myHomes = function () {
  let latLngList = [];
  let descriptionList = [];
  if (inputlng.value && inputlat.value) {
    latLngList.push([inputlat.value, inputlng.value]);
    descriptionList.push(inputdes.value);
  }
  // custom ikooni lisamine markerile vastvalt elukoha tüübile ja markeri enda lisamine

  const farmIcon = L.icon({
    iconUrl: "img/barn.png",
    iconSize: [40, 40],
  });

  const apartmentIcon = L.icon({
    iconUrl: "img/apartment.png",
    iconSize: [40, 40],
  });

  const houseIcon = L.icon({
    iconUrl: "img/house.png",
    iconSize: [40, 40],
  });
  // valib ikooni vastavalt kas on maja,talu või korter
  const myIcon = function (descriptionList) {
    if (descriptionList.toLowerCase().includes("talu" || "talus")) {
      return farmIcon;
    }
    if (descriptionList.toLowerCase().includes("korter" || "korteris")) {
      return apartmentIcon;
    }
    if (descriptionList.toLowerCase().includes("maja" || "majas")) {
      return houseIcon;
    }
  };
  // valib pildi vastavalt kas maja,talu või korter
  const mypicture = function (descriptionList) {
    if (descriptionList.toLowerCase().includes("talu")) {
      let taluid = parseInt(document.getElementById("talu").textContent);
      document.getElementById("talu").textContent = taluid + 1;
      return `<img class="marker" src='img/farm.jpg'>`;
    }
    if (descriptionList.toLowerCase().includes("korter")) {
      let korterid = parseInt(document.getElementById("korter").textContent);
      document.getElementById("korter").textContent = korterid + 1;
      return `<img class="marker" src='img/apartment.jpg'>`;
    }
    if (descriptionList.toLowerCase().includes("maja")) {
      let majaid = parseInt(document.getElementById("maja").textContent);
      document.getElementById("maja").textContent = majaid + 1;
      return `<img class="marker" src='img/house.jpg'>`;
    }
  };
  // siis grupeerib markerid ja muud funkstionaalsust
  let layerGroup = L.layerGroup().addTo(map);
  for (let i = 0; i < latLngList.length; i++) {
    const singelMarker = L.marker(latLngList[i], {
      icon: myIcon(descriptionList[i]),
      draggable: false,
    });
    const pictures = mypicture(descriptionList[i]);
    console.log(pictures);
    const popup = singelMarker
      .bindPopup(`${pictures}${descriptionList[i]}`)
      .openPopup();
    layerGroup.addLayer(popup);
  }
  return layerGroup;
};

function getInputValues() {
  let temp = [];
  temp.push(inputlat.value, inputlng.value, inputdes.value);
  console.log(temp);
  return temp;
}

map.on("click", getLatLongClick);

function getLatLongClick(e) {
  let lat = e.latlng.lat;
  let lng = e.latlng.lng;
  let newMarker = L.marker([lat, lng], { draggable: true }).addTo(map);
  inputlat.value = lat;
  inputlng.value = lng;
  newMarker.on("dragend", function (e) {
    lat = newMarker.getLatLng().lat;
    lng = newMarker.getLatLng().lng;
    inputlat.value = lat;
    inputlng.value = lng;
  });
}

// Layer Controller
const lGroup = L.layerGroup(myHomes);
const baseMaps = {
  "Google Street": googleStreets,
  "Google Satellite": googleSat,
  "Google Terrain": googleTerrain,
};

const overlayMaps = {
  Elukohad: myHomes(),
};
console.log(overlayMaps.Elukohad);
//sellega lisame layer controlleri kaardile mõlemad parameetrid on valikulised, esimese asemele võib lihtsal null panna
L.control.layers(baseMaps, overlayMaps).addTo(map);
// näitab kaardi skaalat aint km ainult
L.control.scale({ imperial: false }).addTo(map);

let joonis;
function joonisekiht() {
  joonis = new Chart(document.getElementById("joonis"), {
    type: "bar",
    data: {
      labels: ["Korter", "Maja", "Talu"],
      datasets: [
        {
          label: "Elukohad",
          data: [0, 0, 0],
          backgroundColor: "blue",
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            barPercentage: 0.3,
          },
        ],
      },
    },
  });
  let korter = document.getElementById("korter").textContent;
  let maja = document.getElementById("maja").textContent;
  let talu = document.getElementById("talu").textContent;
  joonis.data.datasets[0].data[0] = parseInt(korter);
  joonis.data.datasets[0].data[1] = parseInt(maja);
  joonis.data.datasets[0].data[2] = parseInt(talu);
  joonis.update();
}
document.body.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    myHomes();
  }
});
function youAre() {
  let korter = parseInt(document.getElementById("korter").textContent);
  let maja = parseInt(document.getElementById("maja").textContent);
  let talu = parseInt(document.getElementById("talu").textContent);
  let vastus = document.getElementById("vastus");
  let lause = "";
  let ifrm = document.getElementById("iframe");
  document.getElementById("vastus1").textContent = "Graafik";
  document.getElementById("alumineosa").style.visibility = "visible";
  document.querySelector(".nupud").remove();
  document.querySelector(".nupu").remove();
  ifrm.style.width = "480px";
  ifrm.style.height = "360px";
  resetbtn.style.visibility = "visible";
  console.log(korter, maja, talu);
  if (korter + maja + talu > 5) {
    lause = "...Elad vist seal kus jope ripub...";
  }
  if (korter > maja || korter > talu) {
    vastus.textContent = `${lause}oled elanud ${korter}. korteris. Kuula lugu:`;
    ifrm.setAttribute("src", "https://www.youtube.com/embed/nzqNngS8Jb8");
  }
  if (maja > korter || maja > talu) {
    vastus.textContent = `${lause}oled elanud ${maja}. majas. Kuula lugu:`;
    ifrm.setAttribute("src", "https://www.youtube.com/embed/Q90-SvayYzw");
  }
  if (talu > korter || talu > maja) {
    vastus.textContent = `${lause}oled elanud ${talu}. talus. Kuula lugu:`;
    ifrm.setAttribute("src", "https://www.youtube.com/embed/e4Ao-iNPPUc");
  }
  if (talu === korter && talu === maja) {
    vastus.textContent = `${lause}...siin ja seal. Kuula seda:`;
    ifrm.setAttribute("src", "https://www.youtube.com/embed/pB5_e2lSliE");
  }
}
// refresh page
function resetPage() {
  document.getElementById("talu").textContent = 0;
  document.getElementById("korter").textContent = 0;
  document.getElementById("maja").textContent = 0;
  history.scrollRestoration = "manual";
  location.reload();
  window.scrollTo(0, 0);
}

// Leaflet search
