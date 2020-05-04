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
import TrajetService from '../../managers/database/services/TrajetService';
import {Panel} from './Panel/Panel';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import TrackingManager from '../../managers/tracking/manager';
import BackgroundTimer from 'react-native-background-timer';

import RNBluetoothClassic from 'react-native-bluetooth-classic';
import deviceManager from '../../managers/device/deviceManager';

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
    detects: [],
  };

  async componentDidMount() {
    this.props.navigation.addListener('focus', async () => {
      await this.checkPermissions();
    });
  }

  async startTracking() {
    this.createTrajet();
    this.setState({points: [], synced: false, syncing: false});
    this.watchLocation();
    this.setState({status: 'started'});
  }

  async createTrajet() {
    const trajet_id = await TrajetService.prototype.create();
    this.setState({trajet_id});
  }

  async getLocation(enableHighAccuracy = true) {
    Geolocation.getCurrentPosition(
      (info: GeolocationResponse) => {
        ToastAndroid.show(
          `${info.coords.latitude}, ${info.coords.longitude}, acc: ${info.coords.accuracy}`,
          ToastAndroid.SHORT,
        );
        if (!this.state.location) this.setState({location: info.coords});
        this.setState({
          points: [
            ...this.state.points,
            {...info.coords, timestamp: info.timestamp},
          ],
          loading: false,
        });
      },
      (err: any) => {
        setTimeout(() => {
          this.getLocation(false);
        }, 2000);
      },
      {enableHighAccuracy, distanceFilter: 0},
    );
  }

  async watchLocation() {
    this.getLocation(true);
    this.bluetoothScan();
    BackgroundTimer.runBackgroundTimer(async () => {
      this.getLocation(true);
      this.bluetoothScan();
    }, 10000);
  }

  async bluetoothScan() {
    RNBluetoothClassic.discoverDevices().then((devices: any[]) => {
      console.log('Tracking -> watchLocation -> devices', devices);
      devices.forEach(async (device) => {
        try {
          console.log('Connecting to ' + device.id);
          await RNBluetoothClassic.connect(device.id); //  this crashes
          console.log('Connected to ' + device.id);
          const mac = await deviceManager.getMac();
          await RNBluetoothClassic.write(mac);
          const msg = RNBluetoothClassic.readFromDevice();
          this.addDetect(msg);
        } catch (error) {
          console.log('Tracking -> watchLocation -> error', error);
          this.addDetect(device.address);
        }
      });
    });
  }

  addDetect(address: string) {
    let detects = this.state.detects as any[];

    for (let index = 0; index < detects.length; index++)
      if (detects[index].mac === address) return;

    Geolocation.getCurrentPosition(
      (info: GeolocationResponse) => {
        detects.push({
          mac: address,
          ...info.coords,
          timestamp: info.timestamp,
        });
        this.setState({detects});
      },
      (err: any) => {
        console.log('Scan device -> location', err);
      },
      {enableHighAccuracy: false},
    );
  }

  async stopTracking() {
    BackgroundTimer.stopBackgroundTimer();

    this.setState({started: false, status: 'finished'});
    let {points, detects} = this.state;
    console.log('Tracking -> stopTracking -> detects', detects);
    const trajet = await TrajetService.prototype.doneTracking(
      this.state.trajet_id,
      points,
      detects,
    );
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
          {/* {this.state.location ? (
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
          ) : null} */}
        </View>
      </View>
    );
  }
}
