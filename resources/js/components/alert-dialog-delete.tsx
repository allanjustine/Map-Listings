import { router } from '@inertiajs/react';
import { Dispatch, SetStateAction, useState } from 'react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';

export function AlertDialogDelete({
    open,
    setOpen,
    id,
    setId,
}: {
    open: boolean;
    id: number;
    setId: Dispatch<SetStateAction<number>>;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleDelete = () => {
        router.delete(route('coordinates.destroy', id), {
            preserveScroll: true,
            replace: true,
            onBefore: () => setIsLoading(true),
            onFinish: () => {
                setIsLoading(false);
                setOpen(false);
                setId(0);
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This marker will
                        permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                        disabled={isLoading}
                        type="button"
                        onClick={handleDelete}
                        variant={'destructive'}
                    >
                        {isLoading ? 'Deleting...' : 'Yes, Delete!'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
