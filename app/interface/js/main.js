/* =====================
  Global Variables
===================== */
var parceldata;  // for holding data
var censusData;
var marker;
var parcel_geo;
var parcel_layer;
var nearby_data;
var nearby_marker_lst=[];
var addr;

var zoning;
var category;
var vio_code;
var year_built;
var total_area;
var story;
var room;
var frontage;

var redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
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

var removeGeometry = function() {
  if (marker != undefined) {
    map.removeLayer(marker);
    removeMarkers(nearby_marker_lst);
  };
  if(parcel_geo != undefined) {
    map.removeLayer(parcel_layer);
  }
};

var plotMarkers = function(lst) {
  lst.forEach((item) =>{
      item.addTo(map);
  })
};

function updateChart(barchart, newdata){
  barchart.data.datasets[0].data[0] = newdata
  barchart.update()
}

function setMarkers(dataArr){
  removeGeometry();
  // removeMarkers(nearby_marker_lst);
  nearby_marker_lst=[];
  parcel_geo = dataArr.parcel_geometry[0].geometry;
  var lat = parseFloat(dataArr.parcel_df[0].Parcel_centroid_lat);
  var lng = parseFloat(dataArr.parcel_df[0].Parcel_centroid_lng);
  addr = dataArr.parcel_df[0].Input.replaceAll('%20', ' ')
  marker = L.marker([lat, lng],{icon: redIcon}).bindPopup(addr);

  dataArr.nearby_parcel_df.forEach((item) =>{
    var myMarker = L.marker([item.LAT, item.LNG],{icon: blueIcon}).bindPopup(item.ADDR_SOURCE).on('click', onClick);
    nearby_marker_lst.push(myMarker);
    })
}

//Cards: 311 Request
var new311 = function(entry){
  if(entry.length>1){
   return (`${entry[0]}<br/>${entry[1]}<br/>...`)
  }else if(entry.length==1){
   return(`${entry[0]}<br/>...`)
   }else{
    return(`none`)}
   }

function update311(dataArr){
  var count311= dataArr.length
  var names311=[]
  for(let i=0;i<count311;i++){
    name311 = dataArr[i].service_name
    names311.push(name311)
  }
  $('#311count').html(count311)
  $('#311name').html(new311(names311))
}

//Cards: Nearby Parcel
var newparcel = function(entry){
  if(entry.length>1){
   return (`${entry[0]}<br/>${entry[1]}<br/>...`)
  }else if(entry.length==1){
   return(`${entry[0]}<br/>...`)
   }else{
    return(`none`)}
   }

var updateparcel= function(dataArr){
  var countparcel= dataArr.length
  var namesparcel=[]
  for(let i=0;i<countparcel;i++){
    nameparcel = dataArr[i].ADDR_SOURCE
    namesparcel.push(nameparcel)
  }
  console.log(namesparcel)
  $('#parcelcount').html(countparcel)
  $('#parcelname').html(newparcel(namesparcel))
}


function plotElements(){
  var markerBounds = L.latLngBounds([marker.getLatLng()]);
  map.fitBounds(markerBounds);

  //add parcel geometry
  // var poly = L.geoJson(parcel_geo)
  // poly.addTo(map);
  parcel_layer = L.geoJson(parcel_geo,{
    style: {color: "orange", weight: 3}
  }).addTo(map);

  //add markers
  plotMarkers(nearby_marker_lst);
  marker.addTo(map).openPopup();
}

function getInfo(dataArr){
  zoning = dataArr.properties_df[0].zoning;
  category = dataArr.properties_df[0].category;
  vio_code = dataArr.properties_df[0].vio_title;
  year_built = dataArr.properties_df[0].year_built;
  total_area = dataArr.properties_df[0].total_area;
  story = dataArr.properties_df[0].number_stories;
  room = dataArr.properties_df[0].number_of_rooms;
  frontage = dataArr.properties_df[0].frontage;
  request = dataArr.request311_within100m
  nearby = dataArr.nearby_parcel_df
}

