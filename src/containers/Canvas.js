import { connect } from 'react-redux'
import CanvasComponent from '../components/Canvas'

const mapStateToProps = state => {
  return {
    image: state.image,
    canvas : state.canvas
  }
}

const Canvas = connect(
  mapStateToProps
)(CanvasComponent)

export default Canvas
