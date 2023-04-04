/**
 * Return an array of non-numeric enum values.
 */
export function enumStringValues(enumType: object): string[] {
  return Object.values(enumType).filter(element => isNaN(Number(element)));
}
