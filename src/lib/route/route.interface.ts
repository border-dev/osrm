import { GEOJsonLineString } from './geojson.interface';
import { RouteLeg } from './route-leg.interface';

export interface Route {
    distance: number; // float meters
    duration: number; // float seconds
    weight: number;
    weight_name: string;
    geometry?: GEOJsonLineString; // GEOJson. dependent on overview parameter
    legs: RouteLeg[];
}