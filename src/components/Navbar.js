import { connect } from 'react-redux'
import React, { Component } from 'react';
import mapsterLogo from '../assets/img/mapster.png';

class NavbarComponent extends Component {

  render() {
    return (
      <nav className="uk-navbar-container">
          <div className="uk-navbar-left">
              <ul className="uk-navbar-nav">
                  <li className="uk-active">
                    <a target="_blank" href="index.html">
                      <div className="mapster-box">
                        <img className="logo" src={mapsterLogo} />
                      </div>
                    </a>
                    <div className="subtitle"><strong>Map Digitizer</strong></div>
                    <a href="#how-to-use" className="sub-links">How to use</a>
                  </li>
              </ul>
          </div>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    canvas: state.canvas
  }
}

const Navbar = connect(
  mapStateToProps
)(NavbarComponent)

export default Navbar;
