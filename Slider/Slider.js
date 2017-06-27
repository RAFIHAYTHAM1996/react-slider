import React from 'react';
import PropTypes from 'prop-types';

export default class Slider extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mouseDown: false,
      translateX: "translateX(0px)",
      scale: "scale(1)"
    }
    this.DotRadius = 0;
    this.incrementalPos = 0;
    this.range = 0;
    this.PathRect = undefined;
    this.DotRect = undefined;

    this.currentValue = 0;
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleInputMove);
    document.addEventListener('mouseup', this.handleInputEnd);
    document.addEventListener('touchmove', this.handleInputMove);
    document.addEventListener('touchend', this.handleInputEnd);
    window.addEventListener('resize', this.handleUpdates);

    this.handleUpdates();
    this.currentValue = this.props.min;
  }

  componentDidUpdate() {
    this.calculateVariables();
  }

  componentWillUnmount(){
    document.removeEventListener('mousemove', this.handleInputMove);
    document.removeEventListener('mouseup', this.handleInputEnd);
    document.removeEventListener('touchmove', this.handleInputMove);
    document.removeEventListener('touchend', this.handleInputEnd);
    window.removeEventListener('resize', this.handleUpdates);
  }

  handleInputMove = (e) => {
    if(this.state.mouseDown){
      this.setPosition(e);
      this.props.onScrub(this.currentValue);
    }
  }

  handleInputStart = (e) => {
    this.setState({mouseDown: true, scale: "scale(1.1)"});
  }

  handleInputEnd = (e) => {
    if(this.state.mouseDown){
      this.setPosition(e, true);
      this.setState({mouseDown: false, scale: "scale(1)"});
      this.props.onRelease(this.currentValue);
    }
  }

  handleUpdates = (e) => {
    this.calculateVariables();
    this.setState({translateX: "translateX(" + (this.currentValue * this.incrementalPos) + "px)"});
  }

  calculateVariables(){
    this.PathRect = this.Path.getBoundingClientRect();
    this.DotRect = this.Dot.getBoundingClientRect();
    this.DotRadius = this.DotRect.width / 2;

    this.range = this.props.max - this.props.min;
    this.incrementalPos = Math.floor(this.PathRect.width / this.range);
  }

  setPosition(e, roundToClosest = false){
    let pos = 0,
        inputType = e.type.indexOf("mouse") >= 0 ? "mouse" : "touch";

    //Check Input Type
    if(inputType == "mouse"){
      pos = e.clientX - this.PathRect.left;
    }
    else if(inputType == "touch"){
      if(e.touches.length == 0){
        pos = this.currentValue * this.incrementalPos;
      } else{
        pos = e.touches[0].clientX - this.PathRect.left;
      }
    }

    //Set Position for Dot
    if(pos >= 0 && pos <= this.incrementalPos * this.range){
      this.currentValue = Math.round(pos / this.incrementalPos);
      if(roundToClosest){
        pos = this.incrementalPos * Math.round(pos / this.incrementalPos);
      }
      this.setState({translateX: "translateX(" + (pos - this.DotRadius) + "px)"});
    }
    else if(pos < 0){
      this.currentValue = this.props.min;
      this.setState({translateX: "translateX(" + -this.DotRadius + "px)"});
    }
    else{
      this.currentValue = this.props.max;
      this.setState({translateX: "translateX(" + (this.range * this.incrementalPos - this.DotRadius) + "px)"});
    }
  }

  render() {
    return (
      <div className="Slider">
        <div className="Components">
          <div className="Path" ref={el => this.Path = el}>
            <div className="Dot"
                 onMouseDown={this.handleInputStart.bind(this)}
                 onTouchStart={this.handleInputStart.bind(this)}
                 ref={el => this.Dot = el}
                 style={{transform: this.state.translateX + " " + this.state.scale}}/>
          </div>
        </div>
      </div>
    )
  }
}

Slider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  onScrub: PropTypes.func,
  onRelease: PropTypes.func
}

Slider.defaultProps = {
  min: 0,
  max: 10,
  onScrub: f => f,
  onRelease: f => f
}
