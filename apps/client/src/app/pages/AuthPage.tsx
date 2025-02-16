import React, { useState } from 'react';
import { Box, Container, FormControl, TextField, Typography, Button, Alert, Card } from '@mui/material';
import { useAuth } from '../hooks/useAuthForm';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import { authRequestDTO, loginResponseDTO } from '../Helpers/AuthHelpers';
import { API_CONFIG } from '../../config';
import apiService from '../Service/ApiService';
import { AuthFormValues } from '../validation/authValidation';

const AuthPage: React.FC = () => {
    const { register, handleSubmit, errors,  } = useAuth();
    const [errorSubmit, setErrorSubmit] = useState('');
    const navigate = useNavigate();

    const login = async (data: AuthFormValues) => {
        const url = `${API_CONFIG.HOST}${API_CONFIG.AUTH_LOGIN}`;
        const request: authRequestDTO = {
            email: data.login,
            password: data.password,
        };
        const response = await apiService.post<loginResponseDTO, authRequestDTO>(url, request);
        if (response.status === 201) {
            localStorage.setItem('token', response.data.accessToken.split(' ')[1]);
            navigate('/')
        }
        else if (response.status === 404) {
            setErrorSubmit('Учетная запись не найдена')
        }
        else{
            setErrorSubmit(response.statusText);
        }
    };

    return (
        <Box
            sx={{m: '3rem'}}
        >
            <Container maxWidth="sm">
                <Card>
                    <Typography variant="h1" align="center" gutterBottom>
                        Авторизация
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit(login)}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        {/* Email */}
                        <FormControl>
                            <TextField
                                {...register('login')}
                                variant="outlined"
                                fullWidth
                                label="Логин"
                                error={!!errors.login}
                                helperText={errors.login?.message}
                            />
                        </FormControl>

                        {/* Пароль */}
                        <FormControl>
                            <TextField
                                {...register('password')}
                                variant="outlined"
                                fullWidth
                                label="Пароль"
                                type="password"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </FormControl>

                        {/* Кнопка отправки */}
                        <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
                            Войти
                        </Button>
                        {errorSubmit && (
                            <Alert severity='error'>{errorSubmit}</Alert>
                        )}
                        <Button component={Link} to={'/reg'}>
                            Оставить заявку на регистрацию
                        </Button>
                    </Box>
                </Card>
            </Container>
        </Box>
    );
};

export default AuthPage;
