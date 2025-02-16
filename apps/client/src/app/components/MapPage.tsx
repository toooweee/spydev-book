import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { convertGeoJSON } from '../Helpers/MapPageHelpers';
import { fetchLayerData, fetchLayers } from '../Service/MapService';
import { Feature, FeatureCollection, Geometry } from '../Helpers/MapInterfaces';

// Фикс для иконок маркеров
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = () => {
    const [heroData, setHeroData] = useState<FeatureCollection[]>([]);
    const [municipalData, setMunicipalData] = useState<FeatureCollection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [mapCenter] = useState<[number, number]>([52.52, 56.04]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            try {
                const municipalitiesRes = await fetchLayers();

                const layerData = await Promise.all(
                    municipalitiesRes.map(async (num) => {
                        const layer = await fetchLayerData(num);
                        if (!layer) return null;
                        const converted = convertGeoJSON(layer);
                        if (num === 9) {
                            return { type: 'municipal', data: converted };
                        } else {
                            return { type: 'hero', data: converted };
                        }
                    }),
                );
                console.log(layerData);

                setMunicipalData(
                    layerData
                        .filter(
                            (
                                item,
                            ): item is {
                                type: string;
                                data: FeatureCollection;
                            } => item?.type === 'municipal' && item.data !== null,
                        )
                        .map((item) => item.data),
                );

                setHeroData(
                    layerData
                        .filter(
                            (
                                item,
                            ): item is {
                                type: string;
                                data: FeatureCollection;
                            } => item?.type === 'hero' && item.data !== null,
                        )
                        .map((item) => item.data),
                );
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            }

            setLoading(false);
        };

        loadData();
    }, []);

    const geoJsonStyle = {
        color: 'rgba(55,0,255,0.38)',
        weight: 2,
        fillColor: '#3700ff',
        fillOpacity: 0.2,
    };

    const handleMarkerClick = (feature: Feature) => {
        alert(feature.id);
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

                    {/* Рендер муниципальных данных */}
                    {municipalData &&
                        municipalData.map((layer, index) => (
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

                    {/* Рендер маркеров героев */}
                    {heroData &&
                        heroData.map((layer, index) =>
                            layer.features.map((feature, idx) => {
                                if (feature.geometry && feature.geometry.type === 'Point') {
                                    const coordinates = feature.geometry.coordinates as [number, number];
                                    if (coordinates && coordinates.length >= 2) {
                                        return (
                                            <Marker
                                                key={`hero-${index}-${idx}`}
                                                position={[coordinates[1], coordinates[0]]} // [широта, долгота]
                                                eventHandlers={{
                                                    click: () => {
                                                        handleMarkerClick(feature);
                                                    },
                                                }}
                                            >
                                            </Marker>
                                        );
                                    }
                                }
                                return null;
                            }),
                        )}
                </MapContainer>
            )}
        </div>
    );
};

export default MapPage;
