import React from 'react';
import { Box, Container, FormControl, TextField, Typography, Button, Alert } from '@mui/material';
import { useRegForm } from '../hooks/useRegForm';
import { onSubmit } from '../actionPages/RegPageAction';
import { Link } from 'react-router-dom';

const RegPage: React.FC = () => {
    const { register, handleSubmit, errors } = useRegForm();

    return (
        <Box
            sx={{m: '3rem'}}
        >
            <Container maxWidth="sm">
                <Typography variant="h1" align="center" gutterBottom>
                    Заявка на регистрацию
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    {/* Организация */}
                    <FormControl>
                        <TextField
                            {...register('organization')}
                            variant="outlined"
                            fullWidth
                            placeholder="Орган местного самоуправления/Орган военного управления"
                            error={!!errors.organization}
                            helperText={errors.organization?.message}
                        />
                    </FormControl>

                    {/* Наименование органа */}
                    <FormControl>
                        <TextField
                            {...register('departmentName')}
                            variant="outlined"
                            fullWidth
                            placeholder="Наименование органа"
                            error={!!errors.departmentName}
                            helperText={errors.departmentName?.message}
                        />
                    </FormControl>

                    {/* ФИО */}
                    <FormControl>
                        <TextField
                            {...register('firstName')}
                            variant="outlined"
                            fullWidth
                            placeholder="Имя"
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                        <TextField
                            {...register('lastName')}
                            variant="outlined"
                            fullWidth
                            placeholder="Фамилия"
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                        <TextField
                            {...register('middleName')}
                            variant="outlined"
                            fullWidth
                            placeholder="Отчество"
                            error={!!errors.middleName}
                            helperText={errors.middleName?.message}
                        />
                    </FormControl>

                    {/* Контакты */}
                    <FormControl>
                        <TextField
                            {...register('phone')}
                            variant="outlined"
                            fullWidth
                            placeholder="Номер"
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                        <TextField
                            {...register('email')}
                            variant="outlined"
                            fullWidth
                            placeholder="Почта"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </FormControl>

                    {/* Кнопка отправки */}
                    <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
                        Отправить
                    </Button>

                    {/* Сообщение об ошибке */}
                    {errors.root && (
                        <Alert severity="error">{errors.root.message}</Alert>
                    )}
                    <Button component={Link} to={'/auth'}>
                        Войти
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default RegPage;
