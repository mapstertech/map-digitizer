import { connect } from 'react-redux'
import React, { Component } from 'react';
import $ from 'jquery';
import FileSaver from 'file-saver';
import rewind from 'geojson-rewind';

import '../css/GeoJSON.css';
import '../utilities/redirect';

class GeoJSONComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      geoJSON : false
    }
  }

  signup() {
    $.redirect("http://mapster.me/signup/",{
      canvas_data: this.props.canvas.toDataURL(),
      geoJSON_data: JSON.stringify(this.props.geoJSON)
    }, "POST", "_blank")
  }

  download() {
    var featureCollection = {
      "type" : "FeatureCollection",
      "features" : this.props.features
    }
    featureCollection = rewind(featureCollection);
    var blob = new Blob([JSON.stringify(featureCollection)], {type: "application/json;charset=utf-8"});
    FileSaver.saveAs(blob, "mapster-export.geojson");
  }

  render() {
    var featureCollection = {
      "type" : "FeatureCollection",
      "features" : this.props.features
    }
    featureCollection = rewind(featureCollection);
    return (
      <div className="geojson-container" style={{
        marginRight : this.state.geoJSON ? '0' : '-28%',
        opacity : isJSON(this.props.geoJSON)&&JSON.parse(this.props.geoJSON).length>0 ? 1 : 0
      }}>
        <button onClick={() => this.setState({geoJSON:!this.state.geoJSON})} className="geojson-button uk-button uk-button-default uk-button-small">GeoJSON <i className="fa fa-code" /></button>
        {this.props.canvas&&isJSON(this.props.geoJSON)&&JSON.parse(this.props.geoJSON).length>0 ?
          <div style={{marginBottom:'10px'}}>
            <button onClick={this.signup.bind(this)} className="uk-button uk-button-default uk-button-secondary">Edit <i className="fa fa-save" /></button>
            <button onClick={this.download.bind(this)} style={{float:'right'}} className="uk-button uk-button-default uk-button-default">Download <i className="fa fa-download" /></button>
          </div>
        : false}
        <textarea
          disabled={true}
          className="geojson-area uk-textarea"
          value={this.state.geoJSON ? JSON.stringify(featureCollection, undefined, 4) : ''}
          style={{height:window.innerHeight-80}}></textarea>
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

const GeoJSON = connect()(GeoJSONComponent)

export default GeoJSON;
