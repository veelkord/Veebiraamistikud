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

// MARKERI LISAMINE jms

// minu elukohad lisatud functioni siin sees  kasutan ka layerGroup  funktsiooni mis võimaldab markereid korraga eemalda kaardi kihis
const myHomes = function () {
  const latLngList = [
    [59.09996923629361, 25.35526055039404],
    [58.15364, 25.97829],
    [58.38285347157279, 26.7280133381709],
    [59.43679615990592, 24.77309785413316],
    [59.545333, 24.803511],
  ];
  const descriptionList = [
    "Ardu korter 1990 - 1993",
    "Augupera talu 1993 - 2009",
    "Tartu korter 2009",
    "Vase korter 2010",
    "Aasa tee maja 2014-2019",
  ];

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
    if (descriptionList.toLowerCase().includes("talu")) {
      return farmIcon;
    }
    if (descriptionList.toLowerCase().includes("korter")) {
      return apartmentIcon;
    }
    if (descriptionList.toLowerCase().includes("maja")) {
      return houseIcon;
    }
  };
  // valib pildi vastavalt kas maja,talu või korter
  const mypicture = function (descriptionList) {
    if (descriptionList.toLowerCase().includes("talu")) {
      return `<img class="marker" src='img/farm.jpg'>`;
    }
    if (descriptionList.toLowerCase().includes("korter")) {
      return `<img class="marker" src='img/apartment.jpg'>`;
    }
    if (descriptionList.toLowerCase().includes("maja")) {
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

//sellega lisame layer controlleri kaardile mõlemad parameetrid on valikulised, esimese asemele võib lihtsal null panna
L.control.layers(baseMaps, overlayMaps).addTo(map);
// näitab kaardi skaalat aint km ainult
L.control.scale({ imperial: false }).addTo(map);
