var mapOpts = {
  center: [39.95245109215676, -75.16390800476074],
  zoom: 11
};
var map = L.map('map', mapOpts);

var mapbox_base = L.tileLayer('https://api.mapbox.com/styles/v1/opheliaaa/ck9ylje8o0x5z1ipfpgpbji5p/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3BoZWxpYWFhIiwiYSI6ImNrOHVsaWs3NDBjOTUzbXBheW9zY2wybmMifQ.J8OQVcuUxnoTI9gvkisyeQ', {
//  attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
//  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
//  ext: 'png'
}).addTo(map);

var featureGroup;
