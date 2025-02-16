import React, { useEffect, useState } from 'react';
import { AppBar, Box, Button, Drawer, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Link, useLocation } from 'react-router-dom';
import { Person3Outlined } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from './HeaderL';

export const Header = () => {
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

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }
        setOpenDrawer(open);
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Логотип и название */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
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

                {/* Отображение кнопки для входа или кнопки меню в зависимости от состояния пользователя */}
                {!user ? (
                    <Button component={Link} variant="contained" color="primary" to={'/auth'}>
                        Вход
                    </Button>
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
