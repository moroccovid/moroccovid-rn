import React, {Component} from 'react';
import {
  View,
  PermissionsAndroid,
  PermissionStatus,
  Alert,
  ToastAndroid,
  Platform,
  Text,
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
import MapView, {Marker} from 'react-native-maps';
import TrajetService from '../../managers/database/services/TrajetService';
import {Panel} from './Panel/Panel';
import {Location} from 'managers/database/entities/Location';

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
    this.props.navigation.addListener('focus', async () => {
      await this.checkPermissions();
    });
  }

  async startTracking() {
    console.log('Tracking -> startTracking -> startTracking');
    this.createTrajet();
    if (this.state.points.length > 1) this.setState({points: []});
    this.watchLocation();
    this.setState({status: 'started'});
  }

  async createTrajet() {
    const trajet_id = await TrajetService.prototype.create();
    console.log('Tracking -> createTrajet -> trajet_id', trajet_id);
    this.setState({trajet_id});
  }

  async getLocation(enableHighAccuracy = true) {
    Geolocation.getCurrentPosition(
      (info: any) => {
        console.log('Tracking -> getLocation -> info', info);
        this.setState({
          location: info.coords,
          points: [{...info.coords, timestamp: info.timestamp}],
          loading: false,
        });
      },
      (err: any) => {
        console.log('Tracking -> getLocation -> err', err);
        setTimeout(() => {
          this.getLocation(false);
        }, 2000);
      },
      {enableHighAccuracy, timeout: 10000},
    );
  }

  async watchLocation() {
    let granted = await this.checkPermissions();
    if (!granted) return;

    console.log('Watching location');

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
          this.showError('Veuillez activer la localisation et réessayer');
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
    let {points} = this.state;
    const trajet = await TrajetService.prototype.doneTracking(
      this.state.trajet_id,
      points,
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

  async checkPermissions() {
    let permitted = await PermissionsAndroid.check(
      'android.permission.ACCESS_FINE_LOCATION',
    );
    let granted: PermissionStatus | boolean = true;
    if (!permitted)
      granted = await PermissionsAndroid.request(
        'android.permission.ACCESS_FINE_LOCATION',
      );
    if (!granted && !permitted) {
      this.showError(
        "Veuillez nous donner la permission d'obtenir votre position",
      );
      return false;
    }

    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    })
      .then((data: any) => {
        this.getLocation();
      })
      .catch((err: any) =>
        this.showError(
          "Veuillez nous donner la permission d'obtenir votre position",
        ),
      );

    return true;
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
              zoomEnabled
              initialRegion={{
                latitude: this.state.location.latitude,
                longitude: this.state.location?.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation
              style={{width: '100%', height: '100%'}}></MapView>
          ) : null}
        </View>
      </View>
    );
  }
}
