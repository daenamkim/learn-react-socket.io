import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'

const endpoint = 'http://localhost:4001'
const socket = socketIOClient(endpoint)

function subscribeToTimer(cb) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      color: 'white',
      messages: [],
      timestamp: 'no timestamp yet'
    }
  }

  sendColor = () => {
    socket.emit('changeColor', this.state.color)
  }

  sendMessage = () => {
    const message = this.refs.chatMessage.value

    socket.emit('sendMessage', message)
    this.refs.chatMessage.value = ''
  }

  setColor = (color) => {
    this.setState({ color: color })
  }

  componentDidMount() {
    subscribeToTimer((err, timestamp) => this.setState(
      { timestamp }
    ))

    socket.on('newColor', (color) => {
      document.body.style.backgroundColor = color
    })

    // NOTE: socket.on() to update state must be in constructor. If not
    // socket.on() will be called many times.
    socket.on('newMessage', (message) => this.setState(
      // Append a new message.
      (prevState) => ({ messages: [...prevState.messages, message] })
    ))
  }

  render() {
    return (
      <div style={{ textAlign: "center"}}>
        <p>
          This is the timer value: {this.state.timestamp}
        </p>
        <p>
          <button onClick={ () => this.sendColor() }>Change Color</button>
          <button id="blue" onClick={ () => this.setColor("blue") }>Blue</button>
          <button id="red" onClick={ () => this.setColor("red") }>Red</button>
        </p>
        <p>
          <input type="text" autoComplete="off" ref="chatMessage" />
          <button onClick={ () => this.sendMessage() }>Send</button>
        </p>
        <ul>
          { this.state.messages.map((i) => <li key={ Math.random() }>{ i }</li>) }
        </ul>
      </div>
    );
  }
}

export default App;
