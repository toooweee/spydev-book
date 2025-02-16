import React, { useState } from 'react';
import dayjs from 'dayjs';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    ButtonGroup, Box,
} from '@mui/material';
import { Application, RequestStatus } from '../Helpers/ApplicationHelpers';

interface ApplicationsTableProps {
    applications: Application[];
    onSubmitApplication: (id: string) => void;
    onCancelApplication: (id: string) => void;
}

const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
                                                                 applications,
                                                                 onSubmitApplication,
                                                                 onCancelApplication,
                                                             }) => {
    // Состояние для выбранного фильтра по статусу
    // 'ALL' означает, что отображаются все заявки
    const [filterStatus, setFilterStatus] = useState<RequestStatus | 'ALL'>('ALL');

    // Фильтрация заявок по выбранному статусу
    const filteredApplications =
        filterStatus === 'ALL'
            ? applications
            : applications.filter((app) => app.status === filterStatus);

    return (
        <Box>
            {/* Панель фильтрации по статусу */}
            <Box sx={{ mb: 2 }}>
                <ButtonGroup variant="outlined" color="secondary">
                    <Button
                        onClick={() => setFilterStatus('ALL')}
                        variant={filterStatus === 'ALL' ? 'contained' : 'outlined'}
                    >
                        Все
                    </Button>
                    <Button
                        onClick={() => setFilterStatus(RequestStatus.PENDING)}
                        variant={filterStatus === RequestStatus.PENDING ? 'contained' : 'outlined'}
                    >
                        В ожидании
                    </Button>
                    <Button
                        onClick={() => setFilterStatus(RequestStatus.APPROVED)}
                        variant={filterStatus === RequestStatus.APPROVED ? 'contained' : 'outlined'}
                    >
                        Одобрено
                    </Button>
                    <Button
                        onClick={() => setFilterStatus(RequestStatus.REJECTED)}
                        variant={filterStatus === RequestStatus.REJECTED ? 'contained' : 'outlined'}
                    >
                        Отклонено
                    </Button>
                </ButtonGroup>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Отдел</TableCell>
                            <TableCell>ФИО</TableCell>
                            <TableCell>Рег. данные</TableCell>
                            <TableCell>Дата создания</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Комментарий</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredApplications.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell>{app.id}</TableCell>
                                <TableCell>
                                    {app.government} {app.governmentName && `/ ${app.governmentName}`}
                                </TableCell>
                                <TableCell>
                                    {app.name} {app.surname}
                                </TableCell>
                                <TableCell>
                                    {app.email}
                                    <br />
                                    {app.phoneNumber}
                                    <br />
                                    {app.password}
                                </TableCell>
                                <TableCell>{dayjs(app.createdAt).format('DD.MM.YYYY')}</TableCell>
                                <TableCell>{app.status}</TableCell>
                                <TableCell>{app.adminComment}</TableCell>
                                <TableCell>
                                    <ButtonGroup variant="text" color="primary">
                                        <Button onClick={() => onSubmitApplication(app.id)}>Принять</Button>
                                        <Button onClick={() => onCancelApplication(app.id)}>Отклонить</Button>
                                    </ButtonGroup>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ApplicationsTable;
