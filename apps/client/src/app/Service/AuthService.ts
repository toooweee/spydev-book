import { authRequestDTO, loginResponseDTO, registerResponseDTO, validateFormData } from '../Helpers/AuthHelpers';
import { API_CONFIG } from '../../config';
import apiService from './ApiService';

const auth = async (data: authRequestDTO) => {
    const url = `${API_CONFIG.HOST}${API_CONFIG.AUTH_LOGIN}`;
    console.log(url);
    const request: authRequestDTO = {
        email: data.email,
        password: data.password,
    };
    if (true) {
        //если авторизация
        const response = await apiService.post<loginResponseDTO, authRequestDTO>(url, request);
        if (response.status === 201) {
            localStorage.setItem('token', JSON.stringify(response.data.accessToken.split(' ')[1]));
        }
    }
    const response = await apiService.post<registerResponseDTO, authRequestDTO>(url, request);
    if (response.status === 204) {
        //успех
    }
};
