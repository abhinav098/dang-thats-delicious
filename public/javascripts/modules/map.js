import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center : {lat:43.2, lng:-79.8},
  zoom: 10
}

function loadPlaces(map, lat = 43.2, lng= -79.8){
  axios.get(`/api/v1/stores/near?lat=${lat}&lng=${lng}`).then(res=>{
    debugger
    const places = res.data;
    if(!places){
      alert('No Places Found');
      return;
    }
    const markers = places.map(place => {
      const [placeLng, placeLat] = place.location.coordinates;
      debugger
      const position = {lat: placeLat, lng: placeLng}
      debugger
      const marker = new google.maps.Marker({map, position});
      marker.place = place;
      return marker;
    });
  });
};

function makeMap(mapDiv){
  if (!mapDiv) return;
  //make map
  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);

  const input = $("[name='geolocate']");
  const autoComplete = new google.maps.places.Autocomplete(input);
};

export default makeMap;
