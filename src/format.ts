import {v4 as uuidv4} from 'uuid';
import dayjs from "dayjs";

export const SPECIAL_CHARACTERS = /[~!@\#$%<>^&*\|\\\?\/]/g;
export const OTHER_THEN_NUMBER = /\D/g;
export const OTHER_THEN_NUMBER_AND_RELATION = /[^\d\.\-\+]/g;
export const NUMBER_FORM = /^[\-\+]?\d+(\.\d+)?$/;
export const DIMENSION_FORM = /[\-\+]?\d+(\.\d+)?\s*[^\n\s\b]*/g;
export const EMAIL_FORM = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
// export const TEL_FORM = /^(\+/?\d{2,3}(\)\s?|-|\s)?)?\d{1,3}(-|\s)?\d{3,4}(-|\s)?\d{3,4}$/;
// export const TEL_FORM = /(^\+\d{1,3}(\)\s?|-|\s)?)?^\d{1,3}(-|\s)?\d{3,4}(-|\s)?\d{3,4}/;
export const TEL_FORM = /^(\(\s*\+?\d{1,3}\s*\))?\d{1,3}(-|\s)?\d{3,4}(-|\s)?\d{3,4}/;

export const INT_FORM = /^\d+$/;
export const FLOAT_FORM = /^\d+\.\d+$/;
export const TAG_FORM = /\<\/?[a-z]+[^\<\>\\]*\/?\>/gi;
export const SPACE_BAR = /\s/g;
export const XML_FORM = /\<\/?[^<>]*\>/g;
// export const NUMBER_FORM = /^[\-\+]?((\d+\.?)|(\.?\d+)|(\d+\.\d+))$/;
export const WITH_COMMAS = /\B(?=(\d{3})+(?!\d))/g;
export const WITH_HYPHEN=/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/;

export const YYYYMMDDHHmmss= 'YYYYMMDDHHmmss';
export const YYYYMMDDHHmmssSSS = 'YYYYMMDDHHmmssSSS'; // year ~ millisecond
export const UNKNOWN = '-'; // 알 수 없음.(데이터 없음)


export type HttpMethod = 'POST'|'GET'|'PUT'|'PATCH'|'DELETE';
// export const HTTP_METHOD = {
//   POST: 'POST',
//   GET: 'GET',
//   PUT: 'PUT',
//   PATCH: 'PATCH',
//   DELETE: 'DELETE'
// }

const COMMA = ',';
export const EMPTY = '';

export const ONE_MINUTE = 60 * 1000,
  ONE_HOUR = ONE_MINUTE * 60,
  ONE_DAY = ONE_HOUR * 24,
  ONE_WEEK = ONE_DAY * 7,
  ONE_MONTH = ONE_DAY * 30,
  ONE_YEAR = ONE_DAY * 365;


/**a와 b의 내용이 같은지 비교
 * 순서가 달라도 다른 내용으로 인식 -> 자동 정렬(오브젝트 한정)
 * 
 * @param a 비교 대상 a
 * @param b 비교 대상 b
 */
 export const equals = (a:any, b:any): boolean => {
  if( !a || !b )
    return a === b 
  else if( typeof a !== typeof b )
    return false;
  else if( typeof a === 'object' && typeof b === 'object' ){
    if( a instanceof Date && b instanceof Date )
      return a.getTime() === b.getTime()
    else if( Array.isArray(a) && Array.isArray(b) ){
      const cloneA = JSON.stringify(a),
        cloneB = JSON.stringify(b);
      return cloneA === cloneB;
    } else
      return JSON.stringify(a, Object.keys(a).sort()) === JSON.stringify(b, Object.keys(b).sort());
    
  }
  else{
    // console.log('[?]', a, b)

    return a === b;
  }
}
  

export const equalsIgnoreCase = (a: string, b: string) =>
 a && b && a.toLowerCase() === b.toLowerCase()

export const isUndeclared = (target:any): target is undefined | null | typeof NaN =>
  (
    target === null || target === undefined 
    || (typeof target === 'number' && isNaN(target)) 
  );
// export const isNaN = (target:any):boolean => 
//   target === NaN;

/**숫자 포맷 구분
 * 
 * @param target 
 */
export const isNumberForm = ( target: any ) : target is number | string =>
  typeof target === 'string' 
    ? NUMBER_FORM.test(target)
    : Number(target) === target;

  // Number(num) === num;
export const isString = (target: any) : target is string => 
    typeof target === 'string';

/** README!!!
 *  문자열 관련
 *  OUTPUT은 반드시 기본값이 들어갈것
 *  (undefind 또는 null이 OUTPUT으로 나오지 않도록)
 */

 /**금액 3자리수마다 콤마 찍기
  * 
  * @param target : 문자열
  * @param def : 기본 값
  */
  export const numberWithCommas = (target: string|number|undefined, def:number|string=EMPTY):string => {
    if(!target) return def.toString();
  
    return target.toString()
      .replace(OTHER_THEN_NUMBER, EMPTY)
      .replace(WITH_COMMAS, COMMA);
  
  }

  type LimitNumberOptions ={
    def: number|string;
    max?: number;
    min?: number;
  }
  const limitNumberOpts:LimitNumberOptions = {
    def: '',
    max: 100
  }
  /** 입력 숫자 제한
   * 
   * @param target 문자열
   * @param {
   *  def : 기본 값
   *  min : 최소 값
   *  max : 최대 값 
   * }
   */
  export const limitNumber = (target: string | undefined,  {def=EMPTY, max=100, min}=limitNumberOpts):string => {
    if(!target || !isNumberForm(target)) return def.toString();
    const stringNum = target.replace(OTHER_THEN_NUMBER_AND_RELATION, EMPTY);
    if(stringNum === EMPTY) return def.toString();
    const num = Number(stringNum);
    if(min && min > num)
      return min.toString();
    else if(max && max < num)
      return max.toString();
    else 
      return target
  }

  /** 빈 문자열 구분. tag는 전부 테스트에서 제외
 * 
 * @param target : 문자열
 */
export const isBlank = (target:string|number):boolean =>{
  return !isUndeclared(target) 
    && (
      target === EMPTY 
      || (
        typeof target === 'string'
          && target.replace(TAG_FORM, EMPTY).replace(SPACE_BAR, EMPTY) === EMPTY
      )
    )
}

export const isFloat = ( num:any ):boolean => 
  isNumberForm(num) && Number(num) % 1 !== 0;

export const numberWithHyphen =(val:string | undefined,def=''):string=>{
  if(!val) return def;
  return val.replace(OTHER_THEN_NUMBER,'').replace(WITH_HYPHEN,'$1-$2-$3').replace("--", "-");
}

export const priceCreate =(val:string | undefined,def=0):number=>{
  if(!val) return def;
  const parseVal:number =parseInt(val.replace(OTHER_THEN_NUMBER,''));
  if(val.length>1&&parseInt(val.slice(0,1))<1){
    return parseInt(val.slice(1));
  }
  return isNaN(parseVal)?0:parseVal;
    
}

type PadTextProps = {
  text: string,
  start?: 'left'|'right',
  padChar?: string,
  excludeLength: number
}
export const hideTextExclude = ({
  text,
  start='left',
  padChar='_',
  excludeLength
}:PadTextProps):string => {

  if(start === 'left'){
    const lastNthText = text.substring(0, excludeLength);
    return lastNthText.padEnd( Math.max(excludeLength, text.length) , padChar);
  }else{
    const startNthText = text.slice(-excludeLength);
    return startNthText.padStart( Math.max(excludeLength, text.length), padChar);
  }

}

type MaxTextOptions = {
  ellipsis?: string;
}
export const maxText = (text: string, max:number, {ellipsis}: MaxTextOptions = {ellipsis: ''}): string => {
  if( !text ) return undefined;
  return Math.min(text.length, max) === max ? `${text.substring(0, max - ellipsis.length)}${ellipsis}` : text;
}

export const parseDate = (date:string|Date): Date|undefined =>{
  if(typeof date == 'string'){
    const nums:any = date.split(/\D/);
    return new Date( nums[0]*1, nums[1]-1, nums[2]*1, nums[3]*1, nums[4]*1, nums[5]*1 )
  }else if( date instanceof Date){
    return date
  }else{
    return undefined;
  }
}

type TimeOrDateOption = {
  timeSeparator?: string,
  dateSeparator?: string
}
export const timeOrDate = (milliseconds:string|number, opt:TimeOrDateOption={}):string => {
  if(!isNumberForm(milliseconds)) return '알수없음';
  const d = dayjs(milliseconds).toDate();
  // const d: Date|undefined = moment(date).;
  // if(!d || d.getTime() === NaN)
  //   return '알수없음';

  let cur = new Date();
  cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate());

  // let diff =  d.getTime() - cur.getTime();
  const cur_time = cur.getTime();
  const target_time = d.getTime();
  // console.log(d);
  // console.log(`${d.getMonth()}, ${d.getDay()}`)
  if(cur_time < target_time && target_time > (cur_time+ONE_DAY) ){
    let hour = '' + d.getHours(),
    minutes = '' + d.getMinutes();
    hour = hour.length == 1 ? '0' + hour : hour;
    minutes = minutes.length == 1 ? '0' + minutes : minutes
    if(opt.timeSeparator)  
      return `${hour}${opt.timeSeparator}${minutes}`;
    else
      return `${hour}시 ${minutes}분`;
  }else{
    let year = d.getFullYear(),
    month = '' + (d.getMonth() + 1),
    day =  '' + d.getDate();

    month = month.length == 1 ? '0' + month : month;
    day = day.length == 1 ? '0' + day : day;
    if(opt.dateSeparator)
      return `${year !== cur.getFullYear() ? `${year}${opt.dateSeparator}` : ''}${month}${opt.dateSeparator}${day}`;
    else
      return `${year !== cur.getFullYear() ? `${year}년 ` : ''}${month}월 ${day}일` ;
  }
  // return '';
  
}

