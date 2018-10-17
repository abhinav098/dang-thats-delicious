import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center : {lat:19.109, lng:72.884},
  zoom: 15
}
function loadPlaces(map, lat = 19.109, lng= 72.884){
  axios.get(`/api/v1/stores/near?lat=${lat}&lng=${lng}`).then(res=>{
    const places = res.data;
    if(!places){
      alert('No Places Found');
      return;
    }

    // create bounds
    const bounds = new google.maps.LatLngBounds();
    const infoWindow = new google.maps.InfoWindow();

    const markers = places.map(place => {
      const [placeLng, placeLat] = place.location.coordinates;
      const position = {lat: placeLat, lng: placeLng}
      bounds.extend(position);
      const marker = new google.maps.Marker({map, position});
      marker.place = place;
      return marker;
    });

    markers.forEach(marker => marker.addListener('click', function(){
      const html =`<div class = "popup">
              <a href="/store/${this.place.slug}">
                <img src = "/uploads/${this.place.photo || 'store.png'}" alt="${this.place.name}" />
                <p>${this.place.name} - ${this.place.location.address}</p>
              </a>
             </div>`;
      infoWindow.setContent(html);
      infoWindow.open(map, this);
    }));
    // zoom map to fit markers perfectly
    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
  });
};

function makeMap(mapDiv){
  if (!mapDiv) return;
  //make map
  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);

  const input = $("[name='geolocate']");
  const autoComplete = new google.maps.places.Autocomplete(input);

  autoComplete.addListener('place_changed', () => {
    const place = autoComplete.getPlace();
    loadPlaces(map, place.geometry.location.lat(), place.geometry.location.lng());
  })
};

export default makeMap;
