'use strict';
const expect = require('chai').expect;
const O = require('../dist/index.js');
const GLOBAL = require('./_helpers/window');
GLOBAL.L = require('leaflet');

describe('OSRM', () => {
   const options = {};
   const osrm = new O.Routing.OSRM(options);

   it('should set default options', () => {
      expect(osrm.options).to.deep.equal({
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
      });
   });

   describe('#getRoutes', () => {
      const waypoints = [
         new O.Routing.Waypoint(L.latLng([39.744814, -105.001868])),
         new O.Routing.Waypoint(L.latLng([39.585607, -104.870855])),
      ];

      it('should return a list of routes', () => {
         osrm.getRoutes(waypoints)
            .subscribe(routes => {
               expect(routes).to.be.();
            });
      });
   });
});