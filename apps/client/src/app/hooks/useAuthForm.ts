import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { authValidationSchema, AuthFormValues } from '../validation/authValidation';

export const useAuth = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<AuthFormValues>({
        resolver: yupResolver(authValidationSchema),
    });

    return {
        register,
        handleSubmit,
        errors,
    };
};
