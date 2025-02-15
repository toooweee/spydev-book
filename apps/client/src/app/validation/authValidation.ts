import * as yup from 'yup';

export const authValidationSchema = yup.object({
    login: yup
        .string()
        .required('Это поле обязательно'),
    password: yup
        .string()
        .required('Это поле обязательно'),
});

export type AuthFormValues = yup.InferType<typeof authValidationSchema>;
