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
import {TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../../theme/colors';
import MapView, {Marker, Polygon} from 'react-native-maps';

export default class Tracking extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {loading: false, staretd: false, error: false, points: []};

  async componentDidMount() {
    await this.getLocation();
  }

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

    console.log('Getting initial location');
    try {
      Geolocation.getCurrentPosition(
        (info: any) => {
          console.log('Tracking -> getLocation -> info', info);

          let {points} = this.state;
          points.push({...info.coords, timestamp: info.timestamp});
          console.table(points);
          this.setState({
            location: info.coords,
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
    } catch (error) {
      console.error('error getting location: ', error);
      this.showError('Un erreur est survenue, veuillez réessayer plus tard.');
    }
  }

  async watchLocation(retry: boolean = true) {
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
          console.log('Tracking -> watchLocation -> info', info);
          let {points} = this.state;
          points.push({...info.coords, timestamp: info.timestamp});
          console.table(points);
          this.setState({
            points,
          });
        },
        (err: any) => {
          console.log('TCL: Location -> watchLocation -> err', err);
          RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
          })
            .then((data: any) => {
              this.watchLocation(false);
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

  stopGettingLocation() {
    Geolocation.clearWatch(this.state.watchID);
    this.setState({started: false, finished: true});
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.state.watchID);
  }

  onChange(location: any) {
    console.log('Tracking -> onChange -> location', location.target());
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
        <View
          style={{
            flex: 1,
            paddingTop: 20,
            paddingHorizontal: 50,
            justifyContent: 'center',
          }}>
          {!this.state.started ? (
            <TouchableOpacity
              style={{
                padding: 20,
                backgroundColor: colors.primary,
                borderRadius: 20,
              }}
              onPress={() => this.getLocation()}>
              <Text style={{textAlign: 'center', fontSize: 18, color: 'white'}}>
                START
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                padding: 20,
                backgroundColor: 'red',
                borderRadius: 20,
              }}
              onPress={() => this.stopGettingLocation()}>
              <Text style={{textAlign: 'center', fontSize: 18, color: 'white'}}>
                STOP
              </Text>
            </TouchableOpacity>
          )}
          {this.state.error && (
            <Text style={styles.error}>{this.state.message}</Text>
          )}
        </View>
        <View style={{flex: 5}}>
          {this.state.location ? (
            <MapView
              initialRegion={{
                latitude: this.state.location.latitude,
                longitude: this.state.location?.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation
              style={{width: '100%', height: '100%'}}>
              <Polygon coordinates={this.state.points} />
            </MapView>
          ) : null}
        </View>
      </View>
    );
  }
}
