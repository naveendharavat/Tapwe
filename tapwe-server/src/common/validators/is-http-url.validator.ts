import { ValidationOptions, registerDecorator } from 'class-validator';
import { isHttpUrl } from '../utils/normalize.js';

export const HTTP_URL_MESSAGE = 'Enter a full link starting with https://';

export function IsHttpUrl(options?: ValidationOptions) {
  return (target: object, propertyName: string) =>
    registerDecorator({
      name: 'isHttpUrl',
      target: target.constructor,
      propertyName,
      options: { message: HTTP_URL_MESSAGE, ...options },
      validator: { validate: (value: unknown) => typeof value === 'string' && isHttpUrl(value) },
    });
}
