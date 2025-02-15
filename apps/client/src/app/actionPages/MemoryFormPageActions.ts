import { ChangeEvent, useState } from 'react';
import { PageInfo } from '../Helpers/MemoryFormPageHelpers';
import dayjs from 'dayjs';

export const useFileChange = () => {

    const [pageInfo, setPageInfo] = useState<PageInfo>({
        info: '',
        num: 0,
        lifeDate: dayjs(),
        deathDate: dayjs(),
        firstName: '',
        middleName: '',
        lastName: '',
        doc: [],
        kontrakt: [],
        nagrads:'',
        raion: ''
    });
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setPhotoPreview(URL.createObjectURL(file));
            setPageInfo(prev => ({ ...prev, doc: [...(prev.doc || []), file]}));
        }
    };
    return {handleFileChange, photoPreview, pageInfo, setPageInfo}
}



