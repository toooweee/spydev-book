import { mockPageInfoList, PageInfo } from '../Helpers/MemoryFormPageHelpers';
import { useEffect, useState } from 'react';

export const useHeroPage = (id: number) => {
    const [hero, setHero] = useState<PageInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        // Имитируем задержку запроса (в будущем можно заменить на fetch/axios)
        setTimeout(() => {
            const foundHero = mockPageInfoList.find((item) => item.num === id) || null;
            setHero(foundHero);
            setLoading(false);
        }, 500); // Можно убрать задержку, если не нужна

    }, [id]);

    return { hero, loading }
}
