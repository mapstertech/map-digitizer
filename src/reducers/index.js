import { combineReducers } from 'redux';

import image from './reducer_image';
import canvas from './reducer_canvas';
import geoJSON from './reducer_geoJSON';
import pixel_points from './reducer_pixel_points';

// Main reducers contain edit, add, delete methods
// All have submethods to modify state through copying (JSON.parse)
// One single error reducer to handle any errors passed through

const rootReducer = combineReducers({
  image,
  pixel_points,
  canvas,
  geoJSON
});

export default rootReducer;
