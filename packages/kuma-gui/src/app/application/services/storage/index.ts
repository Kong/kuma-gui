export default (prefix: string = 'kumahq-app', storage: Storage = window.localStorage) => {
  const get = async (key: string): Promise<object> => {
    try {
      return JSON.parse(storage.getItem(`${prefix}:${key}`) ?? '{}')
    } catch (e) {
      console.error(e)
    }
    return {}
  }
  const set = async (key: string, value: object): Promise<object> => {
    try {
      storage.setItem(`${prefix}:${key}`, JSON.stringify(value))
      return value
    } catch (e) {
      console.error(e)
    }
    return {}
  }

  return { get, set }
}
