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
      style={ styles__handle({ cursor: this.props.cursor, dragging: this.props.dragging })[axis] }
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


const styles__handle = p => ({
  X: {
    position: 'absolute',
    height: '100%',
    width: '20px',
    top: '50%',
    left: '100%',
    background: `linear-gradient(90deg, rgba(0,0,0,0), #e2e2e2 10%, #fff 20%, #e2e2e2 30%, #fff 40%, #e2e2e2 50%, #fff 60%, #e2e2e2 70%, #fff 80%, #e2e2e2 90%)`,
    backgroundSize: '12px 50px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    border: 'solid 1px #e2e2e2',
    transform: 'translate(4px, -50%)',
    cursor: p.cursor,
    borderRadius: '10px',
  },
  Y: {
    position: 'absolute',
    width: '100%',
    height: '20px',
    top: '100%',
    left: '50%',
    background: `linear-gradient(0deg, rgba(0,0,0,0), #e2e2e2 10%, #fff 20%, #e2e2e2 30%, #fff 40%, #e2e2e2 50%, #fff 60%, #e2e2e2 70%, #fff 80%, #e2e2e2 90%)`,
    backgroundSize: '50px 12px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    border: 'solid 1px #e2e2e2',
    transform: 'translate(-50%, 4px)',
    cursor: p.cursor,
    borderRadius: '10px',
  },
})

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
    if (this.state.resizing.active) {
      let { axis } = this.state.resizing
      let update = this.state.preview
      const direction = axis.slice(-1)
      const device = axis.slice(0, (axis.length - 1))
      let newSize = e[`page${direction}`] - this.state.preview[device][`origin${direction}`] - 10
      if (newSize <= 300) newSize = 300
      if (newSize >= 1000) newSize = 1000
      update[device][direction === 'Y' ? 'height' : 'width'] = newSize
      document.querySelectorAll('.preview__wrapper').forEach(wrapper => {
        update[wrapper.getAttribute('data-view')].originX = wrapper.offsetLeft
        update[wrapper.getAttribute('data-view')].originY = wrapper.offsetTop
      })
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
        <div className="wrapper__header">
          <h2>iFrame embed code gnenrator</h2>
          <div className="wrapper__input">
            <input onChange={ this.updateInput } id="urlInput" placeholder="Enter url ... "/>
            <button onClick={ this.showPreview }>Show me!</button>
          </div>
        </div>

        {/* mobile preview */}
        <div 
          className="preview__wrapper" 
          data-view="mobile"
          style={ styles__previewWrapper({ height: this.state.preview.mobile.height, width: this.state.preview.mobile.width }) }
        >
          { this.state.showPreview ? <Preview src={ this.state.urlInput } /> : <p>Please enter a valid URL</p> }
          
          <div style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', position: 'absolute', top: '0', left: '0' }}></div>
          
          <Handle
            dragging={this.state.resizing.active}
            axis="mobileY"
            handleMouseDown={this.startResize}
            handleMouseMove={this.resize}
            handleMouseUp={this.endResize}
            cursor={`-webkit-grab${this.state.resizing.active ? 'bing' : ''}`}
          />
          <Handle
            dragging={this.state.resizing.active}
            axis="mobileX"
            handleMouseDown={this.startResize}
            handleMouseMove={this.resize}
            handleMouseUp={this.endResize} 
            cursor={`-webkit-grab${this.state.resizing.active ? 'bing' : ''}`}
          />
          <h4 style={ styles__sizeMarker }>
            {this.state.preview.mobile.width}px / {this.state.preview.mobile.height}px
          </h4>
        </div>

      {/* desktop preview */}
        <div 
          className="preview__wrapper"
          data-view="desktop"
          style={ styles__previewWrapper({ height: this.state.preview.desktop.height, width: this.state.preview.desktop.width }) }
        >
          { this.state.showPreview ? <Preview src={ this.state.urlInput } /> : <p>Please enter a valid URL</p> }
          
          <div style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', position: 'absolute', top: '0', left: '0' }}></div>
          
          <Handle
            dragging={this.state.resizing.active}
            axis="desktopY"
            handleMouseDown={this.startResize}
            handleMouseMove={this.resize}
            handleMouseUp={this.endResize}
            cursor={`-webkit-grab${this.state.resizing.active ? 'bing' : ''}`}
          />
          <Handle
            dragging={this.state.resizing.active}
            axis="desktopX"
            handleMouseDown={this.startResize}
            handleMouseMove={this.resize}
            handleMouseUp={this.endResize} 
            cursor={`-webkit-grab${this.state.resizing.active ? 'bing' : ''}`}
          />
          <h4 style={ styles__sizeMarker }>
            {this.state.preview.desktop.width}px / {this.state.preview.desktop.height}px
          </h4>
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
