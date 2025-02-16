import proj4 from 'proj4';
import { FeatureCollection, Geometry } from './MapInterfaces';

const convertCoords = (coords: [number, number]): [number, number] => {
    return proj4('EPSG:3857', 'EPSG:4326', coords);
};

const convertCoordinates = (coords: any): any => {
    if (Array.isArray(coords[0])) {
        // Если координаты вложенные, обрабатываем их рекурсивно
        return coords.map((coord: any) => convertCoordinates(coord));
    }

    // Преобразуем только пары координат (для Point, LineString, Polygon и т.д.)
    if (coords.length >= 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
        return convertCoords([coords[0], coords[1]]);
    }

    return coords;
};

export const convertGeoJSON = (geojson: FeatureCollection): FeatureCollection | null => {
    if (!geojson || !geojson.features) return null;

    return {
        type: 'FeatureCollection',
        name: geojson.name,
        crs: geojson.crs,
        features: geojson.features.map((feature) => ({
            ...feature,
            geometry: feature.geometry
                ? {
                    ...feature.geometry,
                    coordinates: convertCoordinates(feature.geometry.coordinates),
                }
                : null,
        })),
    };
};
