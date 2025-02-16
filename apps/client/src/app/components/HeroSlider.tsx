// HeroSlider.tsx
import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import HeroCard from './HeroCard';
import { Conflict, PageInfo } from '../Helpers/MemoryFormPageHelpers';

interface HeroSliderProps {
    conflicts: typeof Conflict;
    heroes: PageInfo[];
    scrollStep?: number;
}

const HeroSlider = forwardRef<HTMLDivElement, HeroSliderProps>(
    ({ conflicts, heroes, scrollStep = 300 }, ref) => {
        const theme = useTheme();
        const sliderRef = useRef<HTMLDivElement>(null);
        const [currentScroll, setCurrentScroll] = useState(0);
        const [maxScroll, setMaxScroll] = useState(0);

        const conflictValues = Object.values(conflicts);

        useEffect(() => {
            if (sliderRef.current) {
                setMaxScroll(
                    sliderRef.current.scrollWidth - sliderRef.current.clientWidth
                );
            }
        }, [conflicts]);

        const handleScroll = (direction: 'left' | 'right') => {
            if (!sliderRef.current) return;

            const newScroll = direction === 'left'
                ? Math.max(currentScroll - scrollStep, 0)
                : Math.min(currentScroll + scrollStep, maxScroll);

            sliderRef.current.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
            setCurrentScroll(newScroll);
        };

        return (
            <Box sx={{ position: 'relative', my: 4 }}>
                <IconButton
                    onClick={() => handleScroll('left')}
                    sx={{
                        position: 'absolute',
                        left: -40,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        visibility: currentScroll > 0 ? 'visible' : 'hidden'
                    }}
                >
                    <KeyboardArrowLeft />
                </IconButton>

                <Box
                    ref={sliderRef}
                    sx={{
                        display: 'flex',
                        gap: 3,
                        overflowX: 'auto',
                        scrollBehavior: 'smooth',
                        '&::-webkit-scrollbar': { display: 'none' },
                        px: 1
                    }}
                >
                    {conflictValues.map((conflict) => {
                        const filteredHeroes = heroes.filter(hero =>
                            hero.kontrakt.includes(conflict)
                        );

                        return (
                            <Box key={conflict} sx={{ minWidth: '80vw' }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                                    {conflict}
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                        gap: 2
                                    }}
                                >
                                    {filteredHeroes.map((hero) => (
                                        <HeroCard key={hero.num}
                                                  id={hero.num}
                                                  firstName={hero.firstName} middleName={hero.middleName}
                                                  lastName={hero.lastName}
                                                  lifeDate={hero.lifeDate}
                                                  photo={hero.photo}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>

                <IconButton
                    onClick={() => handleScroll('right')}
                    sx={{
                        position: 'absolute',
                        right: -40,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        visibility: currentScroll < maxScroll ? 'visible' : 'hidden'
                    }}
                >
                    <KeyboardArrowRight />
                </IconButton>
            </Box>
        );
    }
);

export default HeroSlider;
