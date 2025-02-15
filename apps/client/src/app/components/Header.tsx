import React, { useState } from 'react';
import { AppBar, Box, Button, Drawer, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Link, useLocation } from 'react-router-dom';
import { Person3Outlined } from '@mui/icons-material';

export const Header = () => {
    const location = useLocation();
    const tabValue = Math.max(["/", "/map", "/user"].indexOf(location.pathname), 0);
    const [user, setUser] = useState<boolean>(false);
    const [openDrawer, setOpenDrawer] = useState(false);

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
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <MenuBookIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Книга Памяти</Typography>
                </Box>
                <Tabs value={tabValue} textColor="inherit" indicatorColor="secondary">
                    <Tab label="Главная" component={Link} to="/" />
                    <Tab label="Карта" component={Link} to="/map" />
                </Tabs>
                {user === true ? (
                    <Button component={Link} variant="contained" color="primary" to={'/auth'}>
                        Вход
                    </Button>
                ) : (
                    <>
                        <Button onClick={toggleDrawer(true)} color='inherit'>
                            <Person3Outlined/>
                        </Button>
                        <Drawer
                            anchor="right"
                            open={openDrawer}
                            onClose={toggleDrawer(false)}
                        >
                            Меню
                            <Tabs
                                value={tabValue}
                                textColor="inherit"
                                indicatorColor="secondary"
                                orientation="vertical"
                                sx={{ p: 2 }}
                            >
                                <Tab label="Личный кабинет" component={Link} to="/user" />
                            </Tabs>
                        </Drawer>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};
