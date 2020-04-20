import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../../theme/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default class Success extends Component<{goHome: any}> {
  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 3, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name="check-circle" size={80} color={colors.primary} />
          <Text style={{fontSize: 20, textAlign: 'center', marginVertical: 20}}>
            Nous avons reçu votre questionnaire, merci.
          </Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={this.props.goHome}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="arrow-left" size={24} />
            <Text style={{fontSize: 18, marginLeft: 10}}>Acceuil</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
