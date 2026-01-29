import { Activity } from './activity';

export interface MarkerType {
    id: number;
    lat: number;
    lng: number;
    name: string;
    icon: string | null;
    activities_count?: number;
    activities?: Activity[];
}
