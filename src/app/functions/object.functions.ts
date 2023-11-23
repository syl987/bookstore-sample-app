/**
 * Omits properties with `null` values and redefine the input objects type.
 */
export function omitNullProps<T extends object>(object: { [P in keyof T]: T[P] | null }): Partial<T> {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (value !== null) {
      return { ...acc, [key]: value };
    }
    return acc;
  }, {});
}

/**
 * Omits properties with `undefined` values and redefine the input objects type.
 */
export function omitUndefinedProps<T extends object>(object: Partial<T>): Partial<T> {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      return { ...acc, [key]: value };
    }
    return acc;
  }, {});
}

/**
 * Omits properties with `null` or `undefined` values and redefine the input objects type.
 */
export function omitNonExistingProps<T extends object>(object: { [P in keyof T]?: T[P] | undefined | null }): Partial<T> {
  return Object.entries(object).reduce((acc, [key, value]) => {
    if (value != null) {
      return { ...acc, [key]: value };
    }
    return acc;
  }, {});
}

/**
 * Returns a top level property value of an object by its key.
 */
export function getProperty<T extends object>(object: T, key: keyof T): T[keyof T] {
  return object[key];
}

/**
 * Returns a nested property value of an object by its dot-separated key chain.
 *
 * @param keys dot-separated chain of nested property names.
 *
 * @returns requested property value or `undefined`, if not found
 */
export function getNestedProperty(object: object, keys: string): any {
  return keys.split('.').reduce((result, key) => (result as any)[key], object);
}

/**
 * Returns an array of object entries.
 */
export function getObjectEntries<T extends object>(object?: T | null): [string, T[keyof T]][] {
  return Object.entries(object ?? {});
}

/**
 * Returns an array of object values.
 */
export function getObjectValues<T extends object>(object?: T | null): T[keyof T][] {
  return Object.values(object ?? {});
}

/**
 * Returns an array of object keys.
 */
export function getObjectKeys(object?: object | null): string[] {
  return Object.keys(object ?? {});
}
