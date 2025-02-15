'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import proj4 from 'proj4';
import L from 'leaflet';

// Фикс для иконок маркеров
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface HeroFeature {
    id: number;
    geometry: {
        coordinates: [number, number];
    };
    properties: {
        fio: string;
        info: string;
        kontrakt?: string;
        nagrads?: string;
    };
}

const login = async (): Promise<string | null> => {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'hackathon_28',
                password: 'hackathon_28_25',
            }),
        });

        if (!response.ok) throw new Error('Ошибка авторизации');
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;
    } catch (error) {
        console.error('Ошибка при входе:', error);
        return null;
    }
};

const MapPage = () => {
    const [heroData, setHeroData] = useState<HeroFeature[]>([]);
    const [municipalData, setMunicipalData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [mapCenter] = useState<[number, number]>([52.52, 56.04]);

    const convertCoords = (coords: [number, number]): [number, number] => {
        return proj4('EPSG:3857', 'EPSG:4326', coords);
    };

    const convertGeoJSON = (geojson: any) => {
        const convertCoordinates = (coords: any[]): any[] => {
            // Обрабатываем вложенные массивы координат
            if (Array.isArray(coords[0])) {
                return coords.map((coord) => convertCoordinates(coord));
            }

            // Преобразуем только пары координат
            if (coords.length >= 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                return convertCoords([coords[0], coords[1]]);
            }

            return coords;
        };

        if (!geojson || !geojson.features) return null;

        return {
            type: 'FeatureCollection',
            features: geojson.features.map((feature: any) => ({
                ...feature,
                geometry: {
                    ...feature.geometry,
                    coordinates: convertCoordinates(feature.geometry.coordinates),
                },
            })),
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await login();
                if (!token) throw new Error('Не удалось авторизоваться');

                // Загрузка муниципалитетов
                const municipalitiesRes = await fetch('http://localhost:3000/api/next-gis/municipalities', {
                    headers: { Authorization: token },
                });

                // Добавляем проверку статуса ответа
                if (!municipalitiesRes.ok) {
                    throw new Error(`HTTP error! status: ${municipalitiesRes.status}`);
                }

                const { layers } = await municipalitiesRes.json();
                console.log('Municipal layers from API:', layers);

                // Если слои все равно пустые, используем хардкод из логов
                const finalLayers = layers.length > 0 ? layers : [8806, 7980, 7974, 9];
                console.log('Using layers:', finalLayers);

                const municipalities = await Promise.all(
                    finalLayers.map(async (id: number) => {
                        try {
                            const res = await fetch(`http://localhost:3000/api/next-gis/layer/${id}`, {
                                headers: { Authorization: token },
                            });

                            // Детальный лог статуса ответа
                            console.log(`Layer ${id} status:`, res.status);

                            if (!res.ok) {
                                console.error(`Ошибка загрузки слоя ${id}:`, await res.text());
                                return null;
                            }

                            const data = await res.json();
                            console.log(`Layer ${id} data:`, data);

                            const converted = convertGeoJSON(data);
                            if (!converted?.features?.length) {
                                console.warn(`Слой ${id} не содержит геоданных`);
                                return null;
                            }

                            // Проверка координат
                            console.log(`Converted layer ${id} sample:`, converted.features[0].geometry.coordinates);
                            return converted;
                        } catch (e) {
                            console.error(`Критическая ошибка загрузки слоя ${id}:`, e);
                            return null;
                        }
                    }),
                );

                setMunicipalData(municipalities.filter(Boolean));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const geoJsonStyle = {
        color: '#ff7800',
        weight: 2,
        fillColor: '#ff7800',
        fillOpacity: 0.2,
    };

    return (
        <div style={{ padding: '20px', height: '100vh' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Карта героев и муниципальных образований</h1>

            {error && <div style={{ color: 'red', padding: '10px', textAlign: 'center' }}>{error}</div>}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка карты...</div>
            ) : (
                <MapContainer
                    attributionControl={false}
                    center={mapCenter}
                    zoom={8}
                    style={{ height: '70vh', width: '70%', borderRadius: '10px' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {municipalData.map((layer, index) => (
                        <GeoJSON
                            key={`municipal-${index}`}
                            data={layer}
                            style={geoJsonStyle}
                            onEachFeature={(feature, layer) => {
                                if (feature.properties) {
                                    const popupContent = Object.entries(feature.properties)
                                        .filter(([key]) => !key.startsWith('@'))
                                        .map(([key, value]) => `<p><b>${key}:</b> ${value}</p>`)
                                        .join('');

                                    layer.bindPopup(`
                    <div style="max-width: 300px">
                      <h3 style="margin: 0 0 10px">${feature.properties.display_name || 'Объект'}</h3>
                      ${popupContent}
                    </div>
                  `);
                                }
                            }}
                        />
                    ))}

                    {heroData.map((feature) => {
                        const [lng, lat] = convertCoords(feature.geometry.coordinates);
                        return (
                            <Marker key={`hero-${feature.id}`} position={[lat, lng]}>
                                <Popup>
                                    <div style={{ minWidth: '200px' }}>
                                        <h3 style={{ margin: '0 0 10px' }}>{feature.properties.fio}</h3>
                                        <p>{feature.properties.info}</p>
                                        {feature.properties.kontrakt && (
                                            <p style={{ margin: '5px 0' }}>
                                                <b>Контракт:</b> {feature.properties.kontrakt}
                                            </p>
                                        )}
                                        {feature.properties.nagrads && (
                                            <p style={{ margin: '5px 0' }}>
                                                <b>Награды:</b> {feature.properties.nagrads}
                                                <button onClick={() => console.log(feature)}>Подробнее о герое</button>
                                            </p>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            )}
        </div>
    );
};
export default MapPage;
