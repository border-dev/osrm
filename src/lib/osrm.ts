import { RxHR, RxHttpRequestResponse } from '@akanass/rx-http-request';
import { Waypoint } from './waypoint';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { HttpOptions, OSRMOptions, OsrmRepsonse } from './osrm.types';

export class OSRM {

   options: OSRMOptions = {
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
            continue_straight: 'default',
         },
         json: true,
      }
   };

   constructor(options: OSRMOptions) {
      this.options = Object.assign({}, this.options, options);
   }

   getRoutes(waypoints: Waypoint[], options?: HttpOptions): Observable<RxHttpRequestResponse<OsrmRepsonse>> {
      options = Object.assign({}, this.options._httpOptions, options);

      const hints: string[] = [];
      const locs: string[] = waypoints
         .map((wp: Waypoint) => {
            const latLng = wp.latLng;
            // hints.push(this._hints.locations[this._locationKey(latLng)] || '');
            return latLng.lng + ',' + latLng.lat;
         });
      const coordinates = locs.join(';');
      const apiUrl = `${this.options.baseUrl}${this.options.version}${this.options.profile}/${coordinates}`;
      const httpOptions: HttpOptions = this._buildQuery(hints, options);

      return RxHR.get<OsrmRepsonse>(apiUrl, httpOptions)
         .pipe(
            catchError(this._handleRouteErrors<RxHttpRequestResponse<OsrmRepsonse>>(`getRoutes`))
         );
   }

   _buildQuery(hints: string[], options: HttpOptions): HttpOptions {
      const query = options.qs;

      if (query) {
         if (this.options.allowUTurns) {
            query.continue_straight = !this.options.allowUTurns;
         }

         if (this.options.allowHints && hints) {
            query.hints = hints.join(';');
         }
      }

      options.qs = query;
      return options;
   }

   _handleRouteErrors<T>(operation = 'operation', result?: T) {
      return (error: Error): Observable<T> => {
         console.warn(operation, result);
         console.error(error);
         console.error(`${operation} failed. Returning ${result}`);

         // return an ErrorObservable with a user-facing error message
         return throwError('Something bad happened; please try again later.');
      };
   }

}