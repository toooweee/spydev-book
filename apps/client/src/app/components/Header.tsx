import React, { useEffect, useState } from 'react';
import { AppBar, Box, Button, Drawer, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Person3Outlined } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from './HeaderL';
import { API_CONFIG } from '../../config';
import { authRequestDTO, loginResponseDTO } from '../Helpers/AuthHelpers';
import apiService from '../Service/ApiService';

export const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const tabValue = Math.max(
        ["/", "/map", "/user", "/admin/applications"].indexOf(location.pathname),
        0
    );

    const { user, userRole } = useAuth()

    const logout = () => {
        localStorage.removeItem("token");
        window.location.reload(); // Обновление страницы для применения изменений
    }

    const [openDrawer, setOpenDrawer] = useState(false); // открытие Drawer
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
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Логотип и название */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MenuBookIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                        Книга Памяти
                    </Typography>
                </Box>

                {/* Навигация по вкладкам */}
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
                ) : (
                    <>
                        <Button onClick={toggleDrawer(true)} color="inherit">
                            <Person3Outlined />
                        </Button>
                        <Drawer
                            anchor="right"
                            open={openDrawer}
                            onClose={toggleDrawer(false)}
                        >
                            <Typography variant="h2" sx={{ p: 2 }}>Меню</Typography>
                            <hr />
                            <Tabs
                                value={tabValue}
                                textColor="inherit"
                                indicatorColor="secondary"
                                orientation="vertical"
                                sx={{ p: 2 }}
                            >
                                <Tab label="Личный кабинет" component={Link} to="/user" />
                            </Tabs>

                            {/* Админ-меню отображается, если роль пользователя - администратор */}
                            {userRole === UserRole.admin && (
                                <>
                                    <Typography variant="h2" sx={{ p: 2 }}>Админ панель</Typography>
                                    <hr />
                                    <Tabs
                                        value={tabValue}
                                        textColor="inherit"
                                        indicatorColor="secondary"
                                        orientation="vertical"
                                        sx={{ p: 2 }}
                                    >
                                        <Tab label="Заявки на регистрацию" component={Link} to="/admin/applications" />
                                    </Tabs>
                                </>
                            )}
                            <Tabs
                                value={tabValue}
                                textColor="inherit"
                                indicatorColor="secondary"
                                orientation="vertical"
                                sx={{ p: 2 }}
                            >
                                <Button onClick={logout}>
                                    Выйти
                                </Button>
                            </Tabs>
                        </Drawer>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};
