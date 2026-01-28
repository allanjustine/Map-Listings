import { router, usePage } from '@inertiajs/react';
import L from 'leaflet';
import { ChangeEvent, FormEvent, useState } from 'react';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
} from 'react-leaflet';
import { AlertDialogDelete } from '@/components/alert-dialog-delete';
import InputError from '@/components/input-error';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useToast from '@/hooks/use-toast';

interface MarkerType {
    id: number;
    lat: number;
    lng: number;
    name: string;
    icon: string | null;
}

const ClickHandler = ({
    onClick,
}: {
    onClick: (latlng: { lat: number; lng: number }) => void;
}) => {
    useMapEvents({
        click(e) {
            onClick(e.latlng);
        },
    });
    return null;
};

const App = ({ coordinates }: { coordinates: MarkerType[] }) => {
    const flash: { error?: string; success?: string } = usePage()?.props?.flash;
    useToast(flash);
    const [open, setOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<{ title?: string; icon?: string }>({
        title: '',
        icon: '',
    });
    const [latlng, setLatlng] = useState<{
        lat: number;
        lng: number;
        title: string;
        icon: FileList | null;
    }>({
        lat: 0,
        lng: 0,
        title: '',
        icon: null,
    });
    const [id, setId] = useState<number>(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    const addMarker = (latlng: { lat: number; lng: number }) => {
        setOpen(true);
        setLatlng(() => ({ ...latlng, title: '', icon: null }));
    };

    const handleSave = () => (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('lat', latlng.lat.toString());
        formData.append('lng', latlng.lng.toString());
        formData.append('title', latlng.title);
        if (latlng.icon) {
            formData.append('icon', latlng.icon[0]);
        }
        router.post(route('coordinates.store'), formData, {
            preserveScroll: true,
            replace: true,
            onSuccess: () => setOpen(false),
            onBefore: () => setIsLoading(true),
            onFinish: () => setIsLoading(false),
            onError: (errors) => {
                setError(errors);
            },
        });
    };

    const handleDeleteMarker = (id: number) => () => {
        setDeleteDialogOpen(true);
        setId(id);
    };

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <form onSubmit={handleSave()}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Add Marker Name</AlertDialogTitle>
                            <div className="w-full space-y-2">
                                <Label htmlFor="title">Enter marker name</Label>
                                <Input
                                    type="text"
                                    value={latlng.title}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        setLatlng({
                                            ...latlng,
                                            title: e.target.value,
                                        })
                                    }
                                    placeholder="Enter marker name"
                                />
                                <InputError message={error?.title} />
                            </div>
                            <div className="w-full space-y-2">
                                <Label htmlFor="icon">Marker Icon</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) =>
                                        setLatlng({
                                            ...latlng,
                                            icon: e.target.files,
                                        })
                                    }
                                />
                                <InputError message={error?.icon} />
                            </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button disabled={isLoading} type="submit">
                                {isLoading ? 'Saving...' : 'Save Marker'}
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
            <MapContainer
                center={coordinates[0] ?? [12.157802, 122.705489]}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                <ClickHandler
                    onClick={(latlng) => {
                        addMarker(latlng);
                    }}
                />
                {coordinates.map((m, index) => (
                    <Marker
                        key={index}
                        position={m}
                        icon={L.icon({
                            iconUrl: m?.icon
                                ? route('storage.local', m?.icon)
                                : 'https://cdn-icons-png.flaticon.com/512/1176/1176403.png',
                            iconSize: [35, 45],
                            iconAnchor: [17, 45],
                            popupAnchor: [0, -40],
                        })}
                    >
                        <Popup>
                            <div className="space-y-2">
                                <p className="text-lg font-bold text-gray-600">
                                    {m.name}
                                </p>
                                <Button
                                    type="button"
                                    onClick={handleDeleteMarker(m.id)}
                                    variant={'destructive'}
                                >
                                    Delete Marker
                                </Button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            <AlertDialogDelete
                open={deleteDialogOpen}
                setOpen={setDeleteDialogOpen}
                id={id}
                setId={setId}
            />
        </div>
    );
};

export default App;
