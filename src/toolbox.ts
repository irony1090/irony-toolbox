import { DIMENSION_FORM, equals, isBlank, isNumberForm, isString, isUndeclared } from "@irony0901/format";

// import { ArrayElementType, NN, PathString, Range, Relation } from "./type/index.type";

export * from "@irony0901/format";
export type ObjectType<T> = {
  new (): T;
} | Function;

export type Bridge<Self, Inverse> = {
  self: Partial<Record<keyof Self, Partial<Self[keyof Self]> >>,
  inverse: Partial<Record<keyof Inverse, Partial<Inverse[keyof Inverse]> >>
}

export type Range<T> = {
  start?: T,
  end?: T
}

export interface Around<T> {
  prev?: T;
  next?: T;
}

export type Relation<
  Self, Inverse,
  // FieldName extends keyof Self = {
  //   [P in keyof Self]?:ArrayElementType<Self[P]> extends Inverse
  //   ? P
  //   : never
  // }[keyof Self],
  // FieldIsMany = Self[FieldName] extends Array<unknown> ? true : false
> = {
  fieldIsMany?: boolean,
  bridges: Array<Bridge<Self, Inverse>>,
  fieldName: {
    [P in keyof Self]?: ArrayElementType<Self[P]> extends Inverse
    ? P
    : never
  }[keyof Self]
} 

export type StartString<
  Start, Separator, 
  S extends string|number = Start extends string|number ? Start : never, 
  SP extends string|number = Separator extends string|number ? Separator : never 
> = `${S}`|`${S}${SP}`|`${S}${SP}${string}`;
export type EndString<
  End, Separator, 
  E extends string|number = End extends string|number ? End : never,
  SP extends string|number = Separator extends string|number ? Separator : never, 
> = `${E}`|`${SP}${E}`|`${string}${SP}${E}`;

export type NN<T> = NonNullable<T>;


export type PickRecord<KorT, T> = Pick<Record<string, T>, 
  KorT extends string 
  ? KorT 
  : keyof KorT extends string ? keyof KorT : never 
>

export type ArrayElementType<T> = T extends Array<infer U>
  ? U : T
//배열의 요소 타입을 얻는 ElementType 이라는 조건부 타입을 정의한다.
// export type ElementType<T> = T extends unknown[] ? T[number] : T;
//infer문으로 새로운 타입 변수 E를 선언했다
//ElementType2에 어떤 T를 전달했느냐를 보고 E의 타입을 추론한다. 
// export type ElementType<T> = T extends Array<infer E> ? E : T;

export type ElementType<T> = T extends any[]
  ? T[number]
  : T extends object
    ? T[keyof T]
    : T

export type Replace<T, R> = Omit<T, keyof R> & R;

export type PathString<T> = StartString<keyof T, '.'>




export const pxToRem = (value:number, rootSize:number|undefined = 16) => 
  `${value / rootSize}rem`;

const UNIT_FORM = /[^\s\,\.]+/;
const NUMBER_FORM = /[\-\+]?\d*(\.\d+)?/;
type DigitAndUnit = {
  digit?: number,
  unit?: string
}
export const getDigitAndUnitList = (dimension: string): Array<DigitAndUnit> => {
  
  const arr:RegExpMatchArray|null = dimension.match(DIMENSION_FORM);
  if(!arr || arr.length === 0) return [];

  return arr.filter(keyword => keyword).map(keyword => {
      const numberForm:RegExpMatchArray|null = keyword.match(NUMBER_FORM)

      if( !numberForm || numberForm.length === 0 ) return {};
      const digit = Number(numberForm[0]);

      const unitForm:RegExpMatchArray|null = keyword.replace(numberForm[0], '').trim().match(UNIT_FORM);
      if( !unitForm || unitForm.length === 0) return {digit};
      const unit = unitForm[0];
      return {
        digit, unit
      }
    }).filter(digitAndUnit => digitAndUnit.digit);
}

export const getDigitAndUnit = (dimension: string): DigitAndUnit|{} =>{
  const digitAndUnitList = getDigitAndUnitList(dimension);
  return digitAndUnitList.length === 0 ? {} : digitAndUnitList[0];
}

type NumberAndPad = {
  value: any;
  start?: string;
  end?: string;
}
export const isNumberAndPad = ({value, start='', end=''}:NumberAndPad):string|undefined => {
  if(!isNumberForm(value) || !value) 
    return undefined;

  return `${start}${value}${end}`;
}



