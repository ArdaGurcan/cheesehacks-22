import {Feature, Map, Overlay, View} from 'ol';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Point} from 'ol/geom';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {fromLonLat} from 'ol/proj';
import Geolocation from 'ol/Geolocation';

const view = new View({
  center: [0, 0],
  zoom: 15,
})

let vectorsource = new VectorSource();

const map = new Map({
  target: 'map',
  view: view,
  layers: [
    new TileLayer({
      source: new OSM(),
    })
  ],
});

const proj = view.getProjection();

// returns a VectorSource with all the friends on it
function drawFriends(friends) {
  const vectorsource = new VectorSource();
  for (let f in friends) {
    const lat = friends[f]["latitude"];
    const long = friends[f]["longitude"];
    vectorsource.addFeature(new Feature(new Point(fromLonLat([lat, long], proj))));
  }
  return vectorsource;
}

const friends = [{name: "Arda", longitude: 33, latitude: -13}, {name: "Kyle", longitude: 41, latitude: 2}, 
{name: "Chris", longitude: -15, latitude: 80}]
drawFriends(friends);
vectorsource = drawFriends(friends);

self = new Feature(new Point([0, 0]));
vectorsource.addFeature(self);

map.addLayer(new VectorLayer({
  source: vectorsource,
  style: {
    'circle-radius': 9,
    'circle-fill-color': 'red',
  }
}))

const geolocation = new Geolocation({
  tracking: true,
  trackingOptions: {
    enableHighAccuracy: true,
  },
  projection: view.getProjection(),
});

geolocation.on('error', function (error) {
  console.log("there's a problem here");
});

console.log(geolocation.getPosition());

geolocation.on('change:position', function () {
  const coordinates = geolocation.getPosition();
  self.setGeometry(coordinates ? new Point(coordinates) : null);
  view.setCenter(coordinates);
});

function getLocation() {
  return geolocation.getPosition();
}