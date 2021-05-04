/* =====================
  Global Variables
===================== */
var data;  // for holding data
var censusData;
var stringFilter = "";
var selectValue = 'All';
var marker;
var nearby_marker_lst=[];
var addr;

/* =====================
  Map Setup
===================== */
// Notice that we've been using an options object since week 1 without realizing it
var mapOpts = {
  center: [39.95245109215676, -75.16390800476074],
  zoom: 11
};
var map = L.map('map', mapOpts);

// Another options object
var tileOpts = {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
};
var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', tileOpts).addTo(map);

// Ajax to grab json
//var getData = $.ajax('https://raw.githubusercontent.com/zenithchen/CPLN692Final/main/Data/fixedResponse0427.json')
var parcelURL = "https://raw.githubusercontent.com/zenithchen/CPLN692Final/main/Data/fixedResponse0427.json"
var censusURL = "https://raw.githubusercontent.com/zenithchen/CPLN692Final/main/Data/Census_Tracts_2010.geojson"
/* =====================
  Parse and store data for later use
===================== */
$(document).ready(function() {

  var removeMarkers = function(lst) {
    lst.forEach((item) =>{
        map.removeLayer(item);
        })
  };

  var plotMarkers = function(lst) {
    lst.forEach((item) =>{
        item.addTo(map);
    })
  };

  var redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  var blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
   // shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [15, 28],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
   // shadowSize: [15, 28]
  });

  $.when($.ajax(censusURL),$.ajax(parcelURL)).then(function(censusRes, parcelRes){
    censusData = JSON.parse(censusRes[0]);
    data = JSON.parse(parcelRes[0]);
   
    var lat = parseFloat(data.parcel_df[0].Parcel_centroid_lat);
    var lng = parseFloat(data.parcel_df[0].Parcel_centroid_lng);
    addr = data.parcel_df[0].Address.replaceAll('%20', ' ')
    //console.log(lat,lng)

    L.geoJson(censusData).addTo(map)
    marker=L.marker([lat, lng],{icon: redIcon}).bindPopup(addr);
    
    //console.log(data.nearby_parcel_df[0].LAT)
    data.nearby_parcel_df.forEach((item) =>{
      var myMarker = L.marker([item.LAT, item.LNG],{icon: blueIcon}).bindPopup(item.ADDR_SOURCE);
      nearby_marker_lst.push(myMarker);
      })
    //console.log(nearby_marker_lst)

    //L.marker([lat, lng]).bindPopup(add).addTo(map);
  
    // L.geoJSON(data, {
    //   pointToLayer: function (feature, latlng) {
    //     console.log(feature, latlng)
    //       //return L.marker([lat, lng]).bindPopup(datum[0].Address);
    //   }
    // }).addTo(map);
  })

  $('button').click(function() {
    if (marker != undefined) {
      map.removeLayer(marker);
    };
    removeMarkers(nearby_marker_lst);

    var inputAddr = $('#input-addr').val();

    if(inputAddr===addr){
      var markerBounds = L.latLngBounds([marker.getLatLng()]);
      map.fitBounds(markerBounds);
      //map.setView(marker.getLatLng(),12);
      plotMarkers(nearby_marker_lst);
      marker.addTo(map);
      
      var zoning = data.properties_df[0].zoning;
      var category = data.properties_df[0].category;
      var year_built = data.properties_df[0].year_built;
      var total_area = data.properties_df[0].total_area;
      var story = data.properties_df[0].number_stories;

      $('#parcel-info').text("Zoning: "+zoning);
      // $('#exampleModal2').modal('show');
    }
    else{
      alert("NONE FOUND")
    }    
  });
})

