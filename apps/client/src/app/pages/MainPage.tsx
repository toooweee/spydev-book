import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    Container,
    FormControl,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import HeroCard from '../components/HeroCard';
import { heroes } from '../Helpers/MemoryFormPageHelpers';
import HeroSlider from '../components/HeroSlider';

interface FindHero {
    firstName: string;
    lastName: string;
    middleName: string;
    lifeDate: Dayjs | null;
}

const MainPage: React.FC = () => {
    const [findHero, setFindHero] = useState<FindHero>({
        firstName: '',
        lastName: '',
        middleName: '',
        lifeDate: dayjs(),
    });

    const handleFindHero = () => {
        console.log(findHero);
        return true;
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: '5rem', mt: '5rem' }}>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', fontSize: {xs: '2rem', sm: '4rem'}}}>
                    КНИГА ПАМЯТИ ОРЕНБУРГСКОЙ ОБЛАСТИ
                </Typography>
                <Typography variant="subtitle1">
                    Архив героев военных действий Оренбургской области
                </Typography>
            </Box>
            <Box>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Ищете информацию о человеке? Воспользуйтесь нашим поиском
                </Typography>
                <Card sx={{ p: 3, boxShadow: 3 }}>
                    <FormControl fullWidth>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Имя"
                                    variant="outlined"
                                    fullWidth
                                    value={findHero.firstName}
                                    onChange={(e) =>
                                        setFindHero({ ...findHero, firstName: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Фамилия"
                                    variant="outlined"
                                    fullWidth
                                    value={findHero.lastName}
                                    onChange={(e) =>
                                        setFindHero({ ...findHero, lastName: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    label="Отчество"
                                    variant="outlined"
                                    fullWidth
                                    value={findHero.middleName}
                                    onChange={(e) =>
                                        setFindHero({ ...findHero, middleName: e.target.value })
                                    }
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Дата рождения"
                                        value={findHero.lifeDate}
                                        onChange={(newValue: Dayjs | null) =>
                                            setFindHero((prev) => ({
                                                ...prev,
                                                lifeDate: newValue || prev.lifeDate,
                                            }))
                                        }
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleFindHero}
                                    fullWidth
                                    sx={{ mt: 2 }}
                                >
                                    Найти
                                </Button>
                            </Grid>
                        </Grid>
                    </FormControl>
                </Card>
            </Box>
            <Box>
                <Box>
                    <Typography variant='h2'>Герои ВОВ</Typography>
                    <HeroSlider
                        heroes={heroes}
                    />
                </Box>
            </Box>
        </Container>
    );
};

export default MainPage;
