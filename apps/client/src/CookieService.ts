class CookieService {
    /**
     * Устанавливает cookie с указанным именем, значением и опциями.
     * @param name - Имя cookie
     * @param value - Значение cookie
     * @param options - Дополнительные опции (expires, path, secure, httpOnly)
     */
    public setCookie(name: string, value: string, options: CookieOptions = {}): void {
        const { expires, path, secure, sameSite } = options;

        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (expires instanceof Date) {
            cookieString += `; expires=${expires.toUTCString()}`;
        }

        if (path) {
            cookieString += `; path=${path}`;
        }

        if (secure) {
            cookieString += '; secure';
        }

        if (sameSite) {
            cookieString += `; SameSite=${sameSite}`;
        }

        document.cookie = cookieString;
    }

    /**
     * Читает значение cookie по имени.
     * @param name - Имя cookie
     * @returns Значение cookie или null, если cookie не существует
     */
    public getCookie(name: string): string | null {
        const cookies = document.cookie.split('; ').find((cookie) => {
            return cookie.startsWith(`${encodeURIComponent(name)}=`);
        });

        if (cookies) {
            const value = cookies.split('=')[1];
            return decodeURIComponent(value);
        }

        return null;
    }

    /**
     * Проверяет, существует ли cookie с указанным именем.
     * @param name - Имя cookie
     * @returns true, если cookie существует, иначе false
     */
    public hasCookie(name: string): boolean {
        return this.getCookie(name) !== null;
    }

    /**
     * Удаляет cookie с указанным именем.
     * @param name - Имя cookie
     * @param options - Дополнительные опции (path)
     */
    public deleteCookie(name: string, options: { path?: string } = {}): void {
        const { path } = options;

        const cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;

        if (path) {
            document.cookie = `${cookieString}; path=${path}`;
        } else {
            document.cookie = cookieString;
        }
    }
}

interface CookieOptions {
    expires?: Date;
    path?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}
