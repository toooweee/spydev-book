import { Route, Routes } from 'react-router-dom';
import { FC } from 'react';
import { RProps } from '../routes';

interface Props {
    links: RProps[]
}

const AppRouter: FC<Props> = ({links}) => {
    return (
        <Routes>
            {links.map((link) => (
                <Route key={link.path} path={link.path} element={<link.element/>}/>
            ))}
        </Routes>
    );
};

export default AppRouter;
