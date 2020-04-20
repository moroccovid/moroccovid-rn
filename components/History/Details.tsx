import React, {Component} from 'react';
import {Text, View, Alert, ToastAndroid} from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import Loading from '../utils/Loading/Loading';
import Header from '../utils/Header/Header';
import TrajetService from '../../managers/database/services/TrajetService';
import MapView, {Polyline} from 'react-native-maps';
import colors from '../../theme/colors';
export default class Details extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {loading: true, trajets: []};
  async componentDidMount() {
    const trajet = await TrajetService.prototype.get(
      (this.props as any).route.params.trajet_id,
    );
    trajet.locations.sort((a, b) => a.timestamp - b.timestamp);

    this.setState({loading: false, trajet, location: trajet.locations[0]});
  }

  render() {
    return this.state.loading ? (
      <Loading />
    ) : (
      <View style={{flex: 1}}>
        <Header
          tapped={() => this.props.navigation.navigate('History')}
          title="Trajets"
          icon="chevron-left"
        />
        <View style={{flex: 1}}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 24,
              marginVertical: 20,
              fontWeight: 'bold',
            }}>
            Trajet #{(this.props as any).route.params.trajet_id}
          </Text>
          {this.state.location && (
            <MapView
              initialRegion={{
                latitude: this.state.location.latitude,
                longitude: this.state.location?.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              style={{width: '100%', height: '100%'}}>
              <Polyline
                strokeWidth={3}
                strokeColor={colors.primary}
                coordinates={this.state.trajet.locations.map((el: any) => ({
                  latitude: el.latitude,
                  longitude: el.longitude,
                }))}
              />
            </MapView>
          )}
        </View>
      </View>
    );
  }
}