type BirthGenderProps = {
  year: string;
  month: string;
  day: string;
  gender: 'M' | 'F';
  age: number;
}
export const privateNumberToBirthGender = (privateNumber:string):BirthGenderProps|undefined => {
  const onlyNumber = privateNumber.replace(OTHER_THEN_NUMBER, '');
  if(onlyNumber.length < 7) return undefined;

  const firstOfRear = Number( onlyNumber.substring(6, 7) );
  if( firstOfRear === 1 || firstOfRear === 2
      || firstOfRear === 5 || firstOfRear === 6
  ){
    const year = `19${onlyNumber.substring(0, 2)}`;
    return {
      year,
      month: onlyNumber.substring(2, 4),
      day: onlyNumber.substring(4, 6),
      gender: firstOfRear === 1 || firstOfRear === 5 ? 'M' : 'F',
      age: Number(dayjs().format('YYYY')) - Number(year)
    }
  }else if( firstOfRear === 9 || firstOfRear === 0 ){
    const year = `18${onlyNumber.substring(0, 2)}`;
    return {
      year,
      month: onlyNumber.substring(2, 4),
      day: onlyNumber.substring(4, 6),
      gender: firstOfRear === 9 ? 'M' : 'F',
      age: Number(dayjs().format('YYYY')) - Number(year)
    }
  }else{
    const year = `20${onlyNumber.substring(0, 2)}`;
    return {
      year,
      month: onlyNumber.substring(2, 4),
      day: onlyNumber.substring(4, 6),
      gender: 
        firstOfRear === 3 
        || firstOfRear === 7
          ? 'M' : 'F',
      age: Number(dayjs().format('YYYY')) - Number(year)
    }
  }

  // if( firstOfRear === 1 || firstOfRear === 2 ) {        // 1900

  // }else if( firstOfRear === 3 || firstOfRear === 4 ) {  //2000

  // }else if( firstOfRear === 9 || firstOfRear === 0 ) {  // 1800

  // }else if( firstOfRear === 5 || firstOfRear === 6 ){   // 1900 

  // }else if( firstOfRear === 7 || firstOfRear === 8){    // 2000

  // } 
}

