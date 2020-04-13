import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class Header extends Component<{title: string}> {
  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <View>
          <Icon name="bars" size={32} />
        </View>
        <View>
          <Text>{this.props.title}</Text>
        </View>
      </View>
    );
  }
}
