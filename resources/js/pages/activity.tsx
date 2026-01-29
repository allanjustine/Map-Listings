import { ReactNode } from 'react';
import { Activity } from '@/types/activity';
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from '@/components/ui/popover';
import fullDateFormat from '@/utils/full-date-format';

export function AvtivityPopOver({
    activities,
    children,
}: {
    activities?: Activity[];
    children?: ReactNode;
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent align="center">
                <PopoverHeader>
                    <PopoverTitle className="text-center">
                        ACTIVITIES
                    </PopoverTitle>
                    <PopoverDescription className="text-center">
                        Explore the activities available and their details.
                    </PopoverDescription>
                </PopoverHeader>
                <div className="mt-4">
                    {activities?.map((activity, index) => (
                        <div
                            key={index}
                            className="rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-800 flex flex-col gap-1"
                        >
                            <span className="text-xs font-thin italic self-center underline">
                                {fullDateFormat(activity.created_at)}
                            </span>
                            <h4 className="text-md font-semibold break-all whitespace-break-spaces">
                                {activity.name}
                            </h4>
                            <p className="text-sm break-all whitespace-break-spaces">
                                {activity.description}
                            </p>
                        </div>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
