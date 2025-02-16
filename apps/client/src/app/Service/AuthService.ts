import { authRequestDTO, loginResponseDTO, registerResponseDTO, validateFormData } from '../Helpers/AuthHelpers';
import { API_CONFIG } from '../../config';
import apiService from './ApiService';

export const login = async (data: authRequestDTO) => {
    const url = `${API_CONFIG.HOST}${API_CONFIG.AUTH_LOGIN}`;
    const request: authRequestDTO = {
        email: data.email,
        password: data.password,
    };
    const response = await apiService.post<loginResponseDTO, authRequestDTO>(url, request);
    if (response.status === 201) {
        localStorage.setItem('token', response.data.accessToken.split(' ')[1]);
    }
    return response.data.accessToken.split(' ')[1];
};
