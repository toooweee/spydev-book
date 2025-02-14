import React, { FC, useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Button,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LoginDialogWindow from './LoginDialogWindow';

const navItems = ['Главная', 'Категории', 'Создать страницу', 'О проекте'];

export const Header = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openAuthDialog, setOpenAuthDialog] = useState(false);

    const AuthHandler = () => {
        setOpenAuthDialog(true);
    }

    const handleCloseAuthDialog = () => {
        setOpenAuthDialog(false);
    }

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2 }}>
            <Typography
                variant="h6"
                sx={{
                    my: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <MenuBookIcon sx={{ mr: 1 }} /> Книга памяти
            </Typography>
            <List>
                {navItems.map((item) => (
                    <ListItemButton key={item} onClick={handleDrawerToggle}>
                        <ListItemText primary={item} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <AppBar position="sticky" sx={{ gridArea: 'header' }}>
            <LoginDialogWindow open={openAuthDialog} handleCloseAuthDialog={handleCloseAuthDialog}/>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Мобильное меню */}
                {isMobile && (
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                {/* Логотип */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MenuBookIcon sx={{ mr: 1 }} />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        Книга памяти
                    </Typography>
                </Box>

                {/* Меню навигации для десктопа */}
                {!isMobile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {navItems.map((item) => (
                            <Button
                                key={item}
                                color="inherit"
                                sx={{ transition: '0.3s', '&:hover': { opacity: 0.7 } }}
                            >
                                {item}
                            </Button>
                        ))}
                    </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                        name="login"
                        color="inherit"
                        sx={{ fontSize: '0.875rem'}}
                        onClick={AuthHandler}
                    >
                        Войти / Регистрация
                    </Button>
                </Box>
            </Toolbar>

            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </AppBar>
    );
};
