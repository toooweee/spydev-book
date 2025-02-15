import { useForm } from 'react-hook-form';
import { FormValues, validationSchema } from '../validation/regValidation';
import { yupResolver } from '@hookform/resolvers/yup';

export const useRegForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        setValue,
    } = useForm<FormValues>({
        resolver: yupResolver(validationSchema),
    });

    return {
        register,
        handleSubmit,
        errors,
        setValue,
    };
};
