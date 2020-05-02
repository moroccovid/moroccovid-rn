/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Text, View, ToastAndroid, Alert, ActivityIndicator} from 'react-native';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import Loading from '../../utils/Loading/Loading';
import Header from '../../utils/Header/Header';
import TrajetService from '../../../managers/database/services/TrajetService';
import colors from '../../../theme/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Button} from 'react-native-elements';
import dayjs from 'dayjs';
import styles from './style';
import TrackingManager from '../../../managers/tracking/manager';
import backendManager from '../../../managers/backend/backendManager';
import {ScrollView} from 'react-native-gesture-handler';

export default class Details extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {loading: true, trajets: []};
  async componentDidMount() {
    this.refresh();
    this.props.navigation.addListener('focus', this.refresh);
  }

  refresh = async () => {
    let id = (this.props as any).route.params.trajet_id;
    const trajet = await TrajetService.prototype.get(id);
    trajet.locations.sort((a, b) => a.timestamp - b.timestamp);
    this.setState({loading: false, trajet, statsLoading: true});
    let stats = await backendManager.path.getStats(trajet.cloudID);
    this.setState({statsLoading: false, stats});
  };

  delete = () => {
    let id = this.state.trajet.id;
    let supprimer = async () => {
      const service = new TrajetService();
      await service.delete(id);
      this.props.navigation.navigate('History');
    };
    Alert.alert('Confirmation', `Voulez-vous supprimer le trajet #${id}?`, [
      {text: 'Oui', onPress: supprimer},
      {text: 'Annuler'},
    ]);
  };

  sync = async () => {
    this.setState({syncing: true});
    let success = await TrackingManager.prototype.syncTrajet(
      this.state.trajet.id,
    );
    if (!success) {
      this.refresh();
      this.setState({syncing: false});
      return;
    }
    ToastAndroid.show('Trajet synchronisé', ToastAndroid.SHORT);
    this.setState({syncing: false});
    this.refresh();
  };

  render() {
    return this.state.loading ? (
      <Loading />
    ) : (
      <View style={{flex: 1}}>
        <Header
          tapped={() => this.props.navigation.navigate('History')}
          title={`Trajet #${(this.props as any).route.params.trajet_id}`}
          icon="chevron-left"
        />
        <View style={{flex: 1}}>
          <View style={{flex: 5}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}>
              <Icon name="clock" size={20} style={{marginRight: 5}} />
              <Text style={{fontSize: 16}}>
                {dayjs(this.state.trajet.start).format('DD-MM-YYYY HH:mm:ss')}
              </Text>
            </View>
          </View>
          {!this.state.trajet.cloudID ? (
            <View style={{flex: 70, justifyContent: 'center'}}>
              <Text style={{fontSize: 18, color: 'gray', textAlign: 'center'}}>
                Synchronise le trajet pour avoir les resultats
              </Text>
            </View>
          ) : this.state.statsLoading ? (
            <View
              style={{
                flex: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <View style={{flex: 70, paddingTop: 20}}>
              <ScrollView style={{paddingHorizontal: 20}}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Tous les contacts:</Text>
                  <View style={styles.contactContainer}>
                    <Citizen color={colors.success} text="Vous" />
                    <Arrow />
                    <Citizen color="purple" text="Indiviu" />
                  </View>
                  <Text style={{textAlign: 'center', fontSize: 20}}>
                    {this.state.stats.totalContacts} contacts
                  </Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    Contacts avec des personnes infectées:
                  </Text>
                  <View style={styles.contactContainer}>
                    <Citizen color={colors.success} text="Vous" />
                    <Arrow />
                    <Citizen color={colors.danger} text="Infecté" />
                  </View>
                  <Text style={{textAlign: 'center', fontSize: 20}}>
                    {this.state.stats.infectedContacts} contacts
                  </Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    Contacts avec des suspects:
                  </Text>
                  <View style={styles.contactContainer}>
                    <Citizen color={colors.success} text="Vous" />
                    <Arrow />
                    <Citizen color="orange" text="Suspect" />
                  </View>
                  <Text style={{textAlign: 'center', fontSize: 20}}>
                    {this.state.stats.suspectContacts} contacts
                  </Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    Contacts distants avec des personnes infectés:
                  </Text>
                  <View style={styles.contactContainer}>
                    <Citizen color={colors.success} text="Vous" />
                    <Arrow />
                    <Citizen color="gray" text="..." />
                    <Arrow />
                    <Citizen color={colors.danger} text="Infecté" />
                  </View>
                  <Text style={{textAlign: 'center', fontSize: 20}}>
                    {this.state.stats.distantInfected} contacts
                  </Text>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>
                    Contacts distants avec des personnes infectés:
                  </Text>
                  <View style={styles.contactContainer}>
                    <Citizen color={colors.success} text="Vous" />
                    <Arrow />
                    <Citizen color="gray" text="..." />
                    <Arrow />
                    <Citizen color="orange" text="Suspect" />
                  </View>
                  <Text style={{textAlign: 'center', fontSize: 20}}>
                    {this.state.stats.distantSuspected} contacts
                  </Text>
                </View>
              </ScrollView>
            </View>
          )}
          <View style={{flex: 5, flexDirection: 'row'}}>
            <Button
              title="Supprimer"
              icon={
                <Icon
                  name="trash"
                  color="white"
                  size={18}
                  style={{marginRight: 5}}
                />
              }
              onPress={this.delete}
              buttonStyle={{backgroundColor: colors.danger, borderRadius: 0}}
              containerStyle={{flex: 1}}
            />
            {!this.state.trajet.cloudID && (
              <Button
                title="Synchronise"
                onPress={this.sync}
                loading={this.state.syncing}
                icon={
                  <Icon
                    name="check"
                    color="white"
                    size={18}
                    style={{marginRight: 5}}
                  />
                }
                buttonStyle={{backgroundColor: colors.primary, borderRadius: 0}}
                containerStyle={{flex: 1}}
              />
            )}
          </View>
        </View>
      </View>
    );
  }
}

function Citizen(props: {color: string; text: string}) {
  return (
    <View>
      <Icon
        name="male"
        size={50}
        color="white"
        style={{
          backgroundColor: props.color,
          paddingVertical: 10,
          paddingHorizontal: 28,
          borderRadius: 310,
        }}
      />
      <Text style={{textAlign: 'center', fontSize: 16}}>{props.text}</Text>
    </View>
  );
}
function Arrow() {
  return (
    <Icon
      name="arrow-left"
      size={30}
      color="gray"
      style={{
        marginHorizontal: 20,
      }}
    />
  );
}
