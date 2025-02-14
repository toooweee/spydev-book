import { Box, Container, styled, Typography } from '@mui/material';
import React, { FC } from 'react';

const MainPage = () => {
  return (
    <Container>
        <Container maxWidth="md">
            <Typography variant='h1'>КНИГА ПАМЯТИ ОРЕНБУРГСКОЙ ОБЛАСТИ</Typography>
            <Typography>Книга героев Оренбургской Области</Typography>
        </Container>
    </Container>
  );
};
(window as any).MainPage = MainPage
export default MainPage;
