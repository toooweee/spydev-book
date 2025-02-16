import React from 'react';
import {
    Box,
    Button,
    CardContent,
    Container,
    FormControl,
    TextField,
    Typography,
    Autocomplete,
    Chip,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { useFileChange } from '../actionPages/MemoryFormPageActions';
import UploadPhoto from '../components/UploadPhoto';
import { Conflict, OrenburgMunicipalities } from '../Helpers/MemoryFormPageHelpers';

const MemoryFormPage: React.FC = () => {
    const { handleFileChange, photoPreview, pageInfo, setPageInfo } = useFileChange();

    return (
        <Container maxWidth="md">
            <Box>
                <CardContent>
                    <Typography variant="h1" align="center" gutterBottom>
                        Создание страницы
                    </Typography>
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'center' }}>
                            <UploadPhoto />

                            <FormControl fullWidth sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField
                                    label="Имя"
                                    variant="outlined"
                                    value={pageInfo.firstName}
                                    onChange={(e) => setPageInfo({ ...pageInfo, firstName: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    label="Фамилия"
                                    variant="outlined"
                                    value={pageInfo.middleName}
                                    onChange={(e) => setPageInfo({ ...pageInfo, middleName: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    label="Отчество"
                                    variant="outlined"
                                    value={pageInfo.lastName}
                                    onChange={(e) => setPageInfo({ ...pageInfo, lastName: e.target.value })}
                                    fullWidth
                                />
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                        <DatePicker
                                            label="Дата рождения"
                                            value={pageInfo.lifeDate}
                                            onChange={(newValue: Dayjs | null) =>
                                                setPageInfo((prev) => ({ ...prev, lifeDate: newValue || prev.lifeDate }))
                                            }
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                        <DatePicker
                                            label="Дата смерти"
                                            value={pageInfo.deathDate}
                                            onChange={(newValue: Dayjs | null) =>
                                                setPageInfo((prev) => ({ ...prev, deathDate: newValue || prev.deathDate }))
                                            }
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    </Box>
                                </LocalizationProvider>
                                <Autocomplete
                                    options={Object.values(OrenburgMunicipalities)}
                                    value={pageInfo.raion}
                                    onChange={(event, newValue) => {
                                        setPageInfo((prev) => ({ ...prev, region: newValue }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Регои" placeholder="Регои" />
                                    )}
                                />
                            </FormControl>
                        </Box>

                        <FormControl fullWidth>
                            <Typography variant="h2" gutterBottom>
                                Конфликты
                            </Typography>
                            <Autocomplete
                                multiple
                                options={Object.values(Conflict)}
                                value={pageInfo.kontrakt}
                                onChange={(event, newValue) => {
                                    setPageInfo((prev) => ({ ...prev, kontrakt: newValue }));
                                }}
                                renderTags={(value: readonly string[], getTagProps) =>
                                    value.map((option: string, index: number) => (
                                        <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField {...params} label="Выберите конфликты" placeholder="Конфликты" />
                                )}
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <Typography variant="h2">История героя</Typography>
                            <TextField
                                label="История"
                                variant="outlined"
                                multiline
                                rows={4}
                                value={pageInfo.info}
                                onChange={(e) => setPageInfo({ ...pageInfo, info: e.target.value })}
                                fullWidth
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <Typography variant="h2" gutterBottom>
                                Награды
                            </Typography>
                            <TextField
                                label="Награды"
                                variant="outlined"
                                value={pageInfo.nagrads}
                                onChange={(e) => setPageInfo({ ...pageInfo, nagrads: e.target.value })}
                                fullWidth
                            />
                            <Button variant="contained" component="label" sx={{mt: '1rem'}}>
                                Загрузить фото
                                <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                            </Button>
                            {photoPreview && (
                                <Box mt={2} display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
                                    {pageInfo.doc.map((blob, index) => {
                                        const blobUrl = URL.createObjectURL(blob);
                                        return (
                                            <img
                                                key={index}
                                                src={blobUrl}
                                                alt={`preview-${index}`}
                                                style={{ maxHeight: '200px', maxWidth: '100%' }}
                                            />
                                        );
                                    })}
                                </Box>
                            )}
                        </FormControl>

                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Сохранить
                        </Button>
                    </Box>
                </CardContent>
            </Box>
        </Container>
    );
};

export default MemoryFormPage;
