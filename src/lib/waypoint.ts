import { LatLng } from 'leaflet';

export class Waypoint {
   latLng: LatLng;
   name?: string;
   hint?: string;
   options: any;

   /**
    *
    * @param {LatLng} latLong - Latitude and longitude coordinates
    * @param {string} name - Route name if it exists
    * @param {string} hint - Encrypted hints string from OSRM
    * @param options - waypoint options for each waypoint instance
    */
   constructor(latLong: LatLng, name?: string, hint?: string, options?: any) {
      this.latLng = latLong;
      this.name = name;
      this.hint = hint;
      this.options = options;
   }
}