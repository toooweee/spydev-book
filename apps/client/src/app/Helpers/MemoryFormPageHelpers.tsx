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
    kontrakt: string;
    nagrads: string;
    raion: string;
}

// export const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file && file.type.startsWith('image/')) {
//         setPageInfo(prev => ({ ...prev, photo: file }));
//         setPhotoPreview(URL.createObjectURL(file));
//     }
// };
