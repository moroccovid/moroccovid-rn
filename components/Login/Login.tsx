import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import styles from './style';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import Loading from '../utils/Loading/Loading';
import {Input, Button} from 'react-native-elements';
import colors from '../../theme/colors';

export default class Login extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {loading: true};
  componentDidMount() {
    setTimeout(() => {
      this.setState({loading: false});
    }, 1000);
  }
  render() {
    return this.state.loading ? (
      <Loading />
    ) : (
      <View style={{flex: 1}}>
        <Image
          style={styles.logo}
          source={require('../../assets/logo256.png')}
        />
        <Text style={styles.title}>S'identification</Text>
        <Text style={styles.subtitle}>
          On est besoin de votre numero de telephone pour vous identifiez.
        </Text>

        <View style={{paddingHorizontal: 50, marginTop: 100}}>
          <Input
            placeholder="Numero de telephone"
            leftIcon={{type: 'font-awesome', name: 'phone'}}
          />
          <Button
            containerStyle={{marginTop: 50}}
            buttonStyle={{backgroundColor: colors.primary}}
            title="S'identifier"
          />
        </View>
      </View>
    );
  }
}
