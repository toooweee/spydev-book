import React from 'react';
import {
    Container,
    Typography,
    Box,
    Divider,
    TextField,
    InputAdornment,
    IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ApplicationsTable from '../components/ApplicationsTable';
import { useApplication } from '../actionPages/ApplicationPageAction';

const ApplicationPage = () => {
    const {
        handleSubmitApplication,
        handleCancelApplication,
        handleSearchChange,
        filteredApplications,
        searchTerm,
    } = useApplication();

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* Заголовок страницы */}
            <Typography variant="h4" component="h1" gutterBottom>
                Заявки
            </Typography>
            {/* Краткое описание */}
            <Typography variant="subtitle1" gutterBottom>
                Здесь вы можете просматривать, принимать или отклонять заявки. Используйте поиск для быстрого
                доступа к нужной информации.
            </Typography>

            {/* Поисковая строка */}
            <Box sx={{ my: 3 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Поиск заявок..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Таблица заявок */}
            <ApplicationsTable
                applications={filteredApplications}
                onSubmitApplication={handleSubmitApplication}
                onCancelApplication={handleCancelApplication}
            />
        </Container>
    );
};

export default ApplicationPage;
