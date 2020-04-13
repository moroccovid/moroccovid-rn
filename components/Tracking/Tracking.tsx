import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  Alert,
  PermissionsAndroid,
  PermissionStatus,
  ToastAndroid,
} from 'react-native';
import styles from './style';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import Loading from '../utils/Loading/Loading';
import Header from '../utils/Header/Header';
import Geolocation from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {ListItem, Button} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../../theme/colors';

export default class Tracking extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {loading: false, staretd: false, error: false, points: []};

  async checkPermission() {
    let permitted = await PermissionsAndroid.check(
      'android.permission.ACCESS_FINE_LOCATION',
    );
    let granted: PermissionStatus | boolean = true;
    if (!permitted)
      granted = await PermissionsAndroid.request(
        'android.permission.ACCESS_FINE_LOCATION',
      );
    return granted && permitted;
  }

  showError(msg: string) {
    this.setState({
      error: true,
      message: msg,
    });
  }

  async getLocation(retry: boolean = true) {
    let granted = await this.checkPermission();
    if (!granted)
      return this.showError(
        "Veuillez nous donner la permission d'obtenir votre position",
      );

    console.log('Getting location');
    this.setState({started: true});
    try {
      let watchID = Geolocation.watchPosition(
        (info: any) => {
          console.log('Tracking -> getLocation -> info', info);
          let {points} = this.state;
          points.push(info.coords);
          this.setState({
            points,
          });
        },
        (err: any) => {
          console.log('TCL: Location -> getLocation -> err', err);
          RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
          })
            .then((data: any) => {
              this.getLocation(false);
            })
            .catch((err: any) =>
              this.showError('Veuillez activer la localisation et réessayer'),
            );
        },
        {enableHighAccuracy: true},
      );
      this.setState({watchID});
    } catch (error) {
      console.error('error getting location: ', error);
      this.showError('Un erreur est survenue, veuillez réessayer plus tard.');
    }
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.state.watchID);
  }

  render() {
    return this.state.loading ? (
      <Loading />
    ) : (
      <View style={{flex: 1}}>
        <Header
          tapped={() => (this.props.navigation as any).toggleDrawer()}
          title="Tracking"
        />
        {!this.state.started && (
          <View
            style={{flex: 1, justifyContent: 'center', paddingHorizontal: 50}}>
            {this.state.error && (
              <Text style={styles.error}>{this.state.message}</Text>
            )}
            <TouchableOpacity
              style={{
                padding: 20,
                backgroundColor: colors.primary,
                borderRadius: 20,
              }}
              onPress={() => this.getLocation()}>
              <Text style={{textAlign: 'center', fontSize: 18, color: 'white'}}>
                Demarrer un trajet
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View>
          {this.state.points.map((point: any, i: number) => (
            <ListItem
              key={i}
              title={point.latitude + ',' + point.longitude}
              bottomDivider
              chevron
            />
          ))}
        </View>
      </View>
    );
  }
}
