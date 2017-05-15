import _ from 'lodash';
import { Component } from 'react';
import HoverText from './components/hover-text';
import Immutable from 'immutable';
import React from 'react';
import {
  asset,
  Pano,
  Scene,
  Text,
  View,
} from 'react-vr';

export default class Main extends Component {

  constructor() {
    super();

    this.state = {
      data: Immutable.fromJS({ boxes: [
        { index: 0, text: 'First' },
        { index: 1, text: 'Second' },
        { index: 2, text: 'Third' },
      ]}),
      selectedBox: undefined,
      x: 0,
      z: 0,
    };
  }

  handleBoxInput = (index, e) => {
    let event = e.nativeEvent.inputEvent;

    if (event.eventType === 'click') {
      this.setState({
        selectedBox: index,
      })
    }
  }

  handleMovement = e => {
    let event = e.nativeEvent.inputEvent;

    if (_.isNumber(this.state.selectedBox)) {
        if (event.eventType === 'click') {
            this.setState({selectedBox:null});
        }
        return;
    }
    let delta;
    switch(event.key) {
        case 'w':
            delta = { z: this.state.z - .5 };
            break;
        case 's':
            delta = { z: this.state.z + .5 };
            break;
        case 'd':
            delta = { x: this.state.x + .5 };
            break;
        case 'a':
            delta = { x: this.state.x - .5 };
            break;
    }
    if (delta) {
        this.setState(delta);
    }
  }

  handleAppInput = e => {
    let event = e.nativeEvent.inputEvent;
    let isBackspace = event.eventType == 'keydown' && event.keyCode === 8;
    if (!_.isNumber(this.state.selectedBox) ||
      (event.eventType !== 'keypress' &&
      !isBackspace)) {
      return;
    }

    this.setState(oldState => {
      let oldText = oldState.data.getIn(['boxes', oldState.selectedBox, 'text']);
      let newText;
      if (isBackspace) {
        newText = oldText.substring(0, oldText.length - 1);
      } else {
        newText = oldText + event.key;
      }
      let newState = {
        data: oldState.data.setIn(['boxes', oldState.selectedBox, 'text'], newText)
      };
      return newState;
    });
  }

  render() {
    let data = this.state.data;
    return (
        <Scene
            style={{
                transform: [
                    {translateX: this.state.x},
                    {translateZ: this.state.z},
                ]
            }}
            onInput={this.handleMovement}
            >
            <View onInput={this.handleAppInput}>
                <Pano source={asset('chess-world.jpg')}/>
                {data.get('boxes').map((box, i) => (
                <HoverText
                    key={i}
                    text={box.get('text')}
                    onInput={_.partial(this.handleBoxInput, i)}
                    selected={i === this.state.selectedBox}
                    />
                ))}
            </View>
        </Scene>
    );
  }
};
