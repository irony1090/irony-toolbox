## irony Toolbox
---
### My collection of useful JavaScript utilities.
## Features
* Typescript
* Steady update

# Download
To install ironyToolbox, use yarn
```
$ yarn add @irony0901/toolbox
```
## Methods
* [filterVariable](#filterVariable)
* [isContains](#isContains)
* [deepClone](#deepClone)
* [filterDuplication](#filterDuplication)
* [deepForEach](#deepForEach)
* [splitToObject](#splitToObject)
* [getIdsRecord](#getIdsRecord) (Coming soon example)
* [initBoolean](#initBoolean) (Coming soon example)

## filterVariable
### filterVariable(origin, variable)
**Examples1**
``` javascript
import { filterVariable } from '@irony0901/toolbox';

const origin = {
  name: 'irony',
  age: 0,
  gender: 'male'
};
const variable = {
  age: null,
  gender: 'male'
};
const variable2 = {
  name: 'Irony',
  age: undefined,
  gender: 'female'
}
const variables1 = filterVariable(origin, variable);
const variables2 = filterVariable(origin, variable2);

console.log( '[variables1]', variables1 ) // '[variables1]' { age: null }
console.log( '[variables2]', variables2 ) // '[variables2]' { name: 'Irony', gender: 'female' }
```   

**Examples2**
``` javascript
import { filterVariable } from '@irony0901/toolbox';

const origin = {
  arrs: [ 1, 2, 3 ],
  obj: {
    id: 1,
    title: 'obj title'
  }
};
const variable = {
  arrs: [ 1, 3, 2 ],
  obj: {
    title: 'obj title',
    id: 1
  }
};
const variable2 = {
  arrs: [ 1, 2, 3 ],
  obj: {
    id: 1
  }
}
const variables1 = filterVariable(origin, variable);
const variables2 = filterVariable(origin, variable2);

console.log( '[variables1]', variables1 ) // '[variables1]' { arrs: [ 1, 3, 2 ] }
console.log( '[variables2]', variables2 ) // '[variables2]' { obj: { id: 1 } }
```   

## isContains
### isContains(subject, compare)
**Examples**
``` javascript
import { isContains } from '@irony0901/toolbox';

const subjectIrony = {
  id: 1,
  gender: 'male',
  name: 'irony',
};
const subjectFakeIrony = {
  id: 1,
  gender: 'other',
  name: 'fakeIrony'
};
const compare = { id: 1 };
const compare2 = { id: 1, gender: 'male' };

console.log( isContains(subjectIrony, compare) )      // true
console.log( isContains(subjectFakeIrony, compare) )  // true
console.log( isContains(subjectIrony, compare2) )     // true
console.log( isContains(subjectFakeIrony, compare2) ) // false
```   

## deepClone
### deepClone(object)
**Examples**
```javascript
import { deepClone } from '@irony0901/toolbox';

const object = {
  id: 1,
  title: 'title of object',
  category: {
    id: 'ctg-1',
    categoryTitle: 'category title',
    regDate: new Date(0)
  },
  regDate: new Date(0)
}

console.log( JSON.parse(JSON.stringify(object)) ) 
/** 
 * {
 *    id: 1,
 *    title: 'title of object',
 *    category: {
 *      id: ctg-1,
 *      categoryTitle: 'category title',
 *      regDate: '1970-01-01T00:00:00.000Z' // => **type is string**
 *    },
 *    regDate: '1970-01-01T00:00:00.000Z' // => **type is string**
 * }
 **/
console.log( deepClone(object) ) 
/** 
 * {
 *    id: 1,
 *    title: 'title of object',
 *    category: {
 *      id: ctg-1,
 *      categoryTitle: 'category title',
 *      regDate: 1970-01-01T00:00:00.000Z // => **type is Date**
 *    },
 *    regDate: 1970-01-01T00:00:00.000Z // => **type is Date**
 * }
 **/
```   

## filterDuplication
### filterDuplication(arr, keyOrKeys?)

#### filterDuplication(arr)
**Examples1**
```javascript
import { filterDuplication } from '@irony0901/toolbox';

const arr = [
  { id: 1, site: 'google'},
  { id: 2, site: 'yahoo'},
  { id: 3, site: 'reddit'},
  { id: 1, site: 'google'},
  { id: 1, site: 'google', type: 'search'},
  { id: 2, site: 'yahoo'},
  { id: 3, site: 'reddit'}
]

console.log( filterDuplication(arr) )
/**
 * [
 *    { id: 1, site: 'google'},
 *    { id: 2, site: 'yahoo'},
 *    { id: 3, site: 'reddit'},
 *    { id: 1, site: 'google', type: 'search'},
 * ]
**/
```

#### filterDuplication(arr, key)
**Examples2**
```javascript
import { filterDuplication } from '@irony0901/toolbox';

const arr = [
  { id: 1, site: 'google', type: 'search', ord: 1},
  { id: 2, site: 'yahoo', type: 'search', ord: 2},
  { id: 3, site: 'reddit', type: 'community', ord: 3},
  { id: 4, site: 'stackOverflow', type: 'search', ord: 4},
  { id: 5, site: 'GOOGLE', type: 'search', ord: 5},
  { id: 6, site: 'reddit', type: 'community', ord: 6},
  { id: 4, site: 'sTACKoVERFLOW', type: 'search', ord: 7},
  { id: 2, site: 'yahoo', type: 'search', ord: 8 }
]

console.log( filterDuplication(arr, 'id') )
/**
 * [
 *   { id: 1, site: 'google', type: 'search', ord: 1 },
 *   { id: 2, site: 'yahoo', type: 'search', ord: 2 },
 *   { id: 3, site: 'reddit', type: 'community', ord: 3 },
 *   { id: 4, site: 'stackOverflow', type: 'search', ord: 4 },
 *   { id: 5, site: 'GOOGLE', type: 'search', ord: 5 },
 *   { id: 6, site: 'reddit', type: 'community', ord: 6 }
 * ]
**/

console.log( filterDuplication(arr, 'site') )
/**
 * [
 *  { id: 1, site: 'google', type: 'search', ord: 1 },
 *  { id: 2, site: 'yahoo', type: 'search', ord: 2 },
 *  { id: 3, site: 'reddit', type: 'community', ord: 3 },
 *  { id: 4, site: 'stackOverflow', type: 'search', ord: 4 },
 *  { id: 5, site: 'GOOGLE', type: 'search', ord: 5 },
 *  { id: 4, site: 'sTACKoVERFLOW', type: 'search', ord: 7 }
 * ]
**/
```

#### filterDuplication(arr, keys)
**Examples3**
```javascript
import { filterDuplication } from '@irony0901/toolbox';

const arr = [
  { id: 1, site: 'google', type: 'search', ord: 1 },
  { id: 2, site: 'yahoo', type: 'search', ord: 2 },
  { id: 3, site: 'reddit', type: 'community', ord: 3 },
  { id: 4, site: 'stackOverflow', type: 'search', ord: 4 },
  { id: 5, site: 'GOOGLE', type: 'search', ord: 5 },
  { id: 6, site: 'reddit', type: 'community', ord: 6 },
  { id: 4, site: 'sTACKoVERFLOW', type: 'search', ord: 7 },
  { id: 2, site: 'yahoo', type: 'search', ord: 8 },

]

console.log( filterDuplication(arr, ['id', 'site']) )
/**
 * [
 *  { id: 1, site: 'google', type: 'search', ord: 1 },
 *  { id: 2, site: 'yahoo', type: 'search', ord: 2 },
 *  { id: 3, site: 'reddit', type: 'community', ord: 3 },
 *  { id: 4, site: 'stackOverflow', type: 'search', ord: 4 },
 *  { id: 5, site: 'GOOGLE', type: 'search', ord: 5 },
 *  { id: 6, site: 'reddit', type: 'community', ord: 6 },
 *  { id: 4, site: 'sTACKoVERFLOW', type: 'search', ord: 7 }
 * ]
**/

console.log( filterDuplication(arr, ['id', 'site', 'ord']) )
/**
 * [
 *  { id: 1, site: 'google', type: 'search', ord: 1 },
 *  { id: 2, site: 'yahoo', type: 'search', ord: 2 },
 *  { id: 3, site: 'reddit', type: 'community', ord: 3 },
 *  { id: 4, site: 'stackOverflow', type: 'search', ord: 4 },
 *  { id: 5, site: 'GOOGLE', type: 'search', ord: 5 },
 *  { id: 6, site: 'reddit', type: 'community', ord: 6 },
 *  { id: 4, site: 'sTACKoVERFLOW', type: 'search', ord: 7 },
 *  { id: 2, site: 'yahoo', type: 'search', ord: 8 }
 * ]
 */
```   

## deepForEach
### deepForEach(object, predict: (key: string|number, value: any, wrap: any) => any)
**Examples**
```javascript
import { deepForEach } from '@irony0901/toolbox';

const obj = {
  id: 'obj-1',
  arrs: [ 1, 2, 3 ],
  innerObj: {
    innerId: 1,
    innerTitle: 'obj title'
  },
  title: 'obj title',
  regDate: new Date(0)
};

deepForEach( obj, (key, val, wrap) => {
  console.log(`${key}:`, val, wrap)
  /**
   *  id: obj-1 {
   *    id: 'obj-1',
   *    arrs: [ 1, 2, 3 ],
   *    innerObj: { innerId: 1, innerTitle: 'obj title' },
   *    title: 'obj title',
   *    regDate: 1970-01-01T00:00:00.000Z
   *  }
   * 
   *  0: 1 [ 1, 2, 3 ]
   * 
   *  1: 2 [ 1, 2, 3 ]
   * 
   *  2: 3 [ 1, 2, 3 ]
   * 
   *  innerId: 1 { innerId: 1, innerTitle: 'obj title' }
   * 
   *  innerTitle: obj title { innerId: 1, innerTitle: 'obj title' }
   * 
   *  title: obj title {
   *    id: 'obj-1',
   *    arrs: [ 1, 2, 3 ],
   *    innerObj: { innerId: 1, innerTitle: 'obj title' },
   *    title: 'obj title',
   *    regDate: 1970-01-01T00:00:00.000Z
   *  }
   * 
   *  regDate: 1970-01-01T00:00:00.000Z {
   *    id: 'obj-1',
   *    arrs: [ 1, 2, 3 ],
   *    innerObj: { innerId: 1, innerTitle: 'obj title' },
   *    title: 'obj title',
   *    regDate: 1970-01-01T00:00:00.000Z
   *  }
  **/
})

```

## splitToObject
### splitToObject(object, predict: (key: string|number, value: any, wrap: any) => any)
**Examples**
```javascript
import { splitToObject } from '@irony0901/toolbox';

const orderByString = 'id-DESC';
const orderByString2 = 'id';
const result = splitToObject(orderByString, ['column', 'orderBy']);
const result2 = splitToObject(orderByString, ['name1', 'name2']);
const result3 = splitToObject(orderByString2, ['column', 'orderBy']);
const result4 = splitToObject(
  orderByString2, 
  [ 'column', 'orderBy' ], 
  { def: { column: 'id', orderBy: 'ASC' } } 
);
console.log( result );  // { column: 'id', orderBy: 'DESC' }
console.log( result2 ); // { name1: 'id', name2: 'DESC' }
console.log( result3 ); // { column: 'id', orderBy: undefined }
console.log( result4 ); // { column: 'id', orderBy: 'ASC' }    
```   

## License
[MIT](LICENSE)