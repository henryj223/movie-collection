import {autoRehydrate} from 'redux-persist'
import configureStore from '../src/store/configureStore'
const store = configureStore({}, undefined, autoRehydrate());

export function getStore() {
  return store
}
