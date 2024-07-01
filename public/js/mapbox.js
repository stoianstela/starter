/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log('locations');


  mapboxgl.accessToken = 'pk.eyJ1Ijoic3RvaWFuc3RlbGExOCIsImEiOiJjbHhsdDh3NHkwMXNzMmxzajMxMXZtcjJoIn0.-AgbVZjpury-4pBlfb-B6w';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/stoianstela18/clxltirza00gq01qweu181sbg',
    scrollZoom: false
    //center: [2.3522219, 48.856614],
    //zoom: 10,
    //interactive:false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
   
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    }).setLngLat(loc.coordinates).addTo(map);

    new mapboxgl.Popup({offset: 30}).setLngLat(loc.coordinates).setHTML(`<p> Day ${loc.day}: ${loc.description}</p>`).addTo(map);

    bounds.extend(loc.coordinates);
    });

    
 

  map.fitBounds(bounds, {
    padding: {
        top:200,
        bottom:150,
        left:100,
        right:100
    }
  });
