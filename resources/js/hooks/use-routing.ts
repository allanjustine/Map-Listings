import L from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function Routing({
    start,
    end,
    startIcon,
    endIcon,
}: {
    start: [number, number];
    end: [number, number];
    startIcon: string;
    endIcon: string;
}) {
    const map = useMap();

    useEffect(() => {
        const control = L.Routing.control({
            waypoints: [L.latLng(start), L.latLng(end)],
            showAlternatives: true,
            fitSelectedRoutes: true,
            routeWhileDragging: false,
            draggableWaypoints: false,
            addWaypoints: false,
            show: false,
            lineOptions: {
                styles: [
                    { color: '#2563eb', weight: 8, opacity: 0.9 },
                    { color: '#64748b', weight: 6, opacity: 0.6 },
                    { color: '#94a3b8', weight: 4, opacity: 0.4 },
                ],
            },
            createMarker: function (i: number, wp: any) {
                const iconUrl = i === 0 ? startIcon : endIcon;

                return L.marker(wp.latLng, {
                    icon: L.icon({
                        className: 'rounded-full overflow-hidden',
                        iconUrl,
                        iconSize: [45, 45],
                        iconAnchor: [17, 45],
                        popupAnchor: [0, -40],
                    }),
                    draggable: false,
                });
            },
        }).addTo(map);

        return () => {
            map.removeControl(control);
        };
    }, [map, start, end, startIcon, endIcon]);

    return null;
}