type aboutDate_opt ={
  cur?: Date ,
  excess?:string,
  under?:string
}
export const aboutDate = (milliseconds:string|number, opt:aboutDate_opt|undefined ): string => {
  if(!isNumberForm(milliseconds)) return '알수없음';
  
  let cur;
  if(opt)
    cur = opt.cur;
  if(!cur) cur = new Date();


  const d = dayjs(milliseconds).toDate();

  const d_long = d.getTime(),
  cur_long = cur.getTime();

  let diff = cur_long - d_long;

  if(diff > 0){ // 양수. 과거
    if(opt?.under) return opt.under;

    if(diff > ONE_YEAR){
      return `${Math.floor(diff / ONE_YEAR)}년 전`
    }else if(diff > ONE_MONTH){
      return `${Math.floor(diff / ONE_MONTH)}달 전`
    }else if(diff > ONE_WEEK){
      return `${Math.floor(diff / ONE_WEEK)}주일 전`
    }else if(diff > ONE_DAY){
      return `${Math.floor(diff / ONE_DAY)}일 전`
    }else if(diff > ONE_HOUR){
      return `${Math.floor(diff / ONE_HOUR)}시간 전`
    }else if(diff > ONE_MINUTE){
      return `${Math.floor(diff / ONE_MINUTE)}분 전`
    }else {
      return '방금전'
    }
  }else{  //음수. 미래
    if(opt?.excess) return opt.excess;

    diff = Math.abs(diff);
    if(diff > ONE_YEAR){
      return `${Math.floor(diff / ONE_YEAR)}년 후`
    }else if(diff > ONE_MONTH){
      return `${Math.floor(diff / ONE_MONTH)}달 후`
    }else if(diff > ONE_WEEK){
      return `${Math.floor(diff / ONE_WEEK)}주일 후`
    }else if(diff > ONE_DAY){
      return `${Math.floor(diff / ONE_DAY)}일 후`
    }else if(diff > ONE_HOUR){
      return `${Math.floor(diff / ONE_HOUR)}시간 후`
    }else if(diff > ONE_MINUTE){
      return `${Math.floor(diff / ONE_MINUTE)}분 후`
    }else {
      return '잠시후'
    }
  }

}

