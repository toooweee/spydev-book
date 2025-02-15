import * as yup from 'yup';

export const validationSchema = yup.object({
    organization: yup.string().required('Это поле обязательно'),
    departmentName: yup.string().required('Это поле обязательно'),
    firstName: yup.string().required('Это поле обязательно'),
    lastName: yup.string().required('Это поле обязательно'),
    middleName: yup.string().optional(), // Отчество необязательно
    phone: yup
        .string()
        .matches(/^\+?[0-9]{10,15}$/, 'Неверный формат номера')
        .required('Это поле обязательно'),
    email: yup
        .string()
        .email('Неверный формат email')
        .required('Это поле обязательно'),
});

export type FormValues = yup.InferType<typeof validationSchema>;
