export const UPLOAD_IMAGE = 'UPLOAD_IMAGE';
export const SAVE_CANVAS = 'SAVE_CANVAS';
export const SAVE_GEOJSON = 'SAVE_GEOJSON';
export const PIXEL_POINTS_MATCHED = 'PIXEL_POINTS_MATCHED';
export const EDIT_IMAGE_OPACITY = 'EDIT_IMAGE_OPACITY';

export function uploadImage(image) {
  return {
    type : UPLOAD_IMAGE,
    payload : image
  }
}

export function saveCanvas(canvas) {
  return {
    type : SAVE_CANVAS,
    payload : canvas
  }
}

export function imageOpacity(opacity) {
  return {
    type : EDIT_IMAGE_OPACITY,
    payload : opacity
  }
}

export function saveGeoJSON(geoJSON) {
  return {
    type : SAVE_GEOJSON,
    payload : geoJSON
  }
}

export function pixelPointsMatched(points) {
  return {
    type : PIXEL_POINTS_MATCHED,
    payload : points
  }
}
