import { Waypoint } from './waypoint';

export interface OsrmRepsonse {
   code: string;
   waypoints: Waypoint[];
   routes: Route[];
}

/**
 * Property's initial type is it's default. Reference:
 *
 * hints - provided from waypoints
 *
 * TODO move to README
 * Example: if OSRM options contains simplified = undefined then overview = 'simplified'.
 * Or if simplified = false then overview = false.
 * Or if simplified = true then overview = false.
 *
 * alternatives - default false
 * steps - default false
 * geometries - default polyline
 * overview - default simplified
 * continue_straight - default is default
 */
export interface OSRMParams {
   alternatives?: boolean | number; // default false
   steps?: boolean; // default false
   geometries?: 'polyline' | 'polyline6' | 'geojson'; // default polyline
   overview?: 'simplified' | 'full' | 'false'; // default simplified
   continue_straight?: 'default' | boolean; // default depends on profile
   hints?: string;
}

export interface HttpOptions {
   qs?: OSRMParams,
   headers?: {
      [key: string]: string
   },
   json?: boolean
}

export interface OSRMOptions {
   baseUrl: string;
   version: string;
   profile: string;
   allowHints: boolean;
   allowUTurns: boolean;
   _httpOptions: HttpOptions;
}

export interface Route {
   distance: number; // float meters
   duration: number; // float seconds
   weight: number;
   weight_name: string;
   geometry?: GEOJsonLineString; // GEOJson. dependent on overview parameter
   legs: RouteLeg[];
}

// For type "LineString", the "coordinates" member must be an array of two or more positions.
export interface GEOJsonLineString {
   type: string;
   coordinates: Array<[number, number]>; // minimum two positions
}

export interface RouteLeg {
   distance: number;
   duration: number;
   weight: number;
   summary?: string | string[]; // depends on summary parameter
   steps?: RouteStep[];
   annotation?: Annotation; // depends on annotation parameter
}

export interface Annotation {
   distance: number[];
   duration: number[];
   datasources: number[];
   nodes: number[];
   weight: number[];
   speed?: number; // distance / duration
}

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

export interface StepManeuver {
   location: Array<[number, number]>;
   bearing_before: string; // The clockwise angle from true north to the direction of travel immediately before the maneuver. Range 0-359.
   bearing_after: string; // The clockwise angle from true north to the direction of travel immediately after the maneuver. Range 0-359.
   type?: string;
   modifier?: string; // direction modifier for turn type
   exit: number; // property exists for the roundabout / rotary
}

export interface Intersection {
   location: [number, number];
   bearings: number[];
   in: number;
   out: number;
   entry: boolean[];
   classes: string[];
   lanes: Lane;
}

export interface Lane {
   indications: string[];
   valid: boolean;
}

export interface Waypointx {
   name: string;
   location: [number, number];
   distance?: number;
   hint: string;
}
