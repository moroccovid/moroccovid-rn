import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import styles from './style';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import Loading from '../utils/Loading/Loading';
import Header from '../utils/Header/Header';

export default class Welcome extends Component<{
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
      <View>
        <Header
          tapped={() => (this.props.navigation as any).toggleDrawer()}
          title="Acceuil"
        />
        <View style={styles.wrapper}>
          <Image
            style={styles.logo}
            source={require('../../assets/logo256.png')}
          />
          <Text style={styles.number}>+2120612345678</Text>
        </View>
      </View>
    );
  }
}
