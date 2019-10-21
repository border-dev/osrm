import { Lane } from './lane.interface';

export interface Intersection {
    location: [number, number];
    bearings: number[];
    in: number;
    out: number;
    entry: boolean[];
    classes: string[];
    lanes: Lane;
}
