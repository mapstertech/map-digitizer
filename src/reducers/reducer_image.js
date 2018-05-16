import {
  UPLOAD_IMAGE,
  EDIT_IMAGE_OPACITY
} from '../actions/index'

const image = (state = { file : false, toggle : false, opacity: 0.8 }, action) => {
  switch (action.type) {
    case UPLOAD_IMAGE:
      return {
        file : action.payload,
        toggle : false,
        opacity: state.opacity
      }
    case EDIT_IMAGE_OPACITY:
      return {
        file : state.file,
        toggle : state.toggle,
        opacity : action.payload
      }
    default:
      return state
  }
}

export default image
