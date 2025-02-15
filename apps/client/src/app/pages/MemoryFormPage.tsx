import React from 'react';
import {
    Box,
    Button,
    CardContent,
    Container,
    FormControl,
    TextField,
    Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { useFileChange } from '../actionPages/MemoryFormPageActions';
import UploadPhoto from '../components/UploadPhoto';

const MemoryFormPage: React.FC = () => {

    const {handleFileChange, photoPreview, pageInfo, setPageInfo} = useFileChange();

    return (
        <Container maxWidth="lg">
            <Box >
                    <CardContent>
                        <Typography variant="h1" align="center" gutterBottom>
                            Создание страницы
                        </Typography>
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box
                                sx={{display: 'flex', gap: 2, alignItems: 'center'}}
                            >
                                {/* Загрузка фото */}
                                <UploadPhoto/>

                                {/* ФИО */}
                                <FormControl fullWidth
                                    sx={{display: 'flex', flexDirection: 'column', gap: 3}}
                                >
                                    <TextField
                                        label="Имя"
                                        variant="outlined"
                                        value={pageInfo.firstName}
                                        onChange={(e) =>
                                            setPageInfo({ ...pageInfo, firstName: e.target.value })
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Фамилия"
                                        variant="outlined"
                                        value={pageInfo.middleName}
                                        onChange={(e) =>
                                            setPageInfo({ ...pageInfo, middleName: e.target.value })
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        label="Отчество"
                                        variant="outlined"
                                        value={pageInfo.lastName}
                                        onChange={(e) =>
                                            setPageInfo({ ...pageInfo, lastName: e.target.value })
                                        }
                                        fullWidth
                                    />

                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Box
                                            sx={{display: 'flex', gap: 3}}
                                        >
                                            <DatePicker
                                                label="Дата рождения"
                                                value={pageInfo.deathDate}
                                                onChange={(newValue: Dayjs | null) =>
                                                    setPageInfo(prev => ({ ...prev, lifeDate: newValue }))
                                                }
                                                slotProps={{ textField: { fullWidth: true } }}
                                            />
                                            <DatePicker
                                                label="Дата смерти"
                                                value={pageInfo.deathDate}
                                                onChange={(newValue: Dayjs | null) =>
                                                    setPageInfo(prev => ({ ...prev, lifeDate: newValue }))
                                                }
                                                slotProps={{ textField: { fullWidth: true } }}
                                            />
                                        </Box>

                                    </LocalizationProvider>
                                    <TextField
                                        label="Район"
                                        variant="outlined"
                                        value={pageInfo.raion}
                                        onChange={(e) =>
                                            setPageInfo({ ...pageInfo, raion: e.target.value })
                                        }
                                        fullWidth
                                    />
                               </FormControl>
                            </Box>


                            {/* Описание */}
                            <FormControl fullWidth
                                sx={{display: 'flex', flexDirection: 'column', gap: 1}}
                            >
                                <Typography variant='h2'>История героя</Typography>
                                <TextField
                                    label="Описание"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    value={pageInfo.info}
                                    onChange={(e) =>
                                        setPageInfo({ ...pageInfo, info: e.target.value })
                                    }
                                    fullWidth
                                />
                            </FormControl>

                            <FormControl fullWidth>
                                <Typography variant='h2' gutterBottom>Награды</Typography>
                                <Box
                                    sx={{display: 'flex', gap: 3}}
                                >
                                    <TextField
                                        label="Награды"
                                        variant="outlined"
                                        value={pageInfo.nagrads}
                                        onChange={(e) =>
                                            setPageInfo({ ...pageInfo, nagrads: e.target.value })
                                        }
                                        fullWidth
                                    />
                                    {/* Загрузка фото */}
                                    <FormControl>
                                        <Button variant="contained" component="label">
                                            Загрузить фото
                                            <input
                                                type="file"
                                                accept="image/jpeg, image/jpg, image/png"
                                                hidden
                                                onChange={handleFileChange}
                                            />
                                        </Button>
                                    </FormControl>
                                </Box>
                                {photoPreview && (
                                    <Box mt={2} display="flex" justifyContent="center">
                                        {pageInfo.doc.map((blob, index) => {
                                            const blobUrl = URL.createObjectURL(blob);
                                            return (
                                                <img
                                                    key={index} // Используем индекс как ключ (лучше использовать уникальный идентификатор, если есть)
                                                    src={blobUrl}
                                                    alt={`preview-${index}`}
                                                    style={{ margin: '5px', maxHeight: '300px', maxWidth: '200px'}} // Добавляем немного отступа между изображениями
                                                />
                                            );
                                        })}
                                    </Box>
                                )}
            </FormControl>

            {/* Кнопка для сохранения */}
            <Button variant="contained" color="primary" type="submit">
                Сохранить
            </Button>
                        </Box>
                    </CardContent>
            </Box>
        </Container>
    );
};

export default MemoryFormPage;