export const randomInt = (max: number, min: number) => {
  // Math.random() * (max - min);
  return Math.floor(Math.random() * (max - min)) + min;
}

export const initNumber = (obj: any, def?: number): number => {
  // const result = obj * 1;
  if( isNumberForm(obj) )
    return Number(obj);
  // else if( def === undefined ) 
  //   return NaN;
  else
    return def;
}
export const initString = (obj: string|string[]|undefined, def?: string): string|null|undefined => {
  if(!obj)
    return def;
  else if(Array.isArray(obj))
    return obj[0];
  else
    return obj;
  
}

export const toQuery = (obj:any, encode?: any): string => {
  let result = '';
  if(obj && typeof obj === 'object')
    Object.keys(obj).forEach(k =>{
      const item:any = obj[k];
      if(Array.isArray(item)){
        item.forEach(v => {
          if( !isUndeclared(v) ) result += `${k}=${ !isUndeclared(encode) ? encodeURIComponent(v): v}&`
        })
      }else if( !isUndeclared(item) ){
        result += `${k}=${!isUndeclared(encode) ? encodeURIComponent(item) : item}&`
      }
      // console.log(item);
    })
  
  if(result.endsWith('&')) result = result.substr(0, result.length-1);
  // if(result.endsWith('?')) result = '';
  return result;
}

export const getProperty = <T, K extends keyof T>(o: T, name: K): T[K]|undefined => {
  if(!o) return undefined;
  const val: T[K]|undefined = o[name];
  return val ? val : undefined;
}

// getProperty({src:'sss', sss: 'asd'}, 'src');
// export const makeCSSProperties = 
//   < T extends Record<string, CSSProperties>>(properties: T): T => properties;


export interface HasKeyProp {
  key: string;
}

export const pick = <T, K extends keyof T = keyof T>(
  object: T, 
  keys?: Array<K>
// ): Pick<T, K> | undefined =>{
): Pick<T, K> | undefined =>{
// export const pick = <T, K extends keyof T, F>(object: T, keys: Array<K>, filter?:(key: K, val:T[K]) => F): Pick<T, K>|Record<K, F> | undefined =>{
  if(!object)
    return undefined;
  const obj:Record<K, Exclude<T[K], undefined>>|any = {}; 
  const keys_: Array<any> = keys || Object.keys(object);
  const fail = keys_.some(key => {
    let val:T[K] = object[key] ;
    if( isUndeclared(val) ) return true;
    // val = filter? filter(key, val) as F : val;
    // if( isUndeclared(val) ) return true;
    obj[key] = val;
    return false;
  })

  if(fail) return undefined;

  return obj;
}

// export type IBuilder<T> = {
//   [K in keyof T]: (arg: T[K]) => IBuilder<T>
// } & { build(): T}


export const createArr = (startOrEnd:number, end?:number):Array<number> => {
  const list = [];
  if(end){
    for(let i=startOrEnd; i<end; i++)
      list.push(i);
  }else{
    for(let i=0; i<startOrEnd; i++)
      list.push(i);
  }
  return list;
}

export const elementType = <T, K extends keyof T = keyof T>(arr: Array<unknown>, keys: Array<K> ) : arr is Array<T> => {
  if(!arr || arr.length === 0)
    return false;
  else
    return !keys.some(k => !Object.keys(arr[0]).some(elementKey => elementKey === k) )
}

export const deepForEach = (obj: any, predict: (key: string|number, value: any, wrapper: any) => any) => {
  if( !obj ) return;

  const repeat = (key: string|number, val: any, wrapper: any) => {
    if(Array.isArray(val))
      val.forEach((v, i) => repeat(i, v, val));

    else if(val && typeof val === 'object' && !(val instanceof Date))
      Object.keys(val).forEach(k => repeat(k, val[k], val));

    else{
      const modify:any = predict(key, val, wrapper);
      if(modify !== undefined)
        wrapper[key] = modify;
      
    }
    
  }

  if(Array.isArray(obj))
    obj.forEach((v,i) => repeat(i, v, obj));
  else if(typeof obj === 'object')
    Object.keys(obj).forEach(k => repeat(k, obj[k], obj))
  else
    throw Error('target is not object or array');

  // if(Object.is)
}

