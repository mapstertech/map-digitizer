import { connect } from 'react-redux'
import AppComponent from '../components/App'

const mapStateToProps = state => {
  return {
    image: state.image,
    pixel_points : state.pixel_points
  }
}

const App = connect(
  mapStateToProps
)(AppComponent)

export default App
