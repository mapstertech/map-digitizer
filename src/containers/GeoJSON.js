import { connect } from 'react-redux'
import GeoJSONComponent from '../components/GeoJSON'

const mapStateToProps = state => {
  return {
    canvas : state.canvas,
    geoJSON : state.geoJSON
  }
}

const GeoJSON = connect(
  mapStateToProps
)(GeoJSONComponent)

export default GeoJSON
