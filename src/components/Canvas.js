import React, { Component } from 'react';
import '../css/Canvas.css';
// import Jimp from 'jimp/browser/lib/jimp';
import $ from 'jquery';

import { saveCanvas } from '../actions/index';

class Canvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      img : false,
      rotate : 0,
      scale : 1,
      active : false,
      canvasPointerEvents : false
    }
  }

  componentWillReceiveProps(nextProps) {
    var ctx = this.refs.canvas.getContext('2d');

    // Add file
    if(this.props.image.file!==nextProps.image.file) {
      var img = new Image();
      img.onload = function () {
         // this.refs.canvas.height = img.height;
         // this.refs.canvas.width = img.width;
         // Setup canvas
         ctx.fillStyle="rgba(0, 0, 200, 0)";
         ctx.fill();
         var imageRatio = img.width/img.height;
         if((img.width+200)>=this.refs.canvas.width) {
           img.width = this.refs.canvas.width-200;
           img.height = img.width/imageRatio;
           if((img.height+500)>=this.refs.canvas.height) {
             img.height = this.refs.canvas.height-200;
             img.width = img.height*imageRatio;
           }
         }
         ctx.drawImage(img,
           this.refs.canvas.width/2-img.width/2,
           this.refs.canvas.height/2-img.height/2,
           img.width,
           img.height
         );
         this.setState({img,ctx,active:true});
         this.props.dispatch(saveCanvas(this.refs.canvas));
      }.bind(this);
      img.src = nextProps.image.file.preview;
    }
  }

  dragChange(type, e) {
    var origin = {
      x : window.innerWidth/2,
      y : window.innerHeight/2
    };
    if(type==='rotate') {
      // Set up angle from center
      var s_rad = Math.atan2(e.pageY - origin.y, e.pageX - origin.x);
      var s_degrees = s_rad * (180/Math.PI);
      // Now do rotation
      this.state.ctx.save();
      this.state.ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
      this.state.ctx.translate(this.refs.canvas.width/2, this.refs.canvas.height/2);
      this.state.ctx.rotate(Math.PI / 180 * (s_degrees));
      this.state.ctx.drawImage(this.state.img, (-this.state.img.width*this.state.scale)/2, (-this.state.img.height*this.state.scale)/2, this.state.img.width*this.state.scale, this.state.img.height*this.state.scale); //draw the image ;)
      this.state.ctx.restore();
      // Rotate editor box
      var s_rad = Math.atan2(e.pageY - origin.y, e.pageX - origin.x);
      var s_degrees = s_rad * (180/Math.PI);
      this.setState({rotate:s_degrees});
    } else if(type==='resize') {
      var distanceFromTop = (this.refs.canvas.height-(this.state.img.height*this.state.scale))/2;
      var scale = (1 + (distanceFromTop-e.pageY)/500);
      this.state.ctx.save();
      this.state.ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
      this.state.ctx.translate(this.refs.canvas.width/2, this.refs.canvas.height/2);
      this.state.ctx.rotate(Math.PI / 180 * (this.state.rotate));
      this.state.ctx.drawImage(this.state.img, (-this.state.img.width*scale)/2, (-this.state.img.height*scale)/2, this.state.img.width*scale, this.state.img.height*scale); //draw the image ;)
      this.state.ctx.restore();
      this.setState({scale});
    }
    this.props.dispatch(saveCanvas(this.refs.canvas));
  }

  mouseMove(e) {
    // var imgData = this.state.ctx.getImageData(0,0,this.state.img.width,this.state.img.height);
    // var data = imgData.data;
    // var lastColor = false;
    // console.log(imgData);
    // // console.log(imgData);
    // Jimp.read($('.main-canvas')[0].toDataURL(), function (err, image) {
    //     // do stuff with the image (if no exception)
    //     console.log(image);
    //     image.scan(0, 0, 10, 10, function (x, y, idx) {
    //         // x, y is the position of this pixel on the image
    //         // idx is the position start position of this rgba tuple in the bitmap Buffer
    //         // this is the image
    //
    //         var red   = this.bitmap.data[ idx + 0 ];
    //         var green = this.bitmap.data[ idx + 1 ];
    //         var blue  = this.bitmap.data[ idx + 2 ];
    //         var alpha = this.bitmap.data[ idx + 3 ];
    //         console.log(red,green,blue);
    //
    //         // rgba values run from 0 - 255
    //         // e.g. this.bitmap.data[idx] = 0; // removes red from this pixel
    //     });
    // });

    // console.log(color_meter('#FFFFFF','#000000'))
    // for (var y = 0; y < imgData.height; y+10) {
    //   // if(y<20) {
    //     for (var x = 0; x < imgData.width; x+10) {
    //         var index = (y * imgData.width + x) * 4; // index of the current pixel
    //
    //         // if(x<10) {
    //          var red = data[index];
    //          var green = data[index+1];
    //          var blue = data[index+2];
    //          var hex = rgbToHex(red,green,blue);
    //
    //          if(lastColor) {
    //            if(color_meter(lastColor,hex)>50) {
    //              console.log(x,y);
    //            }
    //          }
    //          lastColor = hex;
    //        // } else {
    //        //   break;
    //        // }
    //     }
    //   // }
    // }
  }

  render() {

    var editorBoxStyle = this.refs.canvas&&this.state.img ? {
      height: this.state.img.height,
      width:this.state.img.width,
      left : (this.refs.canvas.width-this.state.img.width)/2,
      top : (this.refs.canvas.height-this.state.img.height)/2,
      pointerEvents : this.state.canvasPointerEvents ? 'auto' : 'none',
      transform : 'rotate('+this.state.rotate+'deg) scale('+this.state.scale+','+this.state.scale+')'
    } : {};

    return (
      <div className="editor-outer-div" style={this.props.imageLayer ? {display:'none'} : {display:'block'}}>
        <div ref="editor" className="edit-box" style={editorBoxStyle}>
          <div onMouseOver={() => this.setState({canvasPointerEvents:true})} onMouseOut={() => this.setState({canvasPointerEvents:false})} className="rotate-handle" draggable={true} onDrag={this.dragChange.bind(this,'rotate')}
              style={{marginTop:this.state.img ? this.state.img.height/2 : 0}} />
          <div onMouseOver={() => this.setState({canvasPointerEvents:true})} onMouseOut={() => this.setState({canvasPointerEvents:false})} className="resize-handle" draggable={true} onDrag={this.dragChange.bind(this,'resize')} />
        </div>
        <canvas style={{pointerEvents:'none',opacity:this.props.image.opacity}} className="main-canvas" ref="canvas" height={window.innerHeight} width={window.innerWidth} />
      </div>
    );
  }
}