/*click nearby marker function*/ 
function onClick(e) {
  // alert("click function!")
  $.ajax(nearbyparcelURL).done(function(nearbyRes) {
    nearby_data = JSON.parse(nearbyRes);
    // console.log(nearby_data);
    setMarkers(nearby_data);
    plotElements();
    getInfo(nearby_data);
    updateChart(area_Chart, total_area);
    updateChart(frontage_Chart, frontage);
    updateChart(room_Chart, room);
    update311(request)
    updateparcel(nearby)
  });
}



/* =====================
  Parse and store data for later use
===================== */

//  var parcelURL = "https://raw.githubusercontent.com/zenithchen/CPLN692Final/main/Data/fixedResponse0427.json"
var parcelURL = "https://raw.githubusercontent.com/zenithchen/CPLN692Final/main/Data/response0507.json"
var censusURL = "https://raw.githubusercontent.com/zenithchen/CPLN692Final/main/Data/Census_Tracts_2010.geojson"
var nearbyparcelURL = "https://raw.githubusercontent.com/zenithchen/CPLN692Final/main/Data/response05052.json"

$(document).ready(function() {

  $.when($.ajax(censusURL),$.ajax(parcelURL)).then(function(censusRes, parcelRes){
    censusData = JSON.parse(censusRes[0]);
    parceldata = JSON.parse(parcelRes[0]);

    // L.geoJson(censusData).addTo(map);
   
    // parcel_geo = parceldata.parcel_geometry[0].geometry;
   
    // var lat = parseFloat(parceldata.parcel_df[0].Parcel_centroid_lat);
    // var lng = parseFloat(parceldata.parcel_df[0].Parcel_centroid_lng);
    // addr = parceldata.parcel_df[0].Input.replaceAll('%20', ' ')

    // L.geoJson(censusData).addTo(map)
    // marker = L.marker([lat, lng],{icon: redIcon}).bindPopup(addr);
    
    // parceldata.nearby_parcel_df.forEach((item) =>{
    //   var myMarker = L.marker([item.LAT, item.LNG],{icon: blueIcon}).bindPopup(item.ADDR_SOURCE).on('click', onClick);
    //   nearby_marker_lst.push(myMarker);
    //   })

  })

  $('#btnGroupAddon').click(function() {
    setMarkers(parceldata);
    ///add markers
    // if (marker != undefined) {
    //   removeGeometry();
    // };
    // removeMarkers(nearby_marker_lst);

    var inputAddr = $('.form-control').val();

    if(inputAddr===addr){
      // var markerBounds = L.latLngBounds([marker.getLatLng()]);
      // map.fitBounds(markerBounds);
      
      // var poly = L.geoJson(parcel_geo,{
      // })
      // poly.addTo(map);

      // plotMarkers(nearby_marker_lst);
      // marker.addTo(map).openPopup();

      plotElements();

      // var zoning = parceldata.properties_df[0].zoning;
      // var category = parceldata.properties_df[0].category;
      // var vio_code = parceldata.properties_df[0].vio_title;
      // var year_built = parceldata.properties_df[0].year_built;
      // var total_area = parceldata.properties_df[0].total_area;
      // var story = parceldata.properties_df[0].number_stories;
      // var room = parceldata.properties_df[0].number_of_rooms;
      // var frontage = parceldata.properties_df[0].frontage;
      getInfo(parceldata);

      updateChart(area_Chart, total_area);
      updateChart(frontage_Chart, frontage);
      updateChart(room_Chart, room);
      update311(request)
      updateparcel(nearby)
      // $('#tb-zoning').text(zoning);
      // $('#tb-cat').text(category);
      // $('#tb-vio').text(vio_code);
      // $('#tb-year').text(year_built);
      // $('#tb-area').text(total_area);
      // $('#tb-story').text(story);
      
    }
    else{
      alert("NONE FOUND")
    }    
  });

})
