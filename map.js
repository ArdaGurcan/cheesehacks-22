import { Feature, Map, Overlay, View } from "ol";
import { OSM, Vector as VectorSource } from "ol/source";
import { Point } from "ol/geom";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { addEquivalentTransforms, fromLonLat, toLonLat } from "ol/proj";
import Geolocation from "ol/Geolocation";
import Text from "ol/style/Text";
import { Icon, Fill, Style } from "ol/style";
import { createOrUpdateFromCoordinates } from "ol/extent";

import getFriendCoordinates from "/firebase.js";
// import { getDepOptimizationConfig } from "vite";
// import updateCoordinates from "/firebase.js";

let map;

window.ready = () => {
    setTimeout(() => {
        let view = new View({
            center: [-89, 43],
            zoom: 20,
        });

        let vectorsource = new VectorSource();
        if(!map)
        map = new Map({
            target: "map",
            view: view,
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
        });

        const proj = view.getProjection();

        async function styleFriend(name) {
          let style = null;
          await getPfp(name).then((img) => {
            console.log(img);
            style = new Style({
                image: new Icon({
                  src: img
                }),
                text: new Text({
                    text: name,
                    offsetY: 15,
                }),
            })
          })
          return style;
        };

        // returns a VectorSource with all the friends on it
        function drawFriends(friends) {
            // let vectorsource = new VectorSource();
            for (let f in friends) {
                let feature = new Feature(
                    new Point(
                        fromLonLat(
                            [friends[f]["latitude"], friends[f]["longitude"]],
                            proj
                        )
                    )
                );
                styleFriend(friends[f]["name"]).then((style) => {
                  feature.setStyle(style);
                })
                vectorsource.addFeature(feature);

            }
            console.log(vectorsource.getFeatures());
            //return vectorsource;
        }

        getFriendCoordinates(user1).then((array) => {
          console.log(user1);
          drawFriends(array);
        });

        self = new Feature(new Point([0, 0]));
        vectorsource.addFeature(self);

        map.addLayer(
            new VectorLayer({
                source: vectorsource,
            })
        );

        map.on('click', function (evt) {
          if (map.hasFeatureAtPixel) {
            console.log(map.getFeaturesAtPixel(evt.pixel))
            var feature = map.getFeaturesAtPixel(evt.pixel)[0];
            switchTo5(feature.getStyle().getText().getText());
          }
        });

        const geolocation = new Geolocation({
            tracking: true,
            trackingOptions: {
                enableHighAccuracy: true,
            },
            projection: view.getProjection(),
        });

        geolocation.on("error", function (error) {
            console.log("there's a problem here");
        });

        function getLocation() {
            return toLonLat(geolocation.getPosition());
        }

        function redrawMap() {
          for (let f in vectorsource.getFeatures()) {

          }
        }

        geolocation.on("change:position", function () {
            const coordinates = geolocation.getPosition();
            self.setGeometry(coordinates ? new Point(coordinates) : null);
            view.setCenter(coordinates);
            const lonlat = toLonLat(coordinates);
            console.log(lonlat)
            updateCoordinates(user1, lonlat[0], lonlat[1]);
        });
    }, 1);
}
// $(document).ready(() => {ready()});
