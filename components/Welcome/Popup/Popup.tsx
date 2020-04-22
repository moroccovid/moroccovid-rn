import React, {Component} from 'react';
import {Overlay, Button} from 'react-native-elements';
import {View, Text} from 'react-native';
import colors from '../../../theme/colors';

export default class Popup extends Component<{
  showOverlay: boolean;
  goTo: any;
  cancel: any;
}> {
  render() {
    return (
      <Overlay
        onBackdropPress={() => this.props.cancel()}
        isVisible={this.props.showOverlay}
        height={400}>
        <View
          style={{
            padding: 10,
            justifyContent: 'center',
            flex: 1,
          }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 10,
            }}>
            Aidez-nous à vous contacter
          </Text>
          <Text
            style={{
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 40,
            }}>
            En nous communiquant votre numéro, vous nous aiderez à vous
            contacter lorsque nous en verrons la nécessité.
          </Text>

          <Button
            title="Continuer"
            containerStyle={{marginBottom: 10}}
            onPress={() => this.props.goTo('Login')}
          />
          <Button
            title="Annuler"
            buttonStyle={{
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: colors.danger,
            }}
            titleStyle={{color: colors.danger}}
            onPress={() => this.props.cancel()}
          />
        </View>
      </Overlay>
    );
  }
}
