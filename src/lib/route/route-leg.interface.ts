import { Annotation } from "./annotation.interface";
import { RouteStep } from './route-step.interface';

export interface RouteLeg {
    distance: number;
    duration: number;
    weight: number;
    summary?: string | string[]; // depends on summary parameter
    steps?: RouteStep[];
    annotation?: Annotation; // depends on annotation parameter
}