// type SelectInfo<V = unknown, W = unknown> = {
//   key?: string|number;
//   absoluteKeys?: Array<string>;
//   val: V;
//   wrapper?: W;
//   depth: number;
// }
type LocationInfo<U, K extends PathString<U>, F> = {
  root: any;
  absoluteKeys: Array<string>;
  absoluteKey: string;
  wrapper: U;
  fieldName: K;
  field: F;
}
// type DeepSelect<T, R, W> = {
//   obj: T;
//   key: PathString<T>;
//   selectInfo: SelectInfo<R, W>;
// }

export const deepSelect = <R = any, W = any, T = any>( 
  obj: T, key: PathString<T> 
): LocationInfo<W, PathString<W>, R>  => {
// export const deepSelect = <SI extends DeepSelect<unknown, unknown, unknown>>( 
//   obj: SI['obj'], key: SI['key'] 
// ): SI['obj']  => {
  if( !obj || !key )
    return undefined;
  const keys = key.split('.').filter( k => !isUndeclared(k) && !isBlank(k)  );
  return keys.reduce( (result, k) => {
    result.wrapper = result.field;
    result.field = result.field?.[k];
    result.fieldName = k as never;
    result.absoluteKeys.push(k);
    result.absoluteKey = result.absoluteKeys.join('.')
    return result;
    
}, { field: obj, absoluteKeys: [] } as LocationInfo<never, never, never>) as any

}

export const deepSelectFlatMap = <R, V, W, T>(
  obj: T, abstractKey: PathString<ArrayElementType<T>>, predict: (si: LocationInfo<W, never, V>) => R 
): Array<R> => {
  if( !obj )
    return [];

  let keys = abstractKey.split('.').filter( k => !isUndeclared(k) && !isBlank(k) );
  
  // const predict 
  const getLocationInfos = (o: any, root: any, abstKeys: Array<string>, result: [] = []): Array<LocationInfo<unknown, never, unknown>> => {
    // console.log('[!?]', o);
    if( Array.isArray(o) ){
      return o.reduce( (rst, el, i) => {
        const abstKeys_ = [...abstKeys, i.toString()];
        if( Array.isArray(el) )
          getLocationInfos(el, root, abstKeys_, rst)
        else
          rst.push({
            absoluteKeys: abstKeys_,
            absoluteKey: abstKeys_.join('.'),
            field: el,
            fieldName: i.toString(),
            wrapper: o,
            root
          })
        
        return rst;
      }, result || [])
    }else
      return result;
  }

  return keys.reduce( (init, k, dep) => {

    return init.reduce( (refresh, {root, field, absoluteKeys}) => {
      const asltKeys = [...absoluteKeys, k];
      const refField = field?.[k];
      if(  isUndeclared(refField)  )
        return refresh;
      const fieldLocations = Array.isArray(refField) 
      ? getLocationInfos(refField, root, asltKeys)
      : undefined;
      if( fieldLocations ){
        fieldLocations.forEach( (wraps, wrapsI) => {
          if( wraps.field ){
            const ref = {
              field: wraps.field,
              fieldName: wrapsI.toString(),
              wrapper: wraps.wrapper,
              root, 
              absoluteKeys: wraps.absoluteKeys,
              absoluteKey: wraps.absoluteKeys.join('.')
            } as any
            // console.log(`[${k}]`, ref);

            refresh.push(ref);
          }
        })
      }else{
        const ref = {
          wrapper: field,
          field: refField,
          fieldName: k,
          root,
          absoluteKeys: asltKeys,
          absoluteKey: asltKeys.join('.')
        } as any;

        if( keys.length-1 > dep )
          ref.wrapper = ref.field;

        // console.log(`[${k}]`, ref);
        
        refresh.push(ref);
      }
      
      return refresh;
    }, [] as Array<LocationInfo<unknown, never, unknown>>)

    // return init;
  }, initArray(obj).map( el => ({
    root: el,
    absoluteKeys: [],
    field: el
  })) as Array<LocationInfo<unknown, never, unknown>> )
  .map( predict )

  // let depth = 0;
  // // let nextKey = 
  // let init: Array<LocationInfo<unknown, never, unknown>> ;
  // while( keys.length > depth ){
  //   const k = keys[depth];
  //   if( depth === 0 ){
  //     init = initArray(obj).map( el => ({ 
  //       // wrapper: el, 
  //       // root: el, 
  //       // absoluteKeys: [k], 
  //       // absoluteKey: k,
  //       // field: el?.[k], 
  //       // fieldName: k
  //       root: el,
  //       absoluteKeys: [],
  //       field: el,
  //     }) ) as Array<LocationInfo<unknown, never, unknown>>
  //   }

  //   init = init.reduce( (refresh, {wrapper, root, field, absoluteKeys}) => {
  //     const asltKeys = [...absoluteKeys, k];
  //     const refField = field?.[k];
  //     if(  isUndeclared(refField)  )
  //       return refresh;
  //     const fieldLocations = Array.isArray(refField) 
  //     ? getLocationInfos(refField, root, asltKeys)
  //     : undefined;
  //     if( fieldLocations ){
  //       fieldLocations.forEach( (wraps, wrapsI) => {
  //         if( wraps.field ){
  //           const ref = {
  //             field: wraps.field,
  //             fieldName: wrapsI.toString(),
  //             wrapper: wraps.wrapper,
  //             root, 
  //             absoluteKeys: wraps.absoluteKeys,
  //             absoluteKey: wraps.absoluteKeys.join('.')
  //           } as any
  //           // console.log(`[${k}]`, ref);

  //           refresh.push(ref);
  //         }
  //       })
  //     }else{
  //       const ref = {
  //         wrapper: field,
  //         field: refField,
  //         fieldName: k,
  //         root,
  //         absoluteKeys: asltKeys,
  //         absoluteKey: asltKeys.join('.')
  //       } as any;

  //       if( keys.length-1 > depth )
  //         ref.wrapper = ref.field;

  //       // console.log(`[${k}]`, ref);
        
  //       refresh.push(ref);
  //     }
      
  //     return refresh;
  //   }, [] as Array<LocationInfo<unknown, never, unknown>>)
    
  //   // console.log(`[${k}]`, init);
  //   depth++;
  // }
  // // console.log('[RESULT]', init);
  // return init.map( predict );
}

