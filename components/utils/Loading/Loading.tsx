import React, {Component} from 'react';
import * as Animatable from 'react-native-animatable';
import {Image} from 'react-native';

export default class Loading extends Component<{}> {
  render() {
    return (
      <Animatable.View
        animation="swing"
        iterationCount="infinite"
        useNativeDriver
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={require('../../../assets/logo.png')}
          style={{width: 90, height: 90}}
        />
      </Animatable.View>
    );
  }
}
