import { Waypoint } from '../waypoint';
import { LatLng, latLng, polyline } from 'leaflet';
import { OSRM, OSRMOptions, OSRMParams } from '../osrm';
import { OsrmRepsonse } from '../osrm';
import { map } from 'rxjs/operators';

const _toWaypoints = (inputWaypoints: Waypoint[]) => (vias: any) => vias.map((via: any, i: number) => {
   const viaLoc = via.location;
   const locs: LatLng = latLng(viaLoc[1], viaLoc[0]);
   return new Waypoint(locs, inputWaypoints[i].name, inputWaypoints[i].options);
});

export class Route {
   routerOptions: OSRMOptions;

   constructor(waypoints: Waypoint[], routerOptions: OSRMOptions) {
      this.routerOptions = routerOptions;
      const osrm = new OSRM(waypoints, routerOptions);
   }

   route(waypoints, osrm, options) {
      // Create a copy of the waypoints, since they
      // might otherwise be asynchronously modified while
      // the request is being processed.
      const wps = [...waypoints];
      osrm.getRoutes(this.routerOptions._httpOptions)
         .pipe(map(data => this._routeDone(data, wps, options)));
   }

   _routeDone(response: OsrmRepsonse, inputWaypoints: Waypoint[], options: OSRMParams) {
      const actualWaypoints = _toWaypoints(inputWaypoints)(response.waypoints);

      // this._saveHintData(response.waypoints, inputWaypoints);

      return response.routes.map(route => {
         const convertedRoute = this._convertRoute(route);
         convertedRoute.inputWaypoints = inputWaypoints;
         route.waypoints = actualWaypoints;
         route.properties = { isSimplified: !options || !options.geometryOnly || options.simplifyGeometry };
      });
   }

   _convertRoute(responseRoute) {
      const result = {
         name: '',
         coordinates: [],
         instructions: [],
         summary: {
            totalDistance: responseRoute.distance,
            totalTime: responseRoute.duration
         }
      };
      const legNames = [];
      const waypointIndices = [];
      let index = 0;
      const legCount = responseRoute.legs.length;
      const hasSteps = responseRoute.legs[0].steps.length > 0;
      let stepToText;

      // if (this.options.stepToText) {
      //    stepToText = this.options.stepToText;
      // } else {
      //    stepToText = L.bind(osrmTextInstructions.compile, osrmTextInstructions, this.options.language);
      // }

      for (let i = 0; i < legCount; i++) {
         const leg = responseRoute.legs[i];
         legNames.push(leg.summary && leg.summary.charAt(0).toUpperCase() + leg.summary.substring(1));
         for (let j = 0; j < leg.steps.length; j++) {
            const step = leg.steps[j];
            const geometry = this._decodePolyline(step.geometry);
            result.coordinates.push.apply(result.coordinates, geometry);
            const type = this._maneuverToInstructionType(step.maneuver, i === legCount - 1);
            const modifier = this._maneuverToModifier(step.maneuver);
            const text = stepToText(step, { legCount: legCount, legIndex: i });

            if (type) {
               if ((i == 0 && step.maneuver.type == 'depart') || step.maneuver.type == 'arrive') {
                  waypointIndices.push(index);
               }

               result.instructions.push({
                  type: type,
                  distance: step.distance,
                  time: step.duration,
                  road: step.name,
                  direction: this._bearingToDirection(step.maneuver.bearing_after),
                  exit: step.maneuver.exit,
                  index: index,
                  mode: step.mode,
                  modifier: modifier,
                  text: text
               });
            }

            index += geometry.length;
         }
      }

      result.name = legNames.join(', ');
      if (!hasSteps) {
         result.coordinates = this._decodePolyline(responseRoute.geometry);
      } else {
         result.waypointIndices = waypointIndices;
      }

      return result;
   }

   _decodePolyline(routeGeometry) {
      const cs = polyline.decode(routeGeometry, this.options.polylinePrecision);
      const result = new Array(cs.length);
      let i;

      for (i = cs.length - 1; i >= 0; i--) {
         result[i] = latLng(cs[i]);
      }

      return result;
   }

   _maneuverToInstructionType(maneuver, lastLeg) {
      switch (maneuver.type) {
         case 'new name':
            return 'Continue';
         case 'depart':
            return 'Head';
         case 'arrive':
            return lastLeg ? 'DestinationReached' : 'WaypointReached';
         case 'roundabout':
         case 'rotary':
            return 'Roundabout';
         case 'merge':
         case 'fork':
         case 'on ramp':
         case 'off ramp':
         case 'end of road':
            return this._camelCase(maneuver.type);
         // These are all reduced to the same instruction in the current model
         //case 'turn':
         //case 'ramp': // deprecated in v5.1
         default:
            return this._camelCase(maneuver.modifier);
      }
   }

   _maneuverToModifier(maneuver) {
      const modifier = maneuver.modifier;

      switch (maneuver.type) {
         case 'merge':
         case 'fork':
         case 'on ramp':
         case 'off ramp':
         case 'end of road':
            modifier = this._leftOrRight(modifier);
      }

      return modifier && this._camelCase(modifier);
   }

   _camelCase(s) {
      var words  = s.split(' '),
          result = '';
      for (var i = 0, l = words.length; i < l; i++) {
         result += words[i].charAt(0).toUpperCase() + words[i].substring(1);
      }

      return result;
   }

   _leftOrRight(d) {
      return d.indexOf('left') >= 0 ? 'Left' : 'Right';
   }
}