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
