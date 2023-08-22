export type AsyncMethodDecorator<Type = any> = <
  T extends (...args: any[]) => Promise<Type>
>(
  target: object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<Type>
) => TypedPropertyDescriptor<T> | void;
