import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../css/Toolbar.css';
import $ from 'jquery';

import '../utilities/redirect';

import { uploadImage, imageOpacity, pixelPointsMatched } from '../actions/index';

class Toolbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentColor : false,
      digitizerColor : false,
      digitizerEvents : []
    }
  }

  signup() {
    $.redirect("http://mapster.me/signup/",{
      canvas_data: this.props.canvas.toDataURL(),
      geoJSON_data: JSON.stringify(this.props.geoJSON)
    }, "POST", "_blank")
  }

  autoDigitize() {
    const { digitizerColor, digitizerEvents } = this.state;

    // First remove color picker events
    this.props.canvas.style.pointerEvents = 'none';
    this.props.canvas.style.cursor = 'auto';
    if(digitizerEvents.length>0) {
      this.props.canvas.removeEventListener('mousemove',digitizerEvents[0],false); // careful here
      this.props.canvas.removeEventListener('click',digitizerEvents[1],false); // careful here
    };

    var ctx = this.props.canvas.getContext('2d');
    var imageData = ctx.getImageData(0, 0, this.props.canvas.width, this.props.canvas.height);
    var data = imageData.data;
    var matchedPixelPoints = [];
    for (var i = 0; i < data.length; i += 4) {
      if(data[i]===digitizerColor[0]&&data[i + 1]===digitizerColor[1]&&data[i + 2]===digitizerColor[2]&&data[i+4]!==0) {
        data[i]     = 255;     // red
        data[i + 1] = 255; // green
        data[i + 2] = 255; // blue

        var currentPixel = i/4;
        var currentX = Math.floor(currentPixel % this.props.canvas.width);
        var currentY = Math.floor(currentPixel/this.props.canvas.width);
        matchedPixelPoints.push([currentX,currentY]);
      }
    }
    // So, this is the real magic.
    // Everything works as points now. The user could combine after
    //   basically, it's a line or a bunch of points
    //   can convert to polygon easily from a line after
    //  should be able to adjust tolerance (on color)
    //  and tolerance on size of feature (pixel skip)
    //  introduce contrast options to help ?
    console.log(matchedPixelPoints);
    ctx.putImageData(imageData, 0, 0);
    this.props.dispatch(pixelPointsMatched(matchedPixelPoints));
  }

  pickColor() {
    this.props.canvas.style.pointerEvents = 'auto';
    this.props.canvas.style.cursor = 'pointer';

    var mouseMoveEvent = this.props.canvas.addEventListener('mousemove',function(e) {
      var ctx = this.props.canvas.getContext('2d');
      console.log(e);
      var myImageData = ctx.getImageData(e.layerX, e.layerY, 1,1);
      this.setState({
        currentColor : myImageData.data
      })
    }.bind(this))

    var clickEvent = this.props.canvas.addEventListener('click',function(e) {
      var ctx = this.props.canvas.getContext('2d');
      var myImageData = ctx.getImageData(e.layerX, e.layerY, 1,1);
      this.setState({
        digitizerColor : myImageData.data
      })
    }.bind(this))

    this.setState({
      digitizerEvents : [mouseMoveEvent,clickEvent]
    })
  }

  render() {

    var test = true;

    return (
      <div className="overlay" style={this.props.image.file ? {opacity: 1} : {opacity:0}}>
        <div className="uploader">
          <div className="editor-tools" style={this.props.image.file ? {display:'block'} : {display:'none'} }>

            <div className="opacity-slider">
              <small>Opacity:</small>
              <Slider defaultValue={0.8} onChange={(val) => this.props.dispatch(imageOpacity(val))} min={0} max={1} step={0.05} />
            </div>

            <div onClick={this.props.imagePin} className={"uk-button uk-button-small "+(!this.props.imageLayer ? 'uk-button-secondary' : 'uk-button-default')}>
              {!this.props.imageLayer ? 'Pin to map' : 'Unpin'}
            </div>

            <div className="drawing-tools"></div>

            {isJSON(this.props.geoJSON)&&JSON.parse(this.props.geoJSON).length>0 ?
              <div onClick={this.signup.bind(this)} className="uk-button uk-button-small uk-button-secondary" style={{marginTop:'15px'}}>
                Save shapes
              </div>
            : false }

            {test ?
              <div>
                <div className="tester-color" style={{
                  width: '20px',
                  height: '20px',
                  background: 'rgba('+this.state.currentColor[0]+','+this.state.currentColor[1]+','+this.state.currentColor[2]+','+this.state.currentColor[3]+')'
                }}></div>
                <div className="digitizer-color" style={{
                  width: '20px',
                  height: '20px',
                  background: 'rgba('+this.state.digitizerColor[0]+','+this.state.digitizerColor[1]+','+this.state.digitizerColor[2]+','+this.state.digitizerColor[3]+')'
                }}></div>
                <h4>Auto-digitize</h4>
                <p>If your map has colored borders or points, we can digitize them automatically.</p>
                <p>Pick the right color from your map and press auto-digitize.</p>
                <div onClick={this.pickColor.bind(this)} className="uk-button uk-button-small" style={{marginTop:'15px'}}>
                  Pick color
                </div>
                <div onClick={this.autoDigitize.bind(this)} className="uk-button uk-button-small" style={{marginTop:'15px'}}>
                  Auto-digitize
                </div>
              </div>
            : false }

          </div>

        </div>
      </div>
    );
  }
}

function isJSON(str) {
    try {
        return (JSON.parse(str) && !!str);
    } catch (e) {
        return false;
    }
}

export default Toolbar;
