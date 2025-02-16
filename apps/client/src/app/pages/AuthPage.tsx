import React from 'react';
import { Box, Container, FormControl, TextField, Typography, Button, Alert, Card } from '@mui/material';
import { useAuth } from '../hooks/useAuthForm';
import { onSubmit } from '../actionPages/AuthPageAction';
import { Link } from 'react-router-dom';

const AuthPage: React.FC = () => {
    const { register, handleSubmit, errors } = useAuth();

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
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                    >
                        {/* Email */}
                        <FormControl>
                            <TextField
                                {...register('login')}
                                variant="outlined"
                                fullWidth
                                label="Логин"
                                placeholder='example@mail.com'
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

                        {/* Сообщение об ошибке */}
                        {errors.root && (
                            <Alert severity="error">{errors.root.message}</Alert>
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
