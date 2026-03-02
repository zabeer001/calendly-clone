import { useEffect, useState } from 'react';
import {
    clearSession,
    getAccessToken,
    refreshToken,
} from '../apiClient';

export default function useAuthHook() {
    const [isBootstrapping, setIsBootstrapping] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const verifySession = async () => {
            const token = getAccessToken();

            if (!token) {
                window.location.href = '/sign-in';
                return;
            }

            try {
                await refreshToken();

                if (isMounted) {
                    setIsBootstrapping(false);
                }
            } catch (error) {
                clearSession();
                window.location.href = '/sign-in';
            }
        };

        verifySession();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        isBootstrapping,
    };
}
