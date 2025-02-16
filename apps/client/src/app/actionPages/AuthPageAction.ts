import { AuthFormValues } from '../validation/authValidation';
import { authRequestDTO } from '../Helpers/AuthHelpers';
import { login } from '../Service/AuthService';

export const onSubmit = async (data: AuthFormValues) => {
    if (data) {
        const dto: authRequestDTO = {
            email: data.login,
            password: data.password,
        };
        login(dto);
    }
};
