import { Dayjs } from 'dayjs';

export interface PageInfo {
    info: string;
    num: number;
    lifeDate: Dayjs | null;
    deathDate: Dayjs | null;
    firstName: string;
    middleName: string;
    lastName: string;
    photo?: Blob;
    doc: Blob[];
    kontrakt: Conflict[];
    nagrads: string;
    raion: string;
}

export enum Conflict {
    GreatPatrioticWar = "Великая отечественная война",
    AfghanWar = "Боевые действия в Афганистане",
    ChechenConflict = "Вооруженный конфликт в Чеченской Республике и на прилегающих к ней территориях Российской Федерации",
    SyriaOperations = "Выполнение специальных задач на территории Сирийской Арабской Республики",
    TajikistanOperations = "Выполнение специальных задач на территории Таджикистана, Ингушетии, в Грузино-Абхазских событиях",
    UkraineSpecialOperation = "Специальная военная операция на Украине"
}

// export const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file && file.type.startsWith('image/')) {
//         setPageInfo(prev => ({ ...prev, photo: file }));
//         setPhotoPreview(URL.createObjectURL(file));
//     }
// };

export const heroes = [
    {
        id: '1',
        firstName: 'Иван',
        middleName: 'Иванович',
        lastName: 'Петров',
        lifeDate: null,
        photo: undefined,
    },
    {
        id: '2',
        firstName: 'Александр',
        middleName: 'Сергеевич',
        lastName: 'Сидоров',
        lifeDate: null,
        photo: undefined,
    },
    {
        id: '3',
        firstName: 'Мария',
        middleName: 'Александровна',
        lastName: 'Кузнецова',
        lifeDate: null,
        photo: undefined,
    },
];
