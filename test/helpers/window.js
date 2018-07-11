// Create globals so leaflet can load
///<#ref: https://stackoverflow.com/questions/36462814/node-js-leaflet-error>
GLOBAL.window = {
   screen: {
      deviceXDPI: 0,
      logicalXDPI: 0
   }
};
GLOBAL.document = {
   documentElement: {
      style: {}
   },
   getElementsByTagName: function () {
      return [];
   },
   createElement: function () {
      return {};
   }
};
GLOBAL.navigator = {
   userAgent: 'nodejs',
   platform: 'Win'
};

module.exports = GLOBAL;
