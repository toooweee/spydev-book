import React from 'react';
import { Card, CardContent, Container, Typography, IconButton } from '@mui/material';
import { Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PersonalAccountPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', mt: 0 }}>
            <Typography variant="h1" align="center" gutterBottom>
                Личный кабинет
            </Typography>
            <Card
                onClick={() => navigate('/user/createPage')}
                sx={{
                    width: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                }}
            >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 4 }}>
                    <IconButton size="large" color="primary">
                        <Person fontSize="large" />
                    </IconButton>
                    <Typography variant="body1" align="center" mt={2}>
                        Создайте страницу героя
                    </Typography>
                </CardContent>
            </Card>
            <Typography variant="body1" align="center" mt={4}>
                Расскажите о судьбе своих родственников, принимавших участие в Великой Отечественной войне.
            </Typography>
        </Container>
    );
};

export default PersonalAccountPage;
