import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import $ from 'jquery';

import Navbar from './Navbar';
import GeoJSON from '../containers/GeoJSON';
import Toolbar from '../containers/Toolbar';
import Canvas from '../containers/Canvas';
import '../css/App.css';

import { saveGeoJSON } from '../actions/index';
import { uploadImage } from '../actions/index';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      features : [],
      map : false,
      imageLayer : false,
      modal : false
    }
  }

  componentDidMount() {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGVtcHJhbm92YSIsImEiOiJjaWd0c3M2MW4wOHI2dWNrbzZ5dWo1azVjIn0.x5sm8OjRxO9zO_uUmxYEqg';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        center: [-76.54, 39.18],
        zoom: 8
    });
    var Draw = new MapboxDraw({
      controls : {
        combine_features : false,
        uncombine_features : false
      }
    });
    map.addControl(Draw,'bottom-left')

    $('.mapbox-gl-draw_ctrl-draw-btn').each(function() {
      $(this).addClass('mapbox-draw-button');
      $(this).addClass('uk-button uk-button-default uk-button-small');
      $(this).appendTo('.editor-tools .drawing-tools');
    });


    map.on('draw.create', function (e) {
      // console.log(e.features);
      var existingFeatures = JSON.parse(JSON.stringify(this.state.features));
      existingFeatures = existingFeatures.concat(e.features);
      this.setState({
        features : existingFeatures
      })
    }.bind(this));

    map.on('draw.delete', function (e) {
      // console.log(e.features);
      var existingFeatures = JSON.parse(JSON.stringify(this.state.features));
      existingFeatures = existingFeatures.filter(feature => {
        return feature.id!==e.features[0].id;
      });
      this.setState({
        features : existingFeatures
      })
    }.bind(this));

    map.on('draw.update', function (e) {
      var existingFeatures = JSON.parse(JSON.stringify(this.state.features));
      existingFeatures = existingFeatures.map(feature => {
        return feature.id===e.features[0].id ? e.features[0] : feature;
      });
      this.setState({
        features : existingFeatures
      })
    }.bind(this));

    this.setState({map});

      // $(img).appendTo('body');
  }

  componentDidUpdate(prevProps,prevState) {
    this.props.dispatch(saveGeoJSON(JSON.stringify(this.state.features)));
  }

  componentWillReceiveProps(nextProps) {
    const { map } = this.state;
    if(this.state.imageLayer&&nextProps.image.opacity) {
      map.setPaintProperty(this.state.imageLayer, 'raster-opacity', nextProps.image.opacity);
    }
    if(this.props.pixel_points.length!==nextProps.pixel_points.length) {
      var geoJSONFeatures = [];
      nextProps.pixel_points.forEach(function(point) {
        var lngLat = map.unproject(point);
        geoJSONFeatures.push({
          "type" : "Feature",
          "properties" : {},
          "geometry" : {
            "type" : "Point",
            "coordinates" : [lngLat.lng,lngLat.lat]
          }
        })
      })
      console.log({
        "type" : "FeatureCollection",
        "features" : geoJSONFeatures
      });
    }
  }

  onDrop(files) {
    this.props.dispatch(uploadImage(files[0]));
  }

  imagePin() {
    const { map } = this.state;

    if(this.state.imageLayer) {
      map.removeLayer(this.state.imageLayer);
      map.removeSource(this.state.imageLayer);

      this.setState({
        imageLayer : false
      });
    } else {
        // Pinning the image based on what's the div it's in
        // Get top point of image
        var pointNW = [$('.main-canvas').offset().left,$('.main-canvas').offset().top];
        var pointNE = [$('.main-canvas').offset().left+$('.main-canvas').width(),$('.main-canvas').offset().top];
        var pointSE = [$('.main-canvas').offset().left+$('.main-canvas').width(),$('.main-canvas').offset().top+$('.main-canvas').height()];
        var pointSW = [$('.main-canvas').offset().left,$('.main-canvas').offset().top+$('.main-canvas').height()];
        var lngLatNW = map.unproject(pointNW);
        var lngLatNE = map.unproject(pointNE);
        var lngLatSE = map.unproject(pointSE);
        var lngLatSW = map.unproject(pointSW);
        var currentBounds = map.getBounds();
        map.addSource('current_image', {
           type: 'image',
           url: $('.main-canvas')[0].toDataURL(),
           coordinates: [
               [lngLatNW.lng, lngLatNW.lat],
               [lngLatNE.lng, lngLatNE.lat],
               [lngLatSE.lng, lngLatSW.lat],
               [lngLatSW.lng, lngLatSW.lat]
           ]
        });
        map.addLayer({
          "id": "current_image",
          "source": "current_image",
          "type": "raster",
          "paint" : {
            "raster-opacity" : this.props.image.opacity
          }
        });

        this.setState({
          imageLayer : 'current_image'
        })
    }

  }

  // Upload to site
  // - Make a placeholder video showing how it works
  // -- Improve geoJSON editor, allow property editing like mapbox IO

  // Longer bugs
  // -- iron out resizing
  // -- Too much resources being used, minimize work? Mouseovers?

  render() {

    var dropZoneStyle = {
      width:window.innerWidth-60,
      height:window.innerHeight-40,
      paddingTop:(window.innerHeight/2)-70,
      opacity: (this.props.image.file ? 0 : 1),
      pointerEvents: (this.props.image.file ? 'none' : 'auto'),
    }
    // <div className="demo-box"><a className="uk-button uk-button-default">See demo</a></div>

    return (
      <div className="uk-modal-page">
        <Navbar />
        <Dropzone className="main-dropzone" style={dropZoneStyle} onDrop={this.onDrop.bind(this)} >
          <div className="uk-button uk-button-secondary uk-button-large fileUpload">Click or drag image here</div>
        </Dropzone>
        <Toolbar imageLayer={this.state.imageLayer} imagePin={this.imagePin.bind(this)}/>
        <Canvas imageLayer={this.state.imageLayer} image={this.props.image} />
        <GeoJSON style={{height:window.innerHeight}} features={this.state.features} />
        <div id="map" style={{height:window.innerHeight}}></div>
        <hr />
        <div className="uk-container">
          <a name="how-to-use"></a><h2>Mapster Map Digitizer Tool</h2>
          <p>Welcome to the beta version of this tool! It is geared towards allowing an
          easy conversion between map images and an editable geoJSON.</p>
          <h4>How to use</h4>
          <p>First, you need a picture or image of the map you are trying to digitize. This could be an image like this one,
          or maybe even a map of Game of Thrones. Something to turn into a real map with coordinates!</p>
          <ol>
            <li>Drag your image or click the center button to add the image</li>
            <li>The image will appear in the middle of the map with rotation/resize handles around it</li>
            <li>You can adjust the transparency of the image</li>
            <li>Drag and pan and zoom around the map until you find the place on Earth your image represents</li>
            <li>Adjust the map and your image until it is placed at just the right size</li>
            <li>"Pin" the image to the map</li>
            <li>You can now click the buttons on the left-hand side to draw points or lines on the map</li>
            <li>A geoJSON will be produced on the right-hand side of the page for you to use in your applications!</li>
          </ol>
          <hr />
          <h4>Features</h4>
          <p>You are able to:</p>
          <ul>
            <li>Upload an image</li>
            <li>Adjust its opacity</li>
            <li>Adjust its rotation and size</li>
            <li>"Pin it" to the map, fixing it in place</li>
            <li>Draw and add geoJSON features</li>
            <li>Copy your resulting geoJSON from the sidebar</li>
            <li>Saving and exporting maps for embedding and editing in our interactive map editor</li>
          </ul>
          <p>A few coming features include:</p>
          <ul>
            <li>Ability to move between different map projections</li>
            <li>Automatic digitization</li>
          </ul>
        </div>
        <hr />
      </div>
    );
  }
}

export default App;