const predictClone = (rst: any, v: any, i: number|string, ): any => {
  
  if( Array.isArray(v) ){
    // console.log('array',i)
    rst[i] = v.reduce(predictClone, []) 
  }else if( v instanceof Date ){
    // console.log('date',i)
    rst[i] = new Date(v.getTime());
  }else if( v && typeof v === 'object' ){
    // console.log('object',i)
    rst[i] = Object.keys(v)
      .reduce( (wrap, key) => predictClone(wrap, v[key], key), {} )
  }else
    rst[i] = v;

  return rst;
}
export const deepClone = <T>(obj: T): T => {

  if( Array.isArray(obj) )
    return obj.reduce(predictClone, []);
  else if( typeof obj === 'object' )
    return Object.keys(obj).reduce((wrap, key) => predictClone(wrap, obj[key], key), {})
  else
    return obj;
}

// const makeProperties = <V, T extends Record<string, V> >(properties: T):T => properties;
// const makeProperties = <V, K>(properties: Map<K, V>):Map<K, V> => properties

// type Nullable<Origin, Nullable extends keyof Origin> ={
//   [P in Nullable ]?: Origin[P]
// }

// export const makeProperties = 
//   <V, T=V>(properties: T): Record<string, T> => {
//     const result:any = {} ;

//     for(const key in properties)
//       result[key] = properties[key];
    
//     return result as Record<typeof T, V>;
//   };
// export const makeProperties = 
//   <T = >(properties: T): T => properties


// type K_O<T> = Record<string, T|Record<string, ''>> ;
// type ArrayToObjectOption = {
//   priority?: 'ASC'|'DESC'
// }
// export const arrayToObject = <T, K extends keyof T = keyof T extends string ? keyof T : never>(
//     array: Array<T>, key: K, {priority = 'ASC'}: ArrayToObjectOptions = {}
//   ):Record<string, T> => {
  
//   if(!array) 
//     return {};

//   return array.filter( el => !isUndeclared(el[key]) )
//     .reduce<Record<string, T>>((result, el) => {
//       const elementKey = el[key]+'';
//       if( (priority === 'ASC' && !result[elementKey]) 
//           || priority === 'DESC'
//       )
//         result[elementKey] = el;

//       return result;
//     }, {})
// }
class ArrayToObject {
  public static toObject<T, 
    P1 extends keyof NN<T>,
  >(array: Array<T>, prop1: P1): Record<string, T|undefined>

