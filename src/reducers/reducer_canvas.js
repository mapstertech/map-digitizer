import {
  SAVE_CANVAS
} from '../actions/index'

const canvas = (state = false, action) => {
  switch (action.type) {
    case SAVE_CANVAS:
      return action.payload;
    default:
      return state
  }
}

export default canvas
