// For type "LineString", the "coordinates" member must be an array of two or more positions.
export interface GEOJsonLineString {
    type: string;
    coordinates: Array<[number, number]>; // minimum two positions
}