type CreateUuidProps = {
  prefix?: string;
  suffix?: string;
  length: number
} 
export const createUuid = ({prefix= '', suffix= '', length= 64}:CreateUuidProps): string => {
  let result:string = prefix;
  
  while((result.length + suffix.length) <= length  ) 
    result = `${result}${uuidv4().replace(/-/g, '')}`;

  if(suffix.length > length){
    result = suffix.substring(0, length);
  }else if((result.length + suffix.length) > length){
    result = `${result.substring(0, length -suffix.length)}${suffix}`;
  }else{
    result = `${result}${suffix}`;
  }

  return result;
}

export const dataSizeParse=(size:number)=>{
  const s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
  const e = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, e)).toFixed(2) + " " + s[e];
}

const TEL_INTERNATIONAL_FORMAT = /^\(\s*\+?\d{1,3}\s*\)/;
// const TEL_LOCAL_FORMAT = /\d{1,3}/;
// const TEL_FIRST_FORMAT = /\d{3,4}/;
// const TEL_SECOND_FORMAT = /\d{3,4}/;
// const TEL_INIT_FORMAT = /[^\d\+\(\)\-\s]/g;
const TEL_BOUND_FORMAT = /\s|\-/;

export type ParseTel = {
  international?: string;
  format: Array<string>;
  fullFormat: string;
}
export const parseTel = (tel: string): ParseTel => {
  if( !tel )
    return null;
    
  let international: string = null;
  if( TEL_INTERNATIONAL_FORMAT.test(tel) )
    international = TEL_INTERNATIONAL_FORMAT.exec(tel.replace(/\s/g, ''))
    [0]?.replace(/(?<=\()(?=\d+\))/, '+');

  const tel_ = tel
  // .replace(TEL_INTERNATIONAL_FORMAT, '')
    .replace(/\(.*\)/, '');
  const onlyNumber = tel_.replace(/[^\d]/g, '');
  const rst = [ 0, 1, 2 ]
  .reduce( (result, i) => {
    if( i < 3 ){
      const val = result.reqFormat[i];
      const custom = maxText(
        val !== undefined 
        ? val 
        : result.remaining, 

        i === 0 ? 3 : 4
      );
      
      if( i < 2 || custom )
        result.format.push(custom);
      
      if( result.reqFormat[i+1] === undefined ){
        result.remaining = result.remaining.substring( custom.length )
        result.reqFormat[i] = custom;
        if(i < 2)
          result.reqFormat[i+1] = result.remaining
      }else 
        result.remaining = result.remaining.substring( val.length )
    }
    
    return result;
  }, { 
    remaining: onlyNumber, 
    cursor: 0, 
    format: [] as Array<string>, 
    reqFormat: tel_.split(TEL_BOUND_FORMAT).map( t => t.replace(/[^\d]/g, '')) } 
  )

  return {
    international,
    format: rst.format,
    fullFormat: `${international||''}${rst.format.join('-')}`
  };
}

export const equalsTel = (tel1: string, tel2: string ): boolean => {
  if( !tel1 || !tel2 )
    return false;
    
  const parseTel1 = parseTel(tel1),
    parseTel2 = parseTel(tel2);

  if( !parseTel1 || !parseTel2 )
    return false;

  // const tel1Full = `${parseTel1.international||''}${parseTel1.format}`,
  //   tel2Full = `${parseTel2.international||''}${parseTel2.format}`;
  // console.log('[!!!!!]COMPARE', parseTel1, parseTel2)

  return parseTel1.fullFormat === parseTel2.fullFormat;
}