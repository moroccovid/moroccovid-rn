import React, {Component} from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../../theme/colors';

export default class Score extends Component<{score: number}> {
  getStars() {
    let stars = [];
    for (let i = 1; i <= Math.floor(this.props.score); i++)
      stars.push(
        <Icon key={stars.length} name="star" size={30} color={colors.gold} />,
      );
    if (this.props.score - Math.floor(this.props.score) == 0.5)
      stars.push(
        <Icon
          key={stars.length}
          name="star-half"
          size={30}
          color={colors.gold}
        />,
      );
    for (let i = 1; i <= 5 - this.props.score; i++)
      stars.push(
        <Icon key={stars.length} name="star" size={30} color="#d3d3d3" />,
      );
    return stars;
  }
  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {this.getStars()}
      </View>
    );
  }
}
