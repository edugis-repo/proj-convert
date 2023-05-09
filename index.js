import proj4 from 'proj4';
import geojsonProject from './geojsonproject.js';
import defs from './proj4defs.js';

const epsgDefs = defs.map(def=>[`EPSG:${def[0]}`, def[1]]).filter(def=>def[1] !== "");
proj4.defs(epsgDefs);

const defaultToEPSG='EPSG:4326'

const parseCRS = (geojson) => {
    let result = 'EPSG:4326'; // GeoJSON default
    if (geojson && geojson.crs && geojson.crs.type && geojson.crs.properties) {
        if (geojson.crs.properties.name) {
            const crsName = geojson.crs.properties.name;
            if (crsName.startsWith('urn:ogc:def:crs:')) {
                const crsNameParts = crsName.split(':');
                if (crsNameParts[4] === 'OGC' && crsNameParts[5] === 'CRS84') {
                    fromEPSG = 'EPSG:4326';
                } else if (crsNameParts[4] === 'EPSG') {
                    result = 'EPSG:' + crsNameParts[crsNameParts.length - 1];
                }
            } else if (crsName.startsWith('EPSG:')) {
                result = crsName;
            }
        } else if (geojson.crs.type==='EPSG' && geojson.crs.properties.code) {
            result = `EPSG:${geojson.crs.properties.code}`
        }
    }
    return result;
}

export const geoJSONProject = (geojson, fromEPSG, toEPSG = defaultToEPSG) => {
    if (!fromEPSG) {
        fromEPSG = parseCRS(geojson);
    }
    if (geojson && fromEPSG && toEPSG) {
        if (fromEPSG === toEPSG) {
            return geojson;
        }
        if (proj4.defs(fromEPSG) && proj4.defs(toEPSG)) {
            const projectedGeoJSON = geojsonProject(geojson, proj4(fromEPSG, toEPSG).forward);
            if (toEPSG === 'EPSG:4326') {
                delete projectedGeoJSON.crs;
            } else {
                projectedGeoJSON.crs = {
                    type: "name",
                    properties: {
                        name: `urn:ogc:def:crs:EPSG::${toEPSG.slice(5)}`
                    }
                }
            }
            return projectedGeoJSON;
        }
    }
    return null;
}

export const coordProject = (coord, fromEPSG, toEPSG = defaultToEPSG) => {
    if (fromEPSG && proj4.defs(fromEPSG) && proj4.defs(toEPSG)) {
        return proj4(fromEPSG, toEPSG).forward(coord);
    }
    return undefined;
}

export default geoJSONProject;
