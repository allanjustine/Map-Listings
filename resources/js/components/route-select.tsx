import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    NativeSelect,
    NativeSelectOption,
} from '@/components/ui/native-select';
import { MarkerType } from '@/types/marker';
import { Label } from './ui/label';

export function RouteSelect({
    open,
    setOpen,
    coordinates,
    setRoutes,
    proceedItems,
    setProceedItems,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    coordinates: MarkerType[];
    setRoutes: Dispatch<
        SetStateAction<{
            start: MarkerType[];
            end: MarkerType[];
        }>
    >;
    proceedItems: {
        start: MarkerType[];
        end: MarkerType[];
    };
    setProceedItems: Dispatch<
        SetStateAction<{
            start: MarkerType[];
            end: MarkerType[];
        }>
    >;
}) {
    const selects = ['Select Start Point', 'Select End Point'];

    const handleChange =
        (index: number) => (e: ChangeEvent<HTMLSelectElement>) => {
            const { value } = e.target;
            setProceedItems((prev) => ({
                ...prev,
                [index === 0 ? 'start' : 'end']: coordinates?.filter(
                    (item) => item.id === Number(value),
                ),
            }));
        };

    const handleProceed = () => {
        setOpen(false);
        setRoutes(proceedItems);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <div className="flex w-full gap-2">
                        {selects.map((item, index) => (
                            <div className="w-full space-y-2" key={index}>
                                <Label className="mb-2">{item}</Label>
                                <NativeSelect
                                    className="w-full h-12"
                                    onChange={handleChange(index)}
                                    value={
                                        index === 0
                                            ? proceedItems.start.length > 0
                                                ? proceedItems.start[0].id
                                                : ''
                                            : proceedItems.end.length > 0
                                              ? proceedItems.end[0].id
                                              : ''
                                    }
                                >
                                    <NativeSelectOption value="" disabled>
                                        Select status
                                    </NativeSelectOption>
                                    {coordinates?.map((item, index) => (
                                        <NativeSelectOption
                                            value={item.id}
                                            key={index}
                                        >
                                            {item.name}
                                        </NativeSelectOption>
                                    ))}
                                </NativeSelect>
                            </div>
                        ))}
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button type="button" onClick={handleProceed}>
                        Proceed
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
