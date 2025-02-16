import React, { useState } from 'react';
import { AppBar, Box, Button, Drawer, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Person3Outlined } from '@mui/icons-material';
import { API_CONFIG } from '../../config';
import { authRequestDTO, loginResponseDTO } from '../Helpers/AuthHelpers';
import apiService from '../Service/ApiService';

export const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const tabValue = Math.max(['/', '/map', '/user'].indexOf(location.pathname), 0);
    const [user, setUser] = useState<boolean>(false);
    const [openDrawer, setOpenDrawer] = useState(false);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setOpenDrawer(open);
    };

    const logout = async () => {
        navigate('/');
        const url = `${API_CONFIG.HOST}${API_CONFIG.AUTH_LOGOUT}`;
        await apiService.post<number, string>(url, '');
        localStorage.removeItem('token');
    }

    return (
        <AppBar position="static" color="primary">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MenuBookIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        Книга Памяти
                    </Typography>
                </Box>
                <Tabs value={tabValue} textColor="inherit" indicatorColor="secondary">
                    <Tab label="Главная" component={Link} to="/" />
                    <Tab label="Карта" component={Link} to="/map" />
                </Tabs>
                <>
                    <Button component={Link} variant="contained" color="primary" to={'/auth'}>
                        Вход
                    </Button>
                </>
                <>
                    <Button onClick={toggleDrawer(true)} color="inherit">
                        <Person3Outlined />
                    </Button>
                    <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
                        Меню
                        <Tabs
                            value={tabValue}
                            textColor="inherit"
                            indicatorColor="secondary"
                            orientation="vertical"
                            sx={{ p: 2 }}
                        >
                            <Tab label="Личный кабинет" component={Link} to="/user" />
                            <Tab label="Выход" onClick={logout}/>
                        </Tabs>
                    </Drawer>
                </>
            </Toolbar>
        </AppBar>
    );
};
