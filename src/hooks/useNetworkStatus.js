import { useEffect, useState } from 'react';

export default function useNetworkStatus(syncCallback) {
    const [status, setStatus] = useState('online');

    const checkServerOnline = async () => {
        try {
            const response = await fetch('http://56.228.23.174:8080/api/books/ping');
            return response.ok;
        } catch {
            return false;
        }
    };

    useEffect(() => {
        const updateStatus = async () => {
            const isOnline = navigator.onLine;
            const isServerUp = isOnline && await checkServerOnline();

            if (!isOnline) setStatus('offline');
            else if (!isServerUp) setStatus('server-down');
            else {
                setStatus('online');
                syncCallback?.();
            }
        };

        window.addEventListener('online', updateStatus);
        window.addEventListener('offline', updateStatus);
        updateStatus();

        return () => {
            window.removeEventListener('online', updateStatus);
            window.removeEventListener('offline', updateStatus);
        };
    }, []);

    return status;
}

export const queueOperation = (operation) => {
    const existing = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
    localStorage.setItem('offlineQueue', JSON.stringify([...existing, operation]));
};

export const syncQueuedOperations = async () => {
    const queued = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
    const remaining = [];
    for (const op of queued) {
        try {
            const res = await fetch(op.url, {
                method: op.method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(op.body),
            });
            if (!res.ok) throw new Error('Failed');
        } catch {
            remaining.push(op);
        }
    }
    localStorage.setItem('offlineQueue', JSON.stringify(remaining));
};