  public static toObject<T, 
    P1 extends keyof NN<T>,
    P2 extends keyof NN<NN<T>[P1]>
  >(array: Array<T>, prop1: P1, props2: P2): Record<string, T|undefined>

  public static toObject<T, 
    P1 extends keyof NN<T>,
    P2 extends keyof NN<NN<T>[P1]>,
    P3 extends keyof NN<NN<NN<T>[P1]>[P2]>
  >(array: Array<T>, prop1: P1, prop2: P2, prop3: P3): Record<string, T|undefined>

  public static toObject(array: Array<any>, ...props: Array<string>): any {
    // if(!obj) return undefined;
    if(!array)
      return {};

    return array.filter( el => 
      !isUndeclared(
        el && props.reduce((result, prop) => result == null ? undefined : result[prop], el)
      )).reduce((result, el) => {
        const elementKey = props.reduce((rst, prop) => result == null ? undefined : rst[prop], el);
        // if( !result[elementKey])
        result[elementKey] = el;
  
        return result;
      }, {})
    // const key = obj && props.reduce(
    //   (result, prop) => result == null ? undefined : result[prop],
    //   obj
    // );

  }
}
export const arrayToObject = ArrayToObject.toObject;

// export const getUTCRange = (utcRange: Array<string>): [Date, Date] => {
//   if(!utcRange || utcRange.length === 0 || utcRange.some(d => !(isBlank(d) || isNumberForm(d))) )
//     return undefined;
//   const start = dayjs(Number(utcRange[0]));
//   const end = dayjs(Number(utcRange[1]));
//   return [ 
//       (!isBlank(utcRange[0]) && start.isValid()) ? start.toDate() : null, 
//       (!isBlank(utcRange[1]) && end.isValid()) ? end.toDate() : null,
//     ]
// }

export const getRange = <R>(
  value: string, predict: (val: string) => R, separator: string = ',', 
): Range<R> => {
  if( isUndeclared(value) )  
    return undefined;
  else if( isBlank(value) )
    return {}
  
  const result = splitToObject(value, ['start', 'end'], {separator});
  if(!result)
    return undefined;
  
  return Object.keys(result).reduce( (rst, key) => {
    rst[key] = predict(result[key]);
    return rst;
  }, {} as Range<R>)
}

// export const getRangeString = (value: string, separator: string = ','): Range<string> => {
//   if( isUndeclared(value) )  
//     return undefined;
//   else if( isBlank(value) )
//     return {}
  
//   return splitToObject(value, ['start', 'end'], {separator})
//     // return [null, null];
  
//   // const arr = value.replace(/\s/, '').split(separator);

//   // return [
//   //   (arr[0] ? arr[0] : null),
//   //   (arr[1] ? arr[1] : null),
//   // ]
// }

// export const getRangeNumber = (value: string, separator: string = ','): Range<number> => {
  
//   const result = getRangeString(value, separator);
//   if(!result)
//     return undefined;

//   return Object.keys(value).reduce( (record, key)=>{
//     record[key] = initNumber(value[key])
//     return record;
//   } , {} as Range<number>)
// }

export const keysTypeGuard = <T extends Object, K extends keyof T = keyof T> (
  object: T
): Array<K> => {
  return Object.keys(object)
    .reduce<Array<K>>((arr, el) => {
      arr.push(el as K)
      return arr;
    }, [] );
}

// type Entries<T> = {
//   [K in keyof T]: [K, T[K]]
// }[keyof T][];
export const entriesTypeGuard = <T extends Object, K extends keyof T = keyof T> (
  object: T
): Array<[K, T[K]]> => {
  return Object.keys(object)
    .reduce<Array<[K, T[K]]>>((arr, el ) => {
      const key: K = el as K;
      arr.push([key, object[key]])
      return arr;
    }, [] );
}

export const isDeclaredProps = <T, K extends keyof T = keyof T>(
  target: T, requiredKeys?: Array<K>
): target is (T & Required<Pick<T, K>>) => {
  requiredKeys = requiredKeys || (!isUndeclared(target) && keysTypeGuard(target));
  return !isUndeclared(target) && !requiredKeys.some(key => isUndeclared(target[key]))
}


class DeepPropertyAccess {
  
  public static get<T,
    P1 extends keyof NN<T>>(obj: T, prop1: P1): NN<T>[P1] | undefined;

