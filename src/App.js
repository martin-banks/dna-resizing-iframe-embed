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

// triple undesrscores are used to force spaces where needed
// this allows for line separated, indeted code to be maintained 
// here for improved readability
const sp = '____'
const forceSpace = new RegExp(sp, 'g')
const code = p => `<div>
  <div ${sp} data-app="container">
    <iframe ${sp} id="interactiveiframe"
      src="${p.src}"
      frameborder="0"
      scrolling="no"
      data-widthmobile="${p.mobileWidth}"
      data-heightmobile="${p.mobileHeight}"
      data-widthdesktop="${p.desktopWidth}"
      data-heightdesktop="${p.desktopHeight}"
    ></iframe>
  </div>
  <script ${sp} src="../supportScripts/calcSize.js"></script>
</div>
`.replace(/\n|\t|\s+/g, '').replace(forceSpace, ' ')

class EmbedCode extends Component {
  render(props) {
    return <pre style={ styles__embedCode(this.props.display) }>
      {code(this.props)}
    </pre>
  }
}

const styles__embedCode = display => ({
  // position: 'fixed',
  // top: '50%',
  left: '0',
  // transform: 'translateY(-50%)',
  textAlign: 'left',
  padding: '32px',
  maxWidth: '1000px',
  margin: '32px auto',
  border: 'solid 1px #ccc',
  display: display,
  width: '100vw',
  // height: '100vh',
  // background: 'lightblue',
  // zIndex: '1000',
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',
})

const styles__handle = p => ({
  X: {
    position: 'absolute',
    height: '100%',
    width: '20px',
    top: '50%',
    left: '100%',
    background: `linear-gradient(90deg, rgba(0,0,0,0), #bbb 10%, #fff 20%, #bbb 30%, #fff 40%, #bbb 50%, #fff 60%, #bbb 70%, #fff 80%, #bbb 90%)`,
    backgroundSize: '12px 50px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    border: 'solid 1px #ccc',
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
    background: `linear-gradient(0deg, rgba(0,0,0,0), #bbb 10%, #fff 20%, #bbb 30%, #fff 40%, #bbb 50%, #fff 60%, #bbb 70%, #fff 80%, #bbb 90%)`,
    backgroundSize: '50px 12px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    border: 'solid 1px #ccc',
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
      showCode: true,
      warning: false,
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

  updateInput = e => {
    this.setState({ urlInput: e.target.value })
  }
  showPreview = () => {
    console.log('preview clicked')
    this.setState({ showPreview: true })
    if (!(this.state.urlInput.includes('https'))) {
      this.setState({ warning: 'WARNING. This is not an HTTPS address, it may not work on our sites'})
    }
  }
  showCode = () => this.setState({ showCode: !this.state.showCode })

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
          <h2>iFrame embed code generator</h2>
          <div className="wrapper__input">
            <input onChange={ this.updateInput } id="urlInput" placeholder="Enter url ... "/>
            <button onClick={ this.showPreview }>Preview</button>
            <button onClick={ this.showCode }>{ this.state.showCode ? 'Hide embed' : 'Show embed' }</button>
          </div>
        </div>
        { this.state.warning ? <h3 style={{ color: 'darkred' }}>{ this.state.warning }</h3> : '' }

        <div className="previews">
          {/* mobile preview */}
          
          <div 
            className="preview__wrapper" 
            data-view="mobile"
            style={ styles__previewWrapper({ height: this.state.preview.mobile.height, width: this.state.preview.mobile.width }) }
          >
            { this.state.showPreview ? <Preview src={ this.state.urlInput } /> : <h4>Mobile breakpoint</h4>}
            
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
            { this.state.showPreview ? <Preview src={ this.state.urlInput } /> : <h4>Desktop breakpoint</h4>}
            
            <div style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', position: 'absolute', top: '0', left: '0' }}></div>
            
            <Handle
              dragging={this.state.resizing.active}
              axis="desktopY"
              handleMouseDown={this.startResize}
              handleMouseMove={this.resize}
              handleMouseUp={this.endResize}
              cursor={`-webkit-${this.state.resizing.active ? 'grabbing' : 'grab'}`}
            />
            <Handle
              dragging={this.state.resizing.active}
              axis="desktopX"
              handleMouseDown={this.startResize}
              handleMouseMove={this.resize}
              handleMouseUp={this.endResize} 
              cursor={`-webkit-grab${this.state.resizing.active ? 'grabbing' : 'grab'}`}
            />
            <h4 style={ styles__sizeMarker }>
              {this.state.preview.desktop.width}px / {this.state.preview.desktop.height}px
            </h4>
          </div>
        </div>


        <EmbedCode
          display={ this.state.showCode ? 'block' : 'none' }
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
