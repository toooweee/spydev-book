import React, { FC } from 'react';
import dayjs from 'dayjs';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, ButtonGroup } from '@mui/material';
import { Application as AProps } from '../Helpers/ApplicationHelpers';

const Application: FC<AProps> = ({
                                               id,
                                               email,
                                               password,
                                               government,
                                               governmentName,
                                               name,
                                               surname,
                                               phoneNumber,
                                               createdAt,
                                               status,
                                               adminComment,
                                           }) => {
    function SubmitApplication() {}
    function CancelApplication() {}

    return (
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
                    <TableRow>
                        <TableCell>{id}</TableCell>
                        <TableCell>{government} / {governmentName}</TableCell>
                        <TableCell>{name} {surname}</TableCell>
                        <TableCell>{email}<br />{phoneNumber}</TableCell>
                        <TableCell>{dayjs(createdAt).format('DD.MM.YYYY')}</TableCell>
                        <TableCell>{status}</TableCell>
                        <TableCell>{adminComment}</TableCell>
                        <TableCell>
                            <ButtonGroup>
                                <Button onClick={SubmitApplication}>Принять</Button>
                                <Button onClick={CancelApplication}>Отклонить</Button>
                            </ButtonGroup>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default Application;