  // tslint:disable:max-line-length
  public static get<T,
    P1 extends keyof NN<T>,
    P2 extends keyof NN<NN<T>[P1]>>(obj: T, prop1: P1, prop2: P2): NN<NN<T>[P1]>[P2] | undefined;

  public static get<T,
    P1 extends keyof NN<T>,
    P2 extends keyof NN<NN<T>[P1]>,
    P3 extends keyof NN<NN<NN<T>[P1]>[P2]>>(obj: T, prop1: P1, prop2: P2, prop3: P3): NN<NN<NN<T>[P1]>[P2]>[P3] | undefined;

  public static get<T,
    P1 extends keyof NN<T>,
    P2 extends keyof NN<NN<T>[P1]>,
    P3 extends keyof NN<NN<NN<T>[P1]>[P2]>,
    P4 extends keyof NN<NN<NN<NN<T>[P1]>[P2]>[P3]>>(obj: T, prop1: P1, prop2: P2, prop3: P3, prop4: P4): NN<NN<NN<NN<T>[P1]>[P2]>[P3]>[P4] | undefined;

  public static get<T,
    P1 extends keyof NN<T>,
    P2 extends keyof NN<NN<T>[P1]>,
    P3 extends keyof NN<NN<NN<T>[P1]>[P2]>,
    P4 extends keyof NN<NN<NN<NN<T>[P1]>[P2]>[P3]>,
    P5 extends keyof NN<NN<NN<NN<NN<T>[P1]>[P2]>[P3]>[P4]>>(obj: T, prop1: P1, prop2: P2, prop3: P3, prop4: P4, prop5: P5): NN<NN<NN<NN<NN<T>[P1]>[P2]>[P3]>[P4]>[P5] | undefined;

  
  public static get<T,
    P1 extends keyof NN<T>,
    P2 extends keyof NN<NN<T>[P1]>,
    P3 extends keyof NN<NN<NN<T>[P1]>[P2]>,
    P4 extends keyof NN<NN<NN<NN<T>[P1]>[P2]>[P3]>,
    P5 extends keyof NN<NN<NN<NN<NN<T>[P1]>[P2]>[P3]>[P4]>,
    P6 extends keyof NN<NN<NN<NN<NN<NN<T>[P1]>[P2]>[P3]>[P4]>[P5]>>(obj: T, prop1: P1, prop2: P2, prop3: P3, prop4: P4, prop5: P5, prop6: P6): NN<NN<NN<NN<NN<NN<T>[P1]>[P2]>[P3]>[P4]>[P5]>[P6] | undefined;
  /* tslint:enable:max-line-length */

  // ...and so on...

  // the actual function to extract the property
  public static get(obj: any, ...props: string[]): any {
    return obj && props.reduce(
      (result, prop) => result == null ? undefined : result[prop],
      obj
    );
  }
}

export const getDeep = DeepPropertyAccess.get

class TimeElapseCls {
  curDate: number;

  start(): TimeElapseCls{
    this.curDate = Date.now();
    return this;
  }

  elapse(): number {
    return Date.now() - this.curDate;
  }
  
}

export const timeElapse = () => new TimeElapseCls()

type SplitToObjectOptions = {
  separator?: string;
  limit?: Array<Array<string|RegExp>>;
}
export const splitToObject = <T>(
  str: string, keys_: Array<keyof T>, 
  {limit, separator, def}: SplitToObjectOptions & {def?: Partial<{[K in keyof T]: string}>} = {} 
): Partial<{[K in keyof T]: string}> => {
  if(!str)
    return def || {};

  separator = separator || '-';
  def = def || {}
  
  const reqs = str.replace(/\s/, '').split(separator)
  return keys_.reduce((obj, key, i) => {
    const val = reqs[i];
    if(limit){
      obj[key] = (!limit[i] || limit[i].some(lm => lm instanceof RegExp ? lm.test(val) : lm === val))
        ? (val||def[key])
        : (undefined||def[key])
    } else
      obj[key] = val||def[key];
      
    return obj;
    }, {} as Partial<{[K in keyof T]: string}>)
}

export const otherDelete = <T>(obj: T, keys: Array<keyof T>) => {
  // const cloneVal = clone(obj);

  keysTypeGuard(obj)
  .filter(key => !keys.some(fitKey => fitKey === key))
  .forEach(key => delete obj[key] )
  
  return obj;
}

