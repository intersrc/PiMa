import Noty from 'noty'

export const cover = (object, payload) => {
  for (const key in payload) {
    if (object.hasOwnProperty(key)) {
      object[key] = payload[key]
    }
  }
}

Noty.setMaxVisible(20)
Noty.overrideDefaults({
  theme: 'mint',
  timeout: 300
})
export const notySuccess = (message) => {
  new Noty({
    type: 'success',
    text: message
  }).show()
}
export const notyError = (message) => {
  new Noty({
    type: 'error',
    text: message
  }).show()
}
