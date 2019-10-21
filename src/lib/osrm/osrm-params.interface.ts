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
    alternatives?: boolean | number;
    steps?: boolean;
    geometries?: 'polyline' | 'polyline6' | 'geojson';
    overview?: 'simplified' | 'full' | 'false';
    continue_straight?: 'default' | boolean;
    hints?: string;
}
