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
import MapView from 'react-native-maps';
import TrajetService from '../../managers/database/services/TrajetService';
import {Panel} from './Panel/Panel';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import TrackingManager from '../../managers/tracking/manager';
import {BleManager, Device} from 'react-native-ble-plx';

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
    IDS: [],
  };

  async componentDidMount() {
    this.props.navigation.addListener('focus', async () => {
      await this.checkPermissions();
    });
  }

  async startTracking() {
    console.log('Tracking -> startTracking -> startTracking');
    this.createTrajet();
    this.setState({points: [], synced: false, syncing: false});
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
      (info: GeolocationResponse) => {
        console.log(
          'Tracking -> getLocation -> info',
          `${info.coords.latitude}, ${info.coords.longitude}, acc: ${info.coords.accuracy}`,
        );
        ToastAndroid.show(
          `${info.coords.latitude}, ${info.coords.longitude}, acc: ${info.coords.accuracy}`,
          ToastAndroid.SHORT,
        );
        this.setState({
          location: info.coords,
          points: [
            ...this.state.points,
            {...info.coords, timestamp: info.timestamp},
          ],
          loading: false,
        });
      },
      (err: any) => {
        console.log(
          'Tracking -> getLocation -> err high_acc:',
          enableHighAccuracy,
          err,
        );
        setTimeout(() => {
          this.getLocation(false);
        }, 2000);
      },
      {enableHighAccuracy, distanceFilter: 0},
    );
  }

  async watchLocation() {
    this.getLocation(true);
    let intervalID = setInterval(() => this.getLocation(true), 7000);
    let bleManager = new BleManager();

    bleManager.startDeviceScan(null, null, (err, device: Device | null) => {
      if (err || !device) return;
      console.log('Tracking -> watchLocation -> device', device);
      let IDS = this.state.IDS as string[];
      if (IDS.includes(device.id)) return;
      IDS.push(device.id);
      this.setState({IDS});
    });

    this.setState({intervalID});
  }

  async stopTracking() {
    console.log('Tracking -> stopTracking -> stopTracking');
    clearInterval(this.state.intervalID);

    let bleManager = new BleManager();
    bleManager.stopDeviceScan();

    this.setState({started: false, status: 'finished'});
    let {points, IDS} = this.state;
    const trajet = await TrajetService.prototype.doneTracking(
      this.state.trajet_id,
      points,
      IDS,
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
        synced: false,
        syncing: false,
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
    clearInterval(this.state.intervalID);
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
        this.getLocation(true);
      })
      .catch((err: any) => {
        console.log('location services were denied by the user', err);
        this.showError(
          "Veuillez nous donner la permission d'obtenir votre position",
        );
      });

    let bleManager = new BleManager();
    const resp = await bleManager.enable();
    console.log('Tracking -> checkPermissions -> resp', resp);

    return true;
  }

  showError(msg: string) {
    this.setState({
      error: true,
      errorMsg: msg,
    });
  }

  async syncTrajet() {
    this.setState({synced: false, syncing: true});
    let success = await TrackingManager.prototype.syncTrajet(
      this.state.trajet_id,
    );
    if (!success) {
      this.setState({synced: false, syncing: false});
      return ToastAndroid.show('Pas de connexion Internet', ToastAndroid.LONG);
    }
    ToastAndroid.show('Trajet synchronisé', ToastAndroid.SHORT);
    this.setState({synced: true, syncing: false});
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
          syncTrajet={async () => await this.syncTrajet()}
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
