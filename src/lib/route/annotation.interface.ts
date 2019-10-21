export interface Annotation {
    distance: number[];
    duration: number[];
    datasources: number[];
    nodes: number[];
    weight: number[];
    speed?: number; // distance / duration
}
