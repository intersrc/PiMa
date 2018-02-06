export const cover = (object, payload) => {
  for (const key in payload) {
    if (object.hasOwnProperty(key)) {
      object[key] = payload[key]
    }
  }
}
