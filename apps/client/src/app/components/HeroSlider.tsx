import React from 'react';
import Slider from 'react-slick';
import HeroCard from './HeroCard';
import { Box } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Dayjs } from 'dayjs';

interface Hero {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    lifeDate: Dayjs | null;
    photo?: Blob;
}

interface HeroSliderProps {
    heroes: Hero[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ heroes }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };

    return (
        <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
            <Slider {...settings}>
                {heroes.map((hero) => (
                    <HeroCard key={hero.id} {...hero} />
                ))}
            </Slider>
        </Box>
    );
};

export default HeroSlider;
