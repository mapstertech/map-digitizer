import {
  SAVE_GEOJSON
} from '../actions/index'

const geoJSON = (state = false, action) => {
  switch (action.type) {
    case SAVE_GEOJSON:
      return action.payload;
    default:
      return state
  }
}

export default geoJSON