export const initObject = <T, K extends keyof T = keyof T>(
  obj: T, initProps: Partial<T>,
  filter: ( val: T[K], key: K ) => boolean = ( val: T[K] ) => !val
): T => {
  if(!obj)
    return entriesTypeGuard(initProps).reduce((result, [key, val]) => {
      result[key] = val;
      return result;
    }, {} as Partial<T>) as T;
  const keys = keysTypeGuard(obj).reduce((arr, key) => {
      if(!arr.includes(key))
        arr.push(key)
      return arr;
    }, keysTypeGuard(initProps))
  const c = deepClone(obj);
  keys
  .filter((key) => filter(c[key] as T[K] , key as K) && initProps[key] )
  .forEach( (key) => c[key] = initProps[key])
  return c;
}

export const initArray = <T>( 
  unknownObj: any, filter?: (unknownObj: T) => boolean
): Array<T> => {
  const arr:Array<T> = Array.isArray(unknownObj) ? unknownObj : [ unknownObj ];
  return filter ? arr.filter(filter) : arr
}

export const initBoolean = (value: any): boolean => {
  if( isUndeclared(value) )
    return undefined;
  else if( isNumberForm(value) )
    return parseInt(value.toString()) > 0;
  else if( isString(value) )
    switch( value.toLowerCase() ){
      case 'true' :
      case 'on' :
      case 'yes' :
        return true;
      default :
        return false;
    }
  else
    return !!value
}

export const stringsToObject = <T extends string, V = boolean> (arr: Array<string>, value?: Partial<Record<T, V>>): Partial<Record<T, V>> => {
  return arr.reduce((result, el) => {
    const exist = result[el];
    if(!exist)
      result[el] = value ? value[el] : true;
    
    return result;
  }, {}) as unknown as Record<T, V>
}

export const anythingToArray = <T, R, El = T extends Array<infer U> ? U : T, >(
  anything: T , predict: (item: El, index?: number, array?: Array<El>) => R
): Array<R> => {
  // if( isUndeclared(anything) )
  //   return undefined;

  if(Array.isArray(anything))
    return anything.map(predict)
  else
    return [ predict(anything as unknown as El) ];
}

export const isContains = <T>(
  subject: T, compare: any//  Partial<{[P in keyof T]: T[P]}>
): compare is Partial<T> => {
  if(!subject || !compare)
    return false;

  const subjectKeyVals = entriesTypeGuard(subject);
  const compareKeyVals = entriesTypeGuard(compare);
  if(subjectKeyVals.length === 0 || compareKeyVals.length === 0 )
    return false;

  return compareKeyVals.filter( ([key, val]) => 
      // !isUndeclared(subject[key]) && !isUndeclared(val)
      subject[key] === val
    ).length === compareKeyVals.length

}

export const getPick = <T, P extends keyof T>(
  obj: T, picks: Array<P>
): Pick<T, P> => {
  
  return picks.reduce((rst, key) => {
    rst[key] = obj[key];
    
    return rst;
  }, {} as Pick<T, P>);
  // return ;
}
export const getAverageRemainder = (
  price: number, length: number
): {remainder: number, average: number} => {
  const calc = { remainder: 0, average: 0 };
  if( price < length )
    calc.remainder = price;
  else{
    calc.remainder = price % length;
    calc.average = (price - calc.remainder) / length
  }
  return calc;
}

export const filterDuplication = <T>(
  arr: Array<T>, keyOrKeys?: keyof T|Array<keyof T>
): Array<T> => {

  if( keyOrKeys ){
    const keys = anythingToArray(keyOrKeys, k => k)
    return arr.reduce( (result, item) => {
      if( !item )
        return result;
      const compare = keys.reduce( (rst, k) => { 
          rst[k] = item[k as keyof T]; 
          return rst; 
        } , {} as any);
      // console.log(compare)
      if( !result.some( exist => isContains(exist, compare) ) )
        result.push(item);

      return result;
    }, [] as Array<T>)  
  }
  else 
    return arr.reduce( (result, el) => {
      if( !result.includes(el) )
        result.push(el);

      return result;
    }, [] as Array<T>)
}

