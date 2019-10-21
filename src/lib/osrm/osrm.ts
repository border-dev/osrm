import { RxHR, RxHttpRequest, RxHttpRequestResponse } from '@akanass/rx-http-request';
import { LatLng } from 'leaflet';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Waypoint } from '../waypoint';
import { OSRMOptions } from './osrm-options';
import { HttpOptions } from './osrm-http-options.interface';
import { OsrmRepsonse } from './osrm-response.interface';

const OSRM_OPTIONS: OSRMOptions = {
   baseUrl: 'http://router.project-osrm.org/route',
   version: '/v1',
   profile: '/driving',
   allowHints: true,
   allowUTurns: true,
   _httpOptions: {
      qs: {
         alternatives: false,
         steps: false,
         geometries: 'polyline',
         overview: 'simplified',
         continue_straight: 'default'
      },
      json: true
   }
};

const getRoutes = (osrmOptions: OSRMOptions) => (waypoints: Waypoint[]) => (extra?: HttpOptions): Observable<RxHttpRequestResponse<OsrmRepsonse>> => {
   extra = Object.assign({}, osrmOptions._httpOptions, extra);

   const latLngs: LatLng[] = _latLngs(waypoints);
   const locations: string[] = _locations(latLngs);
   const hints: string[] = _hints(locations)(latLngs);
   const coordinates = _coordinates(locations);
   const url: string = _apiUrl(osrmOptions)(coordinates);
   const httpOptions: HttpOptions = _buildQuery(hints)(osrmOptions)(extra);

   return _getRoutes(RxHR)(_handleRouteErrors)(url)(httpOptions);
};

const _latLngs = (waypoints: Waypoint[]): LatLng[] => waypoints.map((wp: Waypoint) => wp.latLng);

const _locations = (latLngs: LatLng[]): string[] => latLngs.map((latLng: LatLng) => latLng.lng + ',' + latLng.lat);

const _hints = (locations: { [key: string]: any }) => (latLngs: LatLng[]): string[] => latLngs.map((latLng: LatLng) => {
   const key = _locationKey(latLng);
   return locations[key] || ''
});

const _coordinates = (locations: string[]): string => locations.join(';');

const _apiUrl = (osrmOptions: OSRMOptions) => (coordinates: string): string => `${osrmOptions.baseUrl}${osrmOptions.version}${osrmOptions.profile}/${coordinates}`;

const _buildQuery = (hints: string[]) => (osrmOptions: OSRMOptions) => (httpOptions: HttpOptions): HttpOptions => {
   const options = httpOptions;
   const query = options.qs;

   if (query) {
      if (osrmOptions.allowUTurns) {
         query.continue_straight = !osrmOptions.allowUTurns;
      }

      if (osrmOptions.allowHints && hints) {
         query.hints = hints.join(';');
      }
   }

   options.qs = query;
   return options;
};

const _getRoutes = (RxHR: RxHttpRequest) => (handleRouteErrors: Function) => (apiUrl: string) => (httpOptions: HttpOptions) => RxHR.get<OsrmRepsonse>(apiUrl, httpOptions).pipe(catchError(handleRouteErrors(`getRoutes`)));

const _handleRouteErrors = <T>(operation = 'operation', result?: T) => (error: Error): Observable<T> => {
   console.warn(operation, result);
   console.error(error);
   console.error(`${operation} failed. Returning ${result}`);

   // return an ErrorObservable with a user-facing error message
   return throwError('Something bad happened; please try again later.');
};

const _locationKey = (location: LatLng): string => location.lat + ',' + location.lng;

export class OSRM {
   osrmOptions: OSRMOptions = OSRM_OPTIONS;
   // TODO: see how to trim this chizz
   _hints = {
      locations: {}
   };

   getRoutes: (extra?: HttpOptions) => Observable<RxHttpRequestResponse<OsrmRepsonse>>;

   constructor(waypoints: Waypoint[], osrmOptions: OSRMOptions) {
      this.osrmOptions = Object.assign({}, this.osrmOptions, osrmOptions);
      this.getRoutes = getRoutes(osrmOptions)(waypoints);
   }

   /*getRoutes(waypoints: Waypoint[], extra?: HttpOptions): Observable<RxHttpRequestResponse<OsrmRepsonse>> {
      extra = Object.assign({}, this.osrmOptions._httpOptions, extra);

      const latLngs: LatLng[] = waypoints.map((wp: Waypoint) => wp.latLng);
      const hints: string[] = latLngs.map((latLng: LatLng) => {
         const key = _locationKey(latLng);
         return this._hints.locations[key] || ''
      });
      const locs: string[] = latLngs.map((latLng: LatLng) => latLng.lng + ',' + latLng.lat);
      const coordinates = locs.join(';');
      const apiUrl = `${this.osrmOptions.baseUrl}${this.osrmOptions.version}${this.osrmOptions.profile}/${coordinates}`;
      const httpOptions: HttpOptions = this._buildQuery(hints, extra);

      return RxHR.get<OsrmRepsonse>(apiUrl, httpOptions)
         .pipe(
            catchError(this._handleRouteErrors<RxHttpRequestResponse<OsrmRepsonse>>(`getRoutes`))
         );
   }*/

   /*_buildQuery(hints: string[], options: HttpOptions): HttpOptions {
      const query = options.qs;

      if (query) {
         if (this.osrmOptions.allowUTurns) {
            query.continue_straight = !this.osrmOptions.allowUTurns;
         }

         if (this.osrmOptions.allowHints && hints) {
            query.hints = hints.join(';');
         }
      }

      options.qs = query;
      return options;
   }*/

   /*_handleRouteErrors<T>(operation = 'operation', result?: T) {
      return (error: Error): Observable<T> => {
         console.warn(operation, result);
         console.error(error);
         console.error(`${operation} failed. Returning ${result}`);

         // return an ErrorObservable with a user-facing error message
         return throwError('Something bad happened; please try again later.');
      };
   }*/
}
