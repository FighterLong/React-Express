import { createStore } from 'redux'
import userReducer from './reducer'
let store = createStore(userReducer)
export default store