export const setFieldRelation = <S, F extends ArrayElementType<S[keyof S]>>(
  subjects: Array<S>, fields: Array<F>, 
  relation: Relation<S, F>
) => {
  if( !subjects || subjects.length === 0 || !fields || fields.length === 0)
    return subjects;

  const { bridges, fieldName, fieldIsMany } = relation;
  subjects.forEach(item => {
    const finds = fields.filter( fd => 
        bridges.some( brg =>
          isContains(item, brg.self) && isContains(fd, brg.inverse)
        )
      ).sort( (a, b) => 
        bridges.findIndex( brg => isContains(a, brg.inverse))
        - bridges.findIndex( brg => isContains(b, brg.inverse))
      )

    if( finds.length > 0 )
      item[fieldName] = (fieldIsMany ? finds : finds[0]) as unknown as any
  })
  return subjects;
} 

type isRangeProps = {
  from?: number,
  to?: number;
}
const fromAndTo = ['from', 'to']
export const isRange = (compare: number, range: isRangeProps): boolean => {
  if( !isNumberForm(compare) 
    || !range 
  )
    return false;
  const keys = Object.keys(range);
  if( 
    keys.length === 0 
    || keys.length > 2 
    || keys.filter(k => !fromAndTo.includes(k)).length > 0 
  )
    return false;

  return entriesTypeGuard(range)
  .reduce( ( rst, [key, fromOrTo]) => {
    if( !rst )
      return rst;
    else if(isUndeclared(fromOrTo))
      return true;
    else
      return key === 'from' 
        ? compare >= fromOrTo
        : compare <= fromOrTo;
        
  }, true)
}

export type stringTypeGuardOption<T extends string>  = Partial<{
  default: T;
}>
export const initStringTypeGuard = <T extends string>(
  value: string, limit: Array<T|RegExp>, 
  option: stringTypeGuardOption<T> = {}
): T => {

  if( 
    limit.some( lmt  => 
      typeof lmt === 'string'
      ? lmt === value
      : lmt.test(value)
    ) 
  )
    return value as T;
  else 
    return option.default
}

export const filterVariable = <T>(
  origin: T, variable: Partial<T>
): Partial<T> => {
  if( !origin )
    return {};

  return entriesTypeGuard(origin)
    .reduce( (result, [key, val]) => {
      const variableVal = variable[key];
      if( variableVal !== undefined && !equals(variableVal, val) )
        result[key] = variableVal;
      return result;
    }, {} as Partial<T>)
}

export const getIdsRecord = <T, K extends keyof T>(
  entities: Array<T>, keys: Array<K> 
): Record<K, Array<T[K]>> => entities
  .filter( entity => !keys.some( key => !entity[key] ))
  .reduce(
    ( rst, entity ) => {
      keys.forEach( key => {
        const arr = rst[key];
        const pk = entity[key];
        if( !arr.includes(pk) )
          arr.push(pk);
      })
      return rst;
    },
    keys.reduce( (rst, key) => {
      rst[key] = [];
      return rst;
    }, {} as Record<K, Array<T[K]>>)
  )


// const test = {
//   t1: {
//     t2: {
//       t3: {
//         t4: {
          
//         }
//       },
//       t3_1: {
//         t3_1_4: 1
//       }
//     }
//   }
// }
// const tests = [
//   test,
// ]
// const a = getDeep(tests, 2, 't1', 't2');

// type Validation<T> = {
//   [K in keyof T]: boolean|Validation<T[K]>
// };
// export const validation = <T, K extends keyof T = keyof T>(
//     object: T
//   ): Validation<T> => {
//     return null;
// }
// export type KeyOrObject<T, K extends keyof T = keyof T> = Pick<T, K>;
// type Cons<H, T> = T extends readonly any[] 
//   ? ((h: H, ...t: T) => void) extends ((...r: infer R) => void) ? R : never
//   : never;
// type Prev = [
//   never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
//   11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]
// ]
// type Join<K, P> = K extends string | number 
//   ? P extends string | number 
//     ? `${K}${"" extends P ? "" : "."}${P}`
//     : never 
//   : never;

// type Paths<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
//   { [K in keyof T]-?: K extends string | number ?
//       `${K}` | Join<K, Paths<T[K], Prev[D]>>
//       : never
//   }[keyof T] : ""

// type Leaves<T, D extends number = 10> = [D] extends [never] ? never : T extends object ?
//   { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T] : "";

// const path = <T> (obj:T, arr: Array<Paths<T>>) => {

// }
