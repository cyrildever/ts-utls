export interface TargetedClass<T> {
  new(): T
}

export interface ConvertJSON {
  toClass: <T>(from: string, using: TargetedClass<T>) => T
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
const toClass = <T>(from: string, cls: TargetedClass<T>): T => {
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

export const ConvertJSON = (): ConvertJSON => ({
  toClass: toClass
})
