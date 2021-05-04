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

var city_data = PHTract;

/* =====================
  Parse and store data for later use
===================== */

var parcelURL = "https://raw.githubusercontent.com/zenithchen/CPLN692Final/main/Data/fixedResponse0427.json"
var censusURL = "https://raw.githubusercontent.com/zenithchen/CPLN692Final/main/Data/Census_Tracts_2010.geojson"

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

  $('#search-btn').click(function() {
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
      var vio_code = data.properties_df[0].vio_title;
      var year_built = data.properties_df[0].year_built;
      var total_area = data.properties_df[0].total_area;
      var story = data.properties_df[0].number_stories;

      $('#tb-zoning').text(zoning);
      $('#tb-cat').text(category);
      $('#tb-vio').text(vio_code);
      $('#tb-year').text(year_built);
      $('#tb-area').text(total_area);
      $('#tb-story').text(story);
      // $('#exampleModal2').modal('show');
    }
    else{
      alert("NONE FOUND")
    }    
  });
})

//////////////////////

// var resetMap = function(){
//   map.setView(PHcenter, 12);
//   $('#button-resetMap').hide();
// }

// $('#button-resetMap').click(resetMap);

// var_display = "PREDICTED.CNT"
// loadSlide()

// document.getElementById("selectVar").onchange = function () {
//   var_display = document.getElementById("selectVar").value;
//   selected = {}
//   console.log(var_display);
//         removeTracts();
//         loadSlide();
//         resetApplication();
// }

