import { LatLng } from 'leaflet';

export class Waypoint {
         /**
          *
          * @param {LatLng} latLng - Latitude and longitude coordinates
          * @param {string} name - Route name if it exists
          * @param {string} hint - Encrypted hints string from OSRM
          * @param options - waypoint options for each waypoint instance
          */
         constructor(public latLng: LatLng, public name?: string, public hint?: string, public options?: any) {}
       }
