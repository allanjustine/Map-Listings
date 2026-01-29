import { router } from '@inertiajs/react';
import { Dispatch, SetStateAction } from 'react';
import { MarkerType } from '@/types/marker';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from './input-error';
import { Textarea } from './ui/textarea';

const schema = z.object({
    name: z
        .string()
        .min(1, 'Name is required')
        .max(50, 'Name must be less than 50 characters')
        .nonempty(),
    description: z
        .string()
        .min(1, 'Description is required')
        .max(100, 'Description must be less than 100 characters')
        .nonempty(),
});

type FormData = z.infer<typeof schema>;

export function AddActivity({
    open,
    setOpen,
    markerItem,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    markerItem?: MarkerType;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        return new Promise((resolve) => {
            router.post(
                route('activities.store'),
                {
                    coordinate_id: markerItem?.id,
                    ...data,
                },
                {
                    preserveScroll: true,
                    replace: true,
                    onSuccess: () => {
                        setOpen(false);
                        resolve(true);
                        reset();
                    },
                },
            );
        });
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-106.25">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <DialogHeader>
                        <DialogTitle>
                            Add Activity to {markerItem?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Enter the activity details below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name">Your name</Label>
                            <Input
                                placeholder="Enter your name"
                                {...register('name')}
                            />
                            <InputError message={errors?.name?.message} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                placeholder="Enter your activity description (max 100 characters)"
                                maxLength={100}
                                className="h-25 resize-none"
                                {...register('description')}
                            />
                            <InputError
                                message={errors?.description?.message}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
