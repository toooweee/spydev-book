import AuthPage from '../pages/AuthPage';
import MainPage from '../pages/MainPage';
import RegPage from '../pages/RegPage';
import MapPage from '../pages/MapPage';
import { JSX } from 'react';
import PersonalAccountPage from '../pages/PersonalAccountPage';

export interface RProps {
    path: string;
    element: React.FC;
    exact: boolean;
    name?: string;
}

export const routes: RProps[] = [
    {path: '/', element: MainPage, exact: true},
    {path: '/auth', element: AuthPage, exact: true},
    {path: '/reg', element: RegPage, exact: true},
    {path: '/map', element: MapPage, exact: true},
    {path: '/user/:id', element: PersonalAccountPage, exact: true},
]
