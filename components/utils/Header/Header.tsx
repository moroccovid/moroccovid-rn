import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class Header extends Component<{title: string; tapped: any}> {
  showDrawer() {
    this.props.tapped();
  }

  render() {
    return (
      <View style={{flexDirection: 'row', marginVertical: 10}}>
        <View style={{position: 'absolute', paddingHorizontal: 10}}>
          <Icon onPress={() => this.showDrawer()} name="bars" size={28} />
        </View>
        <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 24}}>{this.props.title}</Text>
        </View>
      </View>
    );
  }
}
