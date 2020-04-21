import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../../theme/colors';
import {Tooltip} from 'react-native-elements';

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
      <View style={{alignItems: 'center'}}>
        <Tooltip
          height={100}
          width={200}
          popover={
            <Text style={{color: 'white'}}>
              Cela indique la probabilité que vous ayez attrapé le virus, 5
              étoiles signifie aucun risque.
            </Text>
          }>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {this.getStars()}
          </View>
        </Tooltip>
      </View>
    );
  }
}
