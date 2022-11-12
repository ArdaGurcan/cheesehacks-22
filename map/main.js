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

const feature = new Feature(new Point([0, 0]));

const map = new Map({
  target: 'map',
  view: view,
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    new VectorLayer({
      source: new VectorSource({
        features: [feature],
      }),
      style: {
        'circle-radius': 9,
        'circle-fill-color': 'red',
      },
    }),
  ],
});

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
  feature.setGeometry(coordinates ? new Point(coordinates) : null);
  view.setCenter(coordinates);
});

function getLocation() {
  return geolocation.getPosition();
}