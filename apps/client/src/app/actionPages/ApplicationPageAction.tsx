import React from 'react';
import { applications } from '../Helpers/ApplicationHelpers';

export const useApplication = () => {

    const [searchTerm, setSearchTerm] = React.useState('');

    const handleSubmitApplication = (id: string) => {
        console.log('Принята заявка с id', id);
    };

    const handleCancelApplication = (id: string) => {
        console.log('Отклонена заявка с id', id);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredApplications = applications.filter((application) =>
        application.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return {handleSubmitApplication, handleCancelApplication, handleSearchChange, filteredApplications, searchTerm}
}
