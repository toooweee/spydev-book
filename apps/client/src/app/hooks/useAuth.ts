import { useEffect, useState } from 'react';
import { UserRole } from '../components/HeaderL';

export const useAuth = () => {

    const [user, setUser] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<UserRole>(UserRole.default); // роль пользователя

    useEffect(() => {
        const checkToken = () => setUser(!!localStorage.getItem("token"));

        checkToken()

        window.addEventListener("storage", checkToken);
        return () => window.removeEventListener("storage", checkToken);
    }, [])

    return { user, userRole }
}
