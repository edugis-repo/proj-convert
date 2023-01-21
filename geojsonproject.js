"use strict";
/**
 * Takes in GeoJSON and applies a function to each coordinate,
 * with a given context
 *
 * @param  {Object}     data GeoJSON
 * @param  {Function}   project
 * @param  {*=}         context
 * @return {Object}
 */
export default function geojsonProject(data, project, context) {
    if (project === undefined)
        throw new Error("project function is required");
    data ={...data};
    if (data.type === "FeatureCollection") {
        for (var i = data.features.length - 1; i >= 0; i--) {
            data.features[i] = projectFeature(data.features[i], project, context);
        }
    }
    else {
        data = projectFeature(data, project, context);
    }
    return data;
}
/**
 * @param  {Object}     data GeoJSON
 * @param  {Function}   project
 * @param  {*=}         context
 * @return {Object}
 */
function projectFeature(feature, project, context) {
    if (feature.geometry.type === "GeometryCollection") {
        for (var i = 0, len = feature.geometry.geometries.length; i < len; i++) {
            feature.geometry.geometries[i] = projectGeometry(feature.geometry.geometries[i], project, context);
        }
    }
    else {
        feature.geometry = projectGeometry(feature.geometry, project, context);
    }
    return feature;
}
/**
 * @param  {Object}     data GeoJSON
 * @param  {Function}   project
 * @param  {*=}         context
 * @return {Object}
 */
function projectGeometry(geometry, project, context) {
    switch (geometry.type) {
        case "Point":
            geometry.coordinates = project.call(context, geometry.coordinates);
            break;
        case "MultiPoint":
        case "LineString":
            var coords = geometry.coordinates;
            for (var i = 0, len = coords.length; i < len; i++) {
                coords[i] = project.call(context, coords[i]);
            }
            geometry.coordinates = coords;
            break;
        case "Polygon":
            geometry.coordinates = projectCoords(geometry.coordinates, 1, project, context);
            break;
        case "MultiLineString":
            geometry.coordinates = projectCoords(geometry.coordinates, 1, project, context);
            break;
        case "MultiPolygon":
            geometry.coordinates = projectCoords(geometry.coordinates, 2, project, context);
            break;
        default:
            break;
    }
    return geometry;
}
function projectCoords(coords, levelsDeep, project, context) {
    var result = [];
    for (var i = 0, len = coords.length; i < len; i++) {
        var coord = levelsDeep > 0
            ? projectCoords(coords[i], levelsDeep - 1, project, context)
            : project.call(context, coords[i]);
        result.push(coord);
    }
    return result;
}
geojsonProject.projectFeature = projectFeature;
geojsonProject.projectCoords = projectCoords;
geojsonProject.projectGeometry = projectGeometry;
