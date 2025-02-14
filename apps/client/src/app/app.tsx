import { ThemeProvider } from '@mui/material';
import AppTheme from '../theme';
import { Header } from './components/Header';
import React from 'react';

export function App() {
    return (
        <ThemeProvider theme={AppTheme}>
            <Header />
        </ThemeProvider>
    );
}

export default App;
