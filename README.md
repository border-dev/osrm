# osrm
A map module that returns the plural form of any noun
## Installation 
```sh
npm install @org/osrm --save
yarn add @org/osrm
bower install pluralize --save
```
## Usage
### Javascript
```javascript
var pluralise = require('@org/osrm');
var boys = pluralise.getPlural('Boy');
```
```sh
Output should be 'Boys'
```
### TypeScript
```typescript
import { getPlural } from '@org/osrm';
console.log(getPlural('Goose'))
```
```sh
Output should be 'Geese'
```
### AMD
```javascript
define(function(require,exports,module){
  var pluralise = require('@org/osrm');
});
```
## Test 
```sh
npm run test
```