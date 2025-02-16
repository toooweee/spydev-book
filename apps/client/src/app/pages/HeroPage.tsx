import React, { FC, useMemo, useRef } from 'react';
import {
    Box,
    CircularProgress,
    Container,
    List,
    ListItem,
    Typography,
    Paper,
    Grid,
    Button,
} from '@mui/material';
import { useHeroPage } from '../actionPages/HeroPageActions';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useBlobUrl } from '../hooks/useBlobUrl';

const HeroPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const idNumber = Number(id);

    // Загружаем данные о герое с сервера (или из моков)
    const { hero, loading } = useHeroPage(idNumber);
    // Деструктуризация свойств героя
    const {
        photo,
        lastName,
        lifeDate,
        firstName,
        middleName,
        deathDate,
        doc,
        info,
        nagrads,
        raion,
        kontrakt,
    } = hero ?? {};
    // ref для области, которую будем конвертировать в PDF
    const pdfRef = useRef<HTMLDivElement>(null);
    const photoUrl = useBlobUrl(photo);
    const docUrls = useBlobUrl(doc);
    // Функция для генерации PDF
    const downloadPdf = async () => {
        if (pdfRef.current) {
            const canvas = await html2canvas(pdfRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('hero_page.pdf');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!hero) {
        return (
            <Container maxWidth="md">
                <Typography variant="h4" align="center" sx={{ mt: 4 }}>
                    Страница не найдена
                </Typography>
            </Container>
        );
    }


    // Преобразуем Blob в URL


    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!hero) {
        return (
            <Container maxWidth="md">
                <Typography variant="h4" align="center" sx={{ mt: 4 }}>
                    Страница не найдена
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button variant="contained" onClick={downloadPdf} sx={{ mb: 2 }}>
                Скачать PDF
            </Button>
            <div ref={pdfRef}>
                <Paper elevation={3} sx={{ p: 3, my: 4 }}>
                    {/* Верхняя часть: фото слева, информация справа */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            {photoUrl ? (
                                <Box
                                    component="img"
                                    src={photoUrl}
                                    alt={`${firstName ?? ''} ${lastName ?? ''}`}
                                    sx={{
                                        width: '100%',
                                        borderRadius: 2,
                                        boxShadow: 2,
                                    }}
                                />
                            ) : (
                                // Если фото отсутствует – placeholder-квадрат
                                <Box
                                    sx={{
                                        width: '100%',
                                        height: 0,
                                        paddingTop: '100%', // создаёт квадрат
                                        backgroundColor: '#e0e0e0',
                                        borderRadius: 2,
                                    }}
                                />
                            )}
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                {firstName} {middleName} {lastName}
                            </Typography>
                            {dayjs(lifeDate).format('DD.MM.YYYY')} && {(
                            <Typography variant="subtitle1" gutterBottom>
                                {dayjs(deathDate).format('DD.MM.YYYY')}
                            </Typography>
                        )}
                            {raion && (
                                <Typography variant="subtitle2" gutterBottom>
                                    {raion}
                                </Typography>
                            )}
                            {info && (
                                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                                    {info}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>

                    {/* Дополнительная информация */}
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Места конфликтов:</strong>
                        </Typography>
                        {Array.isArray(kontrakt) && kontrakt.length > 0 ? (
                            <List>
                                {kontrakt.map((item, index) => (
                                    <ListItem key={index} sx={{ pl: 0 }}>
                                        {item}
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Не найдено
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Награды:</strong> {nagrads || '—'}
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Документы:</strong>
                        </Typography>
                        {Array.isArray(docUrls) && docUrls.length > 0 ? (
                            <Grid container spacing={2}>
                                {docUrls.map((docUrl, index) => (
                                    <Grid item xs={6} sm={4} md={3} key={index}>
                                        <Box sx={{ borderRadius: 1, boxShadow: 1, overflow: 'hidden' }}>
                                            <img
                                                src={docUrl}
                                                alt={`Document ${index + 1}`}
                                                style={{ width: '100%', display: 'block' }}
                                            />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Документы не найдены
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </div>
        </Container>
    );
};

export default HeroPage;
