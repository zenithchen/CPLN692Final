/* =====================
  Global Variables
===================== */
var data;  // for holding data
var censusData;
var marker;
var parcel_geo;
var nearby_data;
var nearby_marker_lst=[];
var addr;

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

/* =====================
  Functions
===================== */
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

function onClick2(e) {
  // L.DomEvent.stopPropagation(e);
  // alert(this.getLatLng());
  alert("click function!")
}


/* =====================
  Parse and store data for later use
===================== */

//  var parcelURL = "https://raw.githubusercontent.com/zenithchen/CPLN692Final/main/Data/fixedResponse0427.json"
var parcelURL = "https://raw.githubusercontent.com/zenithchen/CPLN692Final/main/Data/response_0505.json"
var censusURL = "https://raw.githubusercontent.com/zenithchen/CPLN692Final/main/Data/Census_Tracts_2010.geojson"
var nearbyparcelURL = "https://raw.githubusercontent.com/zenithchen/CPLN692Final/main/Data/response05052.json"

$(document).ready(function() {

  $.when($.ajax(censusURL),$.ajax(parcelURL)).then(function(censusRes, parcelRes){
    censusData = JSON.parse(censusRes[0]);
    data = JSON.parse(parcelRes[0]);
    // nearby_data = 
    parcel_geo = data.parcel_geometry[0].geometry;
    // console.log(parcel_geo)
   
    var lat = parseFloat(data.parcel_df[0].Parcel_centroid_lat);
    var lng = parseFloat(data.parcel_df[0].Parcel_centroid_lng);
    addr = data.parcel_df[0].Input.replaceAll('%20', ' ')
    // console.log(data.parcel_geometry[0].geometry.coordinates[0])

    L.geoJson(censusData).addTo(map)
    marker = L.marker([lat, lng],{icon: redIcon}).bindPopup(addr).on('click', onClick2);
    // marker.on('click', onClick);
    // console.log(marker)
    
    //console.log(data.nearby_parcel_df[0].LAT)
    data.nearby_parcel_df.forEach((item) =>{
      var myMarker = L.marker([item.LAT, item.LNG],{icon: blueIcon}).bindPopup(item.ADDR_SOURCE).on('click', onClick2);
      nearby_marker_lst.push(myMarker);
      })
    //console.log(nearby_marker_lst)

    //L.marker([lat, lng]).bindPopup(add).addTo(map);
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
      
      var poly = L.geoJson(parcel_geo,{
        // style: {color: 'red'}
      })
      poly.addTo(map);
      console.log(poly)

      // L.geoJson(parcel_geo,{
      //   // style: {color: 'red'}
      // }).addTo(map).on('click', onClick);
      plotMarkers(nearby_marker_lst);
      marker.addTo(map).openPopup();
      
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

