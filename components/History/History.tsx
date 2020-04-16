import React, {Component, Fragment} from 'react';
import {Text, View, Alert, ToastAndroid, ScrollView} from 'react-native';
import styles from './style';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import Loading from '../utils/Loading/Loading';
import Header from '../utils/Header/Header';
import TrajetService from '../../managers/database/services/TrajetService';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Trajet} from '../../managers/database/entities/Trajet';
import dayjs from 'dayjs';
import colors from '../../theme/colors';
import TrackingManager from '../../managers/tracking/manager';
import {TouchableOpacity} from 'react-native-gesture-handler';
export default class History extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {loading: true, trajets: []};
  async componentDidMount() {
    await this.refresh();
    this.props.navigation.addListener('focus', () => {
      this.refresh();
    });
  }

  async refresh() {
    const service = new TrajetService();
    let trajets = await service.getAll();
    console.log(trajets.length);
    console.log(trajets);
    this.setState({loading: false, trajets});
  }

  getDate(timestamp: number) {
    return dayjs(timestamp).format('DD-MM-YYYY');
  }

  async delete(id: number) {
    let supprimer = async () => {
      const service = new TrajetService();
      await service.delete(id);
      await this.refresh();
    };
    Alert.alert('Confirmation', `Voulez-vous supprimer le trajet #${id}?`, [
      {text: 'Oui', onPress: supprimer},
      {text: 'Annuler'},
    ]);
  }

  async syncTrajets(id: number, el) {
    console.log('History -> syncTrajets -> el', el);
    let success = await TrackingManager.prototype.syncTrajet(id);
    if (!success)
      return ToastAndroid.show('Pas de connexion Internet', ToastAndroid.LONG);
    ToastAndroid.show('Trajet synchronisé', ToastAndroid.SHORT);
    this.refresh();
  }
  details(id: number) {
    this.props.navigation.navigate('Details', {trajet_id: id});
  }
  render() {
    return this.state.loading ? (
      <Loading />
    ) : (
      <View style={{flex: 1}}>
        <Header
          tapped={() => (this.props.navigation as any).toggleDrawer()}
          title="Trajets"
        />
        <View style={{flex: 1}}>
          <ScrollView style={styles.list}>
            {this.state.trajets.map((trajet: Trajet, i: number) => (
              <View key={i} style={styles.listItem}>
                <TouchableOpacity onPress={() => this.details(trajet.id)}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                      name="map-marker-alt"
                      size={20}
                      style={{marginRight: 20}}
                    />
                    <Text style={styles.itemTitle}>Trajet #{trajet.id}</Text>
                  </View>
                  <Text style={{color: 'gray', marginTop: 10}}>
                    {this.getDate(trajet.start)}
                  </Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {!trajet.synced && (
                    <TouchableOpacity
                      onPress={() => this.syncTrajets(trajet.id, this)}>
                      <Icon name="upload" size={22} style={{marginLeft: 10}} />
                    </TouchableOpacity>
                  )}
                  <Icon
                    name="trash"
                    size={22}
                    color={colors.danger}
                    style={{marginLeft: 10}}
                    onPress={() => this.delete(trajet.id)}
                  />
                </View>
              </View>
            ))}
            {this.state.trajets.length === 0 && (
              <Text style={styles.notFound}>Pas des trajets</Text>
            )}
          </ScrollView>
        </View>
      </View>
    );
  }
}
