import React, { Component } from 'react';
import './App.css';

class Preview extends Component {
  render(props) {
    return <iframe 
      src={this.props.src} 
      frameBorder="0" 
      height="100%" 
      width="100%"
      zindex="-1"
    ></iframe>
  }
}

class Handle extends Component {
  render(props) {
    return <div 
      style={ styles__handle[this.props.axis] }
      onMouseDown={ this.props.handleMouseDown }
      onMouseMove={ this.props.handleMouseMove }
      onMouseUp={ this.props.handleMouseUp }
      data-direction={ this.props.axis }
    ></div>
  }
}

const code = p => `
<div>
  <div data-app="container">
    <iframe id="interactiveiframe"
      src=${p.src} 
      frameborder="0"
      scrolling="no"
      data-width_mobile="${p.width}"
      data-height_mobile="${p.height}"
      data-width_desktop="${p.width}"
      data-height_desktop="${p.height}"
    ></iframe>
  </div>
  <script src="https://supportscript.js"></script>
</div>
`

class EmbedCode extends Component {
  render(props) {
    return <pre style={{ textAlign: 'left', padding: '32px', maxWidth: '1000px', margin: '32px auto', border: 'solid 1px #ccc' }}>
      {code(this.props)}
    </pre>
  }
}


const styles__handle = {
  X: {
    position: 'absolute',
    height: '100px',
    width: '20px',
    top: '50%',
    left: '100%',
    background: '#333',
    transform: 'translate(0, -50%)',
  },
  Y: {
    position: 'absolute',
    width: '100px',
    height: '20px',
    top: '100%',
    left: '50%',
    background: '#333',
    transform: 'translate(-50%, 0)',
  },
}

const styles__previewWrapper = p => ({
  position: 'relative',
  height: `${p.height}px`,
  width: `${p.width}px`,
  maxWidth: '1000px',
  border: 'solid 1px red',
})

const styles__sizeMarker = {
  position: 'absolute',
  bottom: '0',
  right: '24px',
  color: '#fff',
  padding: '8px 16px',
  background: 'rgba(0,0,0, 0.6)',
  borderRadius: '8px',
  display: 'inline-block',
  width: 'auto'
}


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showPreview: false,
      urlInput: false,
      resizing: {
        active: false,
        axis: null,
      },
      preview: {
        height: 500,
        width: 500,
        originY: 0,
      }
    }
  }

  updateInput = e => this.setState({ urlInput: e.target.value })
  showPreview = () => this.setState({ showPreview: true })

  startResize = e => {
    const update = this.state.resizing
    update.axis = e.target.dataset.direction
    update.active = true
    this.setState({ resizing: update })
  }
  endResize = e => {
    const update = this.state.resizing
    update.active = false
    this.setState({ resizing: update })
  }
  resize = e => {
    if (this.state.resizing.active) {
      // console.log(e.pageY, e.mouseY)
      const { axis } = this.state.resizing
      const newPreview = this.state.preview
      if (axis == 'Y') {
        newPreview.height = e.pageY - this.state.preview.originY - 10
      } else {
        newPreview.width = e.pageX - this.state.preview.originX - 10
      }
      this.setState({ preview: newPreview })
    }
  }

  
  componentDidMount = () => {
    const { offsetTop, offsetLeft } = document.querySelector('.preview__wrapper')
    const previewUpdate = this.state.preview
    previewUpdate.originY = offsetTop
    previewUpdate.originX = offsetLeft
    this.setState({ preview: previewUpdate })
  }
  
  render() {
    return (
      <div className="App" onMouseMove={ this.resize.bind(this) } onMouseUp={ this.endResize }>
        <div className="wrapper">
          <h2>Enter URL to create embed code</h2>
          <input onChange={ this.updateInput } id="urlInput" placeholder="Enter url"/>
          <button onClick={ this.showPreview }>Show me!</button>
        </div>

        <div className="preview__wrapper" style={ styles__previewWrapper({ height: this.state.preview.height, width: this.state.preview.width }) }>
          { this.state.showPreview ? <Preview src={ this.state.urlInput } /> : <p>Please enter a valid URL</p> }
          
          <div style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', position: 'absolute', top: '0', left: '0' }}></div>
          
          <Handle axis="Y" handleMouseDown={this.startResize} handleMouseMove={this.resize} handleMouseUp={this.endResize} />
          <Handle axis="X" handleMouseDown={this.startResize} handleMouseMove={this.resize} handleMouseUp={this.endResize} />
          <h4 style={ styles__sizeMarker }>{this.state.preview.width}px / {this.state.preview.height}px</h4>
        </div>

        <EmbedCode src={this.state.urlInput} width={this.state.preview.width} height={this.state.preview.height} />
      </div>
    )
  }
}

export default App;