function color_meter(cwith, ccolor) {

    if (!cwith && !ccolor) return;

    var _cwith  = (cwith.charAt(0)=="#") ? cwith.substring(1,7) : cwith;
    var _ccolor = (ccolor.charAt(0)=="#") ? ccolor.substring(1,7) : ccolor;

    var _r = parseInt(_cwith.substring(0,2), 16);
    var _g = parseInt(_cwith.substring(2,4), 16);
    var _b = parseInt(_cwith.substring(4,6), 16);

    var __r = parseInt(_ccolor.substring(0,2), 16);
    var __g = parseInt(_ccolor.substring(2,4), 16);
    var __b = parseInt(_ccolor.substring(4,6), 16);

    var p1 = (_r / 255) * 100;
    var p2 = (_g / 255) * 100;
    var p3 = (_b / 255) * 100;

    var perc1 = Math.round((p1 + p2 + p3) / 3);

    var p1 = (__r / 255) * 100;
    var p2 = (__g / 255) * 100;
    var p3 = (__b / 255) * 100;

    var perc2 = Math.round((p1 + p2 + p3) / 3);

    return Math.abs(perc1 - perc2);
}

function rgbToHex(red, green, blue) {
    var out = '#';

    for (var i = 0; i < 3; ++i) {
        var n = typeof arguments[i] == 'number' ? arguments[i] : parseInt(arguments[i]);

        if (isNaN(n) || n < 0 || n > 255) {
            return false;
        }

        out += (n < 16 ? '0' : '') + n.toString(16);
    }

    return out
}


export default Canvas;
