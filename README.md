# ProjConvert
The now obsolete GeoJSON 2008 specification has a "crs" member to define a coordinate reference system. This 2008 specification is now obsolete but is it still in use, among others, it is used by some national mapping agencies.

ProjConvert is an ES6 module to project GeoJSON and single coordinates from any EPSG-defined map projection into any other EPSG-defined map projection.

ProjConvert uses [proj4](https://github.com/proj4js/proj4js) configured with a full list of EPSG projection specifications, and [geojson-project](https://github.com/w8r/geojson-project) modified for ES6 to traverse all coordinates of a GeoJSON FeatureCollection or GeoJSON Feature.

The projection definition data is quite large: 500 kByte. When served with HTTP gzip compression, the transfer size is reduced to 46 kByte. GeoJSON is often used with web-mapping applications. A single map tile easily exceeds 46 kByte.

### Prerequisites
node, npm

### install
npm install @edugis/proj-convert

### usage
```javascript
import {geoJSONProject, coordProject} from '@edugis/proj-convert'

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
}
const projectedGeoJSON = geoJSONProject(geoJSON, 'EPSG:28992', 'EPSG:4326');

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

const coordinate = [5.387203508863084, 52.15517229965292];
const projectedCoordinate = coordProject(coordinate, 'EPSG:4326', 'EPSG:28992');

```


