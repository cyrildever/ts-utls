export interface TargetedClass<T> {
  new(): T
}

export interface ConvertJSON {
  /**
   * @returns an instance of the targeted class type
   */
  toClass: <T>(using: TargetedClass<T>) => T
}

/* eslint-disable no-prototype-builtins,@typescript-eslint/strict-boolean-expressions,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */

/**
 * Transforms a JSON to the desired object
 * 
 * @param {string} from - The JSON source
 * @param {T} cls - The targeted type 
 * @returns the instance of the object
 *
 * @example
 */
const toClass = (from: string) => <T>(cls: TargetedClass<T>): T => {
  const using = new cls()
  const json = JSON.parse(from)
  const keys = Object.keys(using)
  keys.forEach(key => {
    if (json.hasOwnProperty(key)) {
      using[key as keyof T] = json[key]
    }
  })
  return using
}

/* eslint-enable no-prototype-builtins,@typescript-eslint/strict-boolean-expressions,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment */

/**
 * Base class for converting JSON string to custom type
 * 
 * @param {string} str - The JSON source
 */
export const ConvertJSON = (str: string): ConvertJSON => ({
  toClass: toClass(str)
})
