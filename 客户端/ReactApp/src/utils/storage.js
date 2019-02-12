export default {
  getItem(name) {
    return sessionStorage.getItem(name)
  },
  setItem(name,data) {
    return sessionStorage.setItem(name,data)
  }
}