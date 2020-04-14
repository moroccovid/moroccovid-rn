import React, {Component} from 'react';
import {
  View,
  PermissionsAndroid,
  PermissionStatus,
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';
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
import MapView, {Polygon} from 'react-native-maps';
import TrajetService from '../../database/services/TrajetService';
import {Panel} from './Panel/Panel';

export default class Tracking extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {
    loading: true,
    status: 'none', // none -> started -> finished
    trajet_id: null,
    error: false,
    errorMsg: '',
    points: [],
  };

  async componentDidMount() {
    await this.getLocation();
  }

  async startTracking() {
    console.log('Tracking -> startTracking -> startTracking');
    this.createTrajet();
    this.watchLocation();
    this.setState({status: 'started'});
  }

  async createTrajet() {
    const trajet_id = await TrajetService.prototype.create();
    console.log('Tracking -> createTrajet -> trajet_id', trajet_id);
    this.setState({trajet_id});
  }

  async getLocation() {
    let granted = await this.checkPermission();
    if (!granted)
      return this.showError(
        "Veuillez nous donner la permission d'obtenir votre position",
      );

    Geolocation.getCurrentPosition(
      (info: any) => {
        console.log('Tracking -> getLocation -> info', info);

        let points = Object.assign([], this.state.points);
        points.push({...info.coords, timestamp: info.timestamp});
        console.table(points);
        this.setState({
          location: info.coords,
          points,
          loading: false,
        });
      },
      (err: any) => {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        })
          .then((data: any) => {
            this.getLocation();
          })
          .catch((err: any) => {
            this.showError('Veuillez activer la localisation et réessayer');
          });
      },
      {enableHighAccuracy: false},
    );
  }

  async watchLocation() {
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
              this.watchLocation();
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

  async stopTracking() {
    console.log('Tracking -> stopTracking -> stopTracking');
    Geolocation.clearWatch(this.state.watchID);
    this.setState({started: false, status: 'finished'});

    const trajet = await TrajetService.prototype.doneTracking(
      this.state.trajet_id,
      this.state.points,
    );
    console.log('Tracking -> stopTracking -> trajet', trajet);
  }

  goAgain() {
    this.setState({status: 'none'});
  }

  async delete() {
    let supprimer = async () => {
      await TrajetService.prototype.delete(this.state.trajet_id);
      this.setState({
        trajet_id: null,
        status: 'none',
      });
      if (Platform.OS === 'android')
        ToastAndroid.show('Trajet supprimé.', ToastAndroid.LONG);
    };
    Alert.alert(
      'Confirmation',
      `Voulez-vous supprimer le trajet #${this.state.trajet_id}?`,
      [{text: 'Oui', onPress: supprimer}, {text: 'Annuler'}],
    );
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
      errorMsg: msg,
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
        <Panel
          {...this.state}
          startTracking={() => this.startTracking()}
          stopTracking={() => this.stopTracking()}
          goAgain={() => this.goAgain()}
          delete={() => this.delete()}
        />
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
