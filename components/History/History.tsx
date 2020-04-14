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
import TrajetService from '../../database/services/TrajetService';

export default class History extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {loading: true};
  async componentDidMount() {
    await this.refresh();
  }

  async refresh() {
    const service = new TrajetService();
    let trajets = await service.getAll();
    console.table(trajets);
    this.setState({loading: false});
  }

  render() {
    return this.state.loading ? (
      <Loading />
    ) : (
      <View>
        <Header
          tapped={() => (this.props.navigation as any).toggleDrawer()}
          title="Trajets"
        />
        <Text style={{fontSize: 20}} onPress={() => this.refresh()}>
          History screen
        </Text>
      </View>
    );
  }
}
