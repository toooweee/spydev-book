import { API_CONFIG } from '../../config';
import apiService from './ApiService';
import { FeatureCollection } from '../Helpers/MapInterfaces';

export const fetchLayers = async () : Promise<number[]> => {
    const url = `${API_CONFIG.HOST}${API_CONFIG.NEXT_GIS}${API_CONFIG.MUNICIPALITET}`;
    const response = await apiService.get<{layers: number[]}>(url);
    if (response.status === 200) {
        return response.data.layers;
    }
    else{
        console.error('Ошибка получения layots');
        return [];
    }
};

export const fetchLayerData = async (layerId: number) => {
    const url = `${API_CONFIG.HOST}${API_CONFIG.NEXT_GIS}${API_CONFIG.LAYER}/${layerId}`;
    const response = await apiService.get<FeatureCollection>(url);

    if(response.status === 200) {
        return response.data;
    }
    else {
        return null;
    }
}
