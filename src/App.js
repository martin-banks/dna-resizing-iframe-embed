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
    const axis = this.props.axis.replace('desktop', '').replace('mobile', '')
    return <div 
      style={ styles__handle[axis] }
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
      data-width_mobile="${p.mobileWidth}"
      data-height_mobile="${p.mobileHeight}"
      data-width_desktop="${p.desktopWidth}"
      data-height_desktop="${p.desktopHeight}"
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
  display: 'inline-block',
  height: `${p.height}px`,
  width: `${p.width}px`,
  maxWidth: '1000px',
  border: 'solid 1px red',
  margin: '32px',
  verticalAlign: 'top',
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
        mobile: {
          height: 400,
          width: 300,
          originY: 0,
          originX: 0,
        },
        desktop: {
          height: 650,
          width: 650,
          originY: 0,
          originX: 0,
        },
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
    console.log(this.state)
    if (this.state.resizing.active) {
      // console.log(e.pageY, e.mouseY)
      let { axis } = this.state.resizing
      let update = this.state.preview
      console.log(axis, axis.split(''), axis.split('').pop())
      const direction = axis.slice(-1)
      const device = axis.slice(0, (axis.length - 1))
      console.log({device, direction}, this.state.preview[device], `origin${direction}`)
      update[device][direction === 'Y' ? 'height' : 'width'] = e[`page${direction}`] - this.state.preview[device][`origin${direction}`] - 10
      document.querySelectorAll('.preview__wrapper').forEach(wrapper => {
        update[wrapper.getAttribute('data-view')].originX = wrapper.offsetLeft
        update[wrapper.getAttribute('data-view')].originY = wrapper.offsetTop
      })
      console.log({ update })
      this.setState({ preview: update })
    }
  }

  
  componentDidMount = () => {
    const previewUpdate = this.state.preview
    document.querySelectorAll('.preview__wrapper').forEach(wrapper => {
      previewUpdate[wrapper.getAttribute('data-view')].originX = wrapper.offsetLeft
      previewUpdate[wrapper.getAttribute('data-view')].originY = wrapper.offsetTop
    })
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

        {/* mobile preview */}
        <div 
          className="preview__wrapper" 
          data-view="mobile"
          style={ styles__previewWrapper({ height: this.state.preview.mobile.height, width: this.state.preview.mobile.width }) }
        >
          { this.state.showPreview ? <Preview src={ this.state.urlInput } /> : <p>Please enter a valid URL</p> }
          
          <div style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', position: 'absolute', top: '0', left: '0' }}></div>
          
          <Handle axis="mobileY" handleMouseDown={this.startResize} handleMouseMove={this.resize} handleMouseUp={this.endResize} />
          <Handle axis="mobileX" handleMouseDown={this.startResize} handleMouseMove={this.resize} handleMouseUp={this.endResize} />
          <h4 style={ styles__sizeMarker }>{this.state.preview.mobile.width}px / {this.state.preview.mobile.height}px</h4>
        </div>

      {/* desktop preview */}
        <div 
          className="preview__wrapper"
          data-view="desktop"
          style={ styles__previewWrapper({ height: this.state.preview.desktop.height, width: this.state.preview.desktop.width }) }
        >
          { this.state.showPreview ? <Preview src={ this.state.urlInput } /> : <p>Please enter a valid URL</p> }
          
          <div style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', position: 'absolute', top: '0', left: '0' }}></div>
          
          <Handle axis="desktopY" handleMouseDown={this.startResize} handleMouseMove={this.resize} handleMouseUp={this.endResize} />
          <Handle axis="desktopX" handleMouseDown={this.startResize} handleMouseMove={this.resize} handleMouseUp={this.endResize} />
          <h4 style={ styles__sizeMarker }>{this.state.preview.desktop.width}px / {this.state.preview.desktop.height}px</h4>
        </div>


        <EmbedCode 
          src={this.state.urlInput} 
          mobileWidth={this.state.preview.mobile.width} 
          mobileHeight={this.state.preview.mobile.height} 
          desktopWidth={this.state.preview.desktop.width} 
          desktopHeight={this.state.preview.desktop.height} 
        />
      </div>
    )
  }
}

export default App;
