import { router, usePage } from '@inertiajs/react';
import { ArrowUpRightIcon } from 'lucide-react';
import L from 'leaflet';
import { AddActivity } from '@/components/add-activity';
import { Activity, ChangeEvent, FormEvent, useState } from 'react';
import { MarkerType } from '@/types/marker';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMapEvents,
    LayersControl,
} from 'react-leaflet';
import { AlertDialogDelete } from '@/components/alert-dialog-delete';
import InputError from '@/components/input-error';
import { RouteSelect } from '@/components/route-select';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Routing from '@/hooks/use-routing';
import useToast from '@/hooks/use-toast';
import IconDefault from '@/utils/icon-default';
import { AvtivityPopOver } from './activity';

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
    const [openAddActivity, setOpenAddActivity] = useState<boolean>(false);
    const [error, setError] = useState<{ title?: string; icon?: string }>({
        title: '',
        icon: '',
    });
    const [proceedItems, setProceedItems] = useState<{
        start: MarkerType[];
        end: MarkerType[];
    }>({
        start: [],
        end: [],
    });
    const [isRouteToRoute, setIsRouteToRoute] = useState<boolean>(false);
    const [routes, setRoutes] = useState<{
        start: MarkerType[];
        end: MarkerType[];
    }>({
        start: [],
        end: [],
    });
    const [panelText, setPanelText] = useState<string>('Hide');
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
    const [markerItem, setMarkerItem] = useState<MarkerType>({} as MarkerType);

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

    const handleHidePanel = () => {
        const panel = document.querySelector(
            '.leaflet-routing-alternatives-container',
        );

        if (panel) {
            if (panel.classList.contains('hidden')) {
                panel.classList.remove('hidden');
                setPanelText('Hide');
            } else {
                panel.classList.add('hidden');
                setPanelText('Show');
            }
        }
    };

    const handleOpenRouteToRoute = () => {
        setIsRouteToRoute(true);
    };

    const handleResetRouteToRoute = () => {
        setRoutes({
            start: [],
            end: [],
        });
        setProceedItems({
            start: [],
            end: [],
        });
    };

    const handleAddActivity = (marker: MarkerType) => () => {
        setOpenAddActivity(true);
        setMarkerItem(marker);
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
                center={
                    coordinates?.length > 0
                        ? coordinates[0]
                        : [12.157802, 122.705489]
                }
                zoom={7}
                style={{ height: '100%', width: '100%' }}
                attributionControl={false}
            >
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Street Map">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Carto Voyager">
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Carto Positron">
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satellite">
                        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Carto Dark">
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="ESRI Topo">
                        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}" />
                    </LayersControl.BaseLayer>
                </LayersControl>
                <Activity
                    mode={
                        routes.end.length > 0 && routes.start.length > 0
                            ? 'visible'
                            : 'hidden'
                    }
                >
                    <Routing
                        start={[routes.start[0]?.lat, routes.start[0]?.lng]}
                        end={[routes.end[0]?.lat, routes.end[0]?.lng]}
                        startIcon={IconDefault(routes.start[0]?.icon)}
                        endIcon={IconDefault(routes.end[0]?.icon)}
                    />
                </Activity>
                <ClickHandler
                    onClick={(latlng) => {
                        addMarker(latlng);
                    }}
                />
                {coordinates?.map((m, index) => (
                    <Marker
                        key={index}
                        position={m}
                        icon={L.icon({
                            className: 'rounded-full overflow-hidden',
                            iconUrl: IconDefault(m.icon),
                            iconSize: [45, 45],
                            iconAnchor: [17, 45],
                            popupAnchor: [0, -40],
                        })}
                    >
                        <Popup>
                            <div className="flex flex-col items-center justify-center space-y-4">
                                <span className="text-2xl font-bold text-gray-600 underline">
                                    {m.name}
                                </span>
                                {m?.activities_count &&
                                m?.activities_count > 0 ? (
                                    <div className="justify-content-center flex flex-col items-center space-y-2">
                                        <span className="text-md font-bold text-gray-500">
                                            Total Activities
                                        </span>
                                        <AvtivityPopOver
                                            activities={m?.activities}
                                        >
                                            <Badge
                                                asChild
                                                className="cursor-pointer rounded-full bg-cyan-500 text-white hover:bg-cyan-600"
                                            >
                                                <Button
                                                    type="button"
                                                    size={null}
                                                >
                                                    {m.activities_count}
                                                    <ArrowUpRightIcon />
                                                </Button>
                                            </Badge>
                                        </AvtivityPopOver>
                                    </div>
                                ) : (
                                    <span className="text-center font-bold text-gray-600">
                                        No Activities yet
                                    </span>
                                )}
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        onClick={handleDeleteMarker(m.id)}
                                        variant={'destructive'}
                                    >
                                        Delete Marker
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={handleAddActivity(m)}
                                        className="bg-blue-500 text-white hover:bg-blue-600"
                                    >
                                        Add Activity
                                    </Button>
                                </div>
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
            <Activity
                mode={
                    routes.end.length > 0 && routes.start.length > 0
                        ? 'visible'
                        : 'hidden'
                }
            >
                <Button
                    type="button"
                    onClick={handleHidePanel}
                    className="fixed top-4 right-20 z-999 bg-blue-500 text-white hover:bg-blue-600"
                >
                    {panelText} Map Panel List
                </Button>
            </Activity>
            <Activity
                mode={
                    !isRouteToRoute && coordinates?.length > 1
                        ? 'visible'
                        : 'hidden'
                }
            >
                <div className="fixed bottom-0 z-999 w-full">
                    <div className="mb-4 flex flex-col items-center justify-center gap-2 md:flex-row">
                        <Button
                            type="button"
                            className="bg-green-500 text-white hover:bg-green-600"
                            onClick={handleOpenRouteToRoute}
                        >
                            Click to route to route between first two markers
                        </Button>
                        <Activity
                            mode={
                                routes.end.length > 0 && routes.start.length > 0
                                    ? 'visible'
                                    : 'hidden'
                            }
                        >
                            <Button
                                type="button"
                                className="bg-red-500 text-white hover:bg-red-600"
                                onClick={handleResetRouteToRoute}
                            >
                                Reset route to route between first two markers
                            </Button>
                        </Activity>
                    </div>
                </div>
            </Activity>
            <RouteSelect
                open={isRouteToRoute}
                setOpen={setIsRouteToRoute}
                coordinates={coordinates}
                setRoutes={setRoutes}
                setProceedItems={setProceedItems}
                proceedItems={proceedItems}
            />
            <AddActivity
                open={openAddActivity}
                setOpen={setOpenAddActivity}
                markerItem={markerItem}
            />
        </div>
    );
};

export default App;
