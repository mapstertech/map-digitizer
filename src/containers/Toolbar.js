import { connect } from 'react-redux'
import ToolbarComponent from '../components/Toolbar'

const mapStateToProps = state => {
  return {
    image: state.image,
    canvas : state.canvas,
    geoJSON : state.geoJSON
  }
}

const Toolbar = connect(
  mapStateToProps
)(ToolbarComponent)

export default Toolbar
