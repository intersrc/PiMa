import Noty from 'noty'

export const cover = (object, payload) => {
  for (const key in payload) {
    if (object.hasOwnProperty(key)) {
      object[key] = payload[key]
    }
  }
}

const notyDefault = {
  theme: 'mint',
  timeout: 1000
}
export const notySuccess = (message) => {
  new Noty({
    ...notyDefault,
    type: 'success',
    text: message
  }).show()
}
export const notyError = (message) => {
  new Noty({
    ...notyDefault,
    type: 'error',
    text: message
  }).show()
}
