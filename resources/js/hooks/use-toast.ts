import { useEffect } from 'react';
import { toast } from 'sonner';

export default function useToast(flash: { error?: string; success?: string }) {
    useEffect(() => {
        if (!flash) return;

        if (flash?.success) {
            toast.success('Success', {
                description: flash?.success,
                duration: 5000,
                position: 'bottom-center',
            });
        }

        if (flash?.error) {
            toast.error('Error', {
                description: flash?.error,
                duration: 5000,
                position: 'bottom-center',
            });
        }
    }, [flash]);
}
