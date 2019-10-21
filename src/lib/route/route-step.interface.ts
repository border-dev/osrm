import { GEOJsonLineString } from "./geojson.interface";
import { StepManeuver } from './step-maneuver.interface';
import { Intersection } from './intersection.interface';

export interface RouteStep {
    distance: number; // float meters
    duration: number; // float seconds
    geometry?: GEOJsonLineString | any; // depends on geometries parameter. @mapbox/polyline
    weight: number;
    name?: string;
    ref?: number;
    pronunciation?: string; // only if pronunciation data available for step
    exits: any[]; // number or names of exits for step
    mode: string; // mode of transportation
    maneuver: StepManeuver;
    intersections: Intersection[];
    rotary_name?: string; // optional if rotary data available
    rotary_pronunciation?: string; // optional if rotary data available
    driving_side?: string;
}
