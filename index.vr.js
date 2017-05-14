import _ from 'lodash';
import Immutable from 'immutable';
import React from 'react';
import { Component } from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  Text,
  View,
} from 'react-vr';

export default class hello_vr extends Component {

  constructor() {
    super();

    this.state = {
      data: Immutable.fromJS({ boxes: [
        { index: 0, text: 'First' },
        { index: 1, text: 'Second' },
        { index: 2, text: 'Third' },
      ]}),
      selectedBox: undefined,
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

  handleAppInput = e => {
    let event = e.nativeEvent.inputEvent;
    console.log(event);
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
      console.log('newText', newText);
      let newState = {
        data: oldState.data.setIn(['boxes', oldState.selectedBox, 'text'], newText)
      };
      return newState;
    });
  }

  render() {
    let data = this.state.data;
    return (
      <View onInput={this.handleAppInput} >
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
    );
  }
};

class HoverText extends Component {

  constructor() {
    super();

    this.state = { isFocused: false };
  }

  render() {
    let backgroundColor =  this.state.isFocused ? '#FF0000' : '#00FF00';
    return (
      <Text
          style={{
            backgroundColor: backgroundColor,
            fontSize: 0.8,
            fontWeight: '400',
            layoutOrigin: [0.5, 0.5],
            paddingLeft: 0.2,
            paddingRight: 0.2,
            textAlign: 'center',
            textAlignVertical: 'center',
            transform: [{translate: [0, 1, -3]}],
            opacity: this.props.selected ? 1 : .85,
          }}
          onEnter={() => this.setState({ isFocused: true })}
          onExit={() => this.setState({ isFocused: false })}
          {...this.props}
        >
        {this.props.text}
        </Text>
    );
  }
}

AppRegistry.registerComponent('hello_vr', () => hello_vr);
