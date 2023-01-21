import {geoJSONProject, coordProject} from './index.js'


const geoJSON = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [155000,463000] // Amersfoort
        },
        "properties": {id: 1}
      }
    ]
};
const projectedGeoJSON = geoJSONProject(geoJSON, 'EPSG:28992', 'EPSG:4326');
console.log(JSON.stringify(projectedGeoJSON, null, 2));

const crsGeoJSON = {
    "type": "FeatureCollection",
    "crs": {
        "type": "name",
        "properties":{
            "name": "urn:ogc:def:crs:EPSG::28992"
        },
    },
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [155000, 463000] // Amersfoort
        },
        "properties": {
            id: 1
        }
    }]
}
const projectedCrsGeoJSON = geoJSONProject(crsGeoJSON);
console.log(JSON.stringify(projectedCrsGeoJSON, null, 2));

const coordinate = [5.387203508863084, 52.15517229965292];
const projectedCoordinate = coordProject(coordinate, 'EPSG:4326', 'EPSG:28992');
console.log(projectedCoordinate);