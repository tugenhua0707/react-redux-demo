import { combineReducers } from 'redux'
import bbslist from './bbslist'
import utils from './utils'
const reducers = combineReducers({
  bbslist,
  utils
})
export default reducers

