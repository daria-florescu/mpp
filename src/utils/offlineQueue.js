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
