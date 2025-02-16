export interface FormData {
    email: string;
    password: string;
    repeatPassword?: string;
}

export interface authRequestDTO {
    email: string;
    password: string
}

export interface regRequestDTO {
    email: string;
    government: string;
    governmentName: string;
    name: string;
    surname: string;
    phoneNumber: string;
}

export interface registerResponseDTO {
    id: string;
    email: string;
    government: string;
    governmentName: string;
    name: string;
    surname: string;
    phoneNumber: string;
    createdAt: string; // или Date, если парсите на фронте
    status: string;    // при желании можно сделать enum
    adminComment: string | null;
}

export interface loginResponseDTO {
    accessToken: string;
    refreshToken: string;
}


export const validateFormData = (formData: FormData) => {
    const newErrors: Partial<FormData> | null = {
        email: '',
        password: '',
        repeatPassword: '',
    };

    if (!formData.email) {
        newErrors.email = 'Email обязателен';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Некорректный email';
    }

    if (!formData.password) {
        newErrors.password = 'Пароль обязателен';
    } else if (formData.password.length < 6) {
        newErrors.password = 'Пароль должен содержать не менее 6 символов';
    }

    if (formData.repeatPassword) {
        if (!formData.repeatPassword) {
            newErrors.repeatPassword = 'Подтверждение пароля обязательно';
        } else if (formData.repeatPassword !== formData.password) {
            newErrors.repeatPassword = 'Пароли не совпадают';
        }
    }

    return newErrors;
};
