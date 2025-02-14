import { CssBaseline, ThemeProvider } from '@mui/material';
import AppTheme from '../theme';
import { Header } from './components/Header';
import React from 'react';
import { BrowserRouter } from 'react-router';
import AppRouter from './components/AppRouter';
import { routes } from './routes';

export function App() {
    return (
        <BrowserRouter>
            <ThemeProvider theme={AppTheme}>
                <CssBaseline/>
                <Header />
                <AppRouter links={routes}/>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
