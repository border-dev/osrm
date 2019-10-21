import { Waypoint } from '../waypoint';
import { Route } from '../route';

export interface OsrmRepsonse {
   code: string;
   waypoints: Waypoint[];
   routes: Route[];
}