import React, {Component} from 'react';
import {Text, View, PermissionsAndroid, PermissionStatus} from 'react-native';
import styles from './style';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import Loading from '../utils/Loading/Loading';
import Header from '../utils/Header/Header';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {TouchableOpacity} from 'react-native-gesture-handler';
import colors from '../../theme/colors';
import MapView, {Polygon} from 'react-native-maps';
import TrajetService from '../../database/services/TrajetService';

export default class Tracking extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {
    loading: false,
    started: false,
    trajet_id: null,
    error: false,
    points: [],
  };

  async componentDidMount() {
    await this.getLocation();
  }

  async startTracking() {
    this.createTrajet();
    this.watchLocation();
  }

  async createTrajet() {
    const service = new TrajetService();
    const trajet_id = await service.create();
    console.log('Tracking -> createTrajet -> trajet_id', trajet_id);
    this.setState({trajet_id});
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

          let points = Object.assign([], this.state.points);
          points.push({...info.coords, timestamp: info.timestamp});
          console.table(points);
          this.setState({
            location: info.coords,
            points,
          });
        },
        (err: any) => {
          console.log('TCL: Location -> getLocation -> err', err);
          if (err.code === 3)
            return this.showError(
              'Un erreur est survenue, veuillez réessayer plus tard.',
            );
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
        {enableHighAccuracy: false},
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
        (info: GeolocationResponse) => {
          console.log('Tracking -> watchLocation -> info', info);
          let points = Object.assign([], this.state.points);
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

  stopTracking() {
    Geolocation.clearWatch(this.state.watchID);
    this.setState({started: false, finished: true});
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.state.watchID);
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
              onPress={() => this.startTracking()}>
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
              onPress={() => this.stopTracking()}>
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
