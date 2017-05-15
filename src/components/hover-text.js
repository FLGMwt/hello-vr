import React from 'react';
import { Component } from 'react';
import { Text } from 'react-vr';

export default class HoverText extends Component {

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
            transform: [{translate: [0, 1, -6]}],
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