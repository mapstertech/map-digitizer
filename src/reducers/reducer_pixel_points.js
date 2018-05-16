import {
  PIXEL_POINTS_MATCHED
} from '../actions/index'

const pixel_points = (state = [], action) => {
  switch (action.type) {
    case PIXEL_POINTS_MATCHED:
      return action.payload;
    default:
      return state
  }
}

export default pixel_points
