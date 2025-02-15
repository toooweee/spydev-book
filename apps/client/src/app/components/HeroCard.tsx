import React, { FC, useMemo, useEffect } from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';

interface HeroCardProps {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    lifeDate: Dayjs | null;
    photo?: Blob;
}

const HeroCard: FC<HeroCardProps> = ({ id, firstName, middleName, lastName, lifeDate, photo }) => {
    const navigate = useNavigate();

    const photoURL = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo]);

    useEffect(() => {
        return () => {
            if (photoURL) {
                URL.revokeObjectURL(photoURL);
            }
        };
    }, [photoURL]);

    return (
        <Card sx={{ maxWidth: 300, m: 2, p: 2 }}>
            <CardContent>
                {photoURL && <img src={photoURL} alt="Фото героя" style={{ width: '100%', borderRadius: '8px' }} />}
                <Box sx={{ mt: 2 }}>
                    <Typography variant='h2' fontWeight="bold">
                        {firstName} {middleName} {lastName}
                    </Typography>
                    <Typography variant='body2' color="text.secondary">
                        {lifeDate ? lifeDate.format('DD.MM.YYYY') : 'Дата неизвестна'}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    sx={{ mt: 2, width: '100%' }}
                    onClick={() => navigate(`/hero/${id}`)}
                >
                    Подробнее
                </Button>
            </CardContent>
        </Card>
    );
};

export default HeroCard;
