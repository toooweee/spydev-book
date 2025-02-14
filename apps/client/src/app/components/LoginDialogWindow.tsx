import React, { useCallback, useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Box, styled } from '@mui/material';
import {
    authRequestDTO,
    FormData,
    loginResponseDTO,
    registerResponseDTO,
    validateFormData
} from '../Helpers/LoginHelpers';
import apiService from '../Service/ApiService';
import { API_CONFIG } from '../../config';

enum AuthMode {
    login = 'Login',
    register = 'Register',
}

const AuthDialog = styled(Dialog)`
    .MuiDialog-paper {
        width: 450px;
        max-width: 450px;
        overflow: auto;
    }
`;

interface LoginDialogWindowProps {
    open: boolean;
    handleCloseAuthDialog: () => void;
}

const LoginDialogWindow: React.FC<LoginDialogWindowProps> = ({ open, handleCloseAuthDialog }) => {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        repeatPassword: '',
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});
    const [authMode, setAuthMode] = useState<string>(AuthMode.login);

    useEffect(() => {
        setErrors({});
        setFormData({
            email: '',
            password: '',
            repeatPassword: '',
        });
        setAuthMode(AuthMode.login);
    }, [open]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);


    const handleSubmit = async () => {
        setErrors(validateFormData(formData));
        const url = authMode === AuthMode.login
            ? API_CONFIG.AUTH_LOGIN
            : API_CONFIG.AUTH_REGISTER;
        console.log(url)
        if (url) {
            const request: authRequestDTO = {
                email: formData.email,
                password: formData.password,
            };
            if(authMode == AuthMode.login) {
                const response = await apiService.post<loginResponseDTO, authRequestDTO>(
                    `${API_CONFIG.HOST}${url}`,
                    request);
                if(response.status === 201) {
                    localStorage.setItem('token', JSON.stringify(response.data.accessToken.split(' ')[1]));
                    handleCloseAuthDialog();
                }
            }
            else{
                const response = await apiService.post<registerResponseDTO, authRequestDTO>(
                    `${API_CONFIG.HOST}${url}`,
                    request);
                if(response.status === 204) {
                    handleCloseAuthDialog();
                }
            }

        }
    };

    return (
        <AuthDialog open={open}>
            <DialogTitle>{authMode === AuthMode.login ? 'Войти' : 'Регистрация'}</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        autoFocus
                        name="email"
                        placeholder="Email"
                        variant="outlined"
                        value={formData.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        name="password"
                        type="password"
                        placeholder="Пароль"
                        variant="outlined"
                        value={formData.password}
                        onChange={handleInputChange}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    {authMode === AuthMode.register && (
                        <TextField
                            name="repeatPassword"
                            type="password"
                            placeholder="Подтверждение пароля"
                            variant="outlined"
                            value={formData.repeatPassword}
                            onChange={handleInputChange}
                            error={!!errors.repeatPassword}
                            helperText={errors.repeatPassword}
                        />
                    )}
                </Box>
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: 'space-between',
                    margin: '0 auto',
                    width: '70%',
                }}
            >
                <Button onClick={handleCloseAuthDialog} variant="contained" color="error">
                    Закрыть
                </Button>
                <Button variant="contained" color="primary" onClick={handleSubmit} size="large">
                    Отправить
                </Button>
            </DialogActions>
            <Box textAlign="center" mb={2}>
                {authMode === AuthMode.login ? (
                    <Button variant="text" onClick={() => setAuthMode(AuthMode.register)}>
                        Зарегистрироваться
                    </Button>
                ) : (
                    <Button variant="text" onClick={() => setAuthMode(AuthMode.login)}>
                        Войти
                    </Button>
                )}
            </Box>
        </AuthDialog>
    );
};

export default LoginDialogWindow;
