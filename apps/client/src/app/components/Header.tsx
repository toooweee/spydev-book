import React from "react";
import { AppBar, Box, Button, Container, Tab, Tabs, TextField, Toolbar, Typography } from '@mui/material';
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
    const location = useLocation();
    const tabValue = Math.max(["/", "/map",].indexOf(location.pathname), 0);

    return (
        <AppBar position="static">
            <Container>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <MenuBookIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">Книга Памяти</Typography>
                    </Box>
                    <Tabs value={tabValue} textColor="inherit" indicatorColor='secondary'>
                        <Tab label="Главная" component={Link} to="/" />
                        <Tab label="Карта" component={Link} to="/map" />
                    </Tabs>
                    <Button component={Link} variant="contained" color="inherit" to={'/auth'}>
                        Вход
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
