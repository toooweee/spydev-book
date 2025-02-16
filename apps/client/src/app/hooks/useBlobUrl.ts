import { useEffect, useState } from "react";

// Перегрузка для одиночного Blob
export function useBlobUrl(blob?: Blob): string | undefined;

// Перегрузка для массива Blob[]
export function useBlobUrl(blobs?: Blob[]): string[];

// Основная реализация
export function useBlobUrl(blobOrBlobs?: Blob | Blob[]): string | string[] | undefined {
    const [urls, setUrls] = useState<string | string[] | undefined>();

    useEffect(() => {
        // Очистка URL при каждом изменении
        if (!blobOrBlobs) {
            setUrls(undefined);
            return;
        }

        if (Array.isArray(blobOrBlobs)) {
            // Если передан массив Blob[]
            const objectUrls = blobOrBlobs.map((blob) => URL.createObjectURL(blob));
            setUrls(objectUrls);

            return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
        } else {
            // Если передан одиночный Blob
            const objectUrl = URL.createObjectURL(blobOrBlobs);
            setUrls(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [blobOrBlobs]);

    return urls;
}
