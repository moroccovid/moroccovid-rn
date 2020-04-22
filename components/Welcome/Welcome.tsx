import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import styles from './style';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import Loading from '../utils/Loading/Loading';
import Header from '../utils/Header/Header';
import Score from './Score/Score';
import {TouchableOpacity} from 'react-native-gesture-handler';
import backendManager from '../../managers/backend/backendManager';
import Icon from 'react-native-vector-icons/FontAwesome5';
import storageManager from '../../managers/storage/storageManager';
import Popup from './Popup/Popup';

export default class Welcome extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {loading: true, showOverlay: false};

  async componentDidMount() {
    this.refresh();
    this.checkNumber();
    this.props.navigation.addListener('focus', () => {
      if ((this.props as any).route?.params?.reload) this.refresh();
    });
  }

  async refresh() {
    console.log('Refreshing..');
    this.setState({loading: true});
    const score = await backendManager.citizen.getScore();
    this.setState({score, loading: false});
  }

  async checkNumber() {
    const number = await storageManager.getData('number');
    if (!number) return this.setState({showOverlay: true});
    this.setState({number});
  }

  render() {
    return this.state.loading ? (
      <Loading />
    ) : (
      <View style={{flex: 1}}>
        <Header
          tapped={() => (this.props.navigation as any).toggleDrawer()}
          title="Acceuil"
        />
        <View style={styles.wrapper}>
          <View style={{flex: 70}}>
            <Image
              style={styles.logo}
              source={require('../../assets/logo256.png')}
            />
            <View
              style={{marginTop: 15, marginBottom: 50, alignItems: 'center'}}>
              <Text style={styles.title}>Votre score:</Text>
              <Score score={this.state.score} />
              <Text style={styles.subtitle}>
                Cela indique le niveau de risque auquel vous êtes exposé, plus
                le score est faible, plus le risque est élevé.
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Stats')}
                style={styles.btn}>
                <Icon name="chart-bar" size={20} />
                <Text style={{fontSize: 16, marginLeft: 10}}>
                  Plus de statistiques
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 30, width: '100%'}}>
            <View style={styles.menu}>
              <View style={styles.col}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Tracking')}
                  style={styles.menuButton}>
                  <Image
                    style={styles.menuItem}
                    source={require('../../assets/menu/map.png')}
                  />
                  <Text style={styles.menuText}>Tracking</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Terms')}
                  style={styles.menuButton}>
                  <Image
                    style={styles.menuItem}
                    source={require('../../assets/menu/privacy.png')}
                  />
                  <Text style={styles.menuText}>Termes de confidentialite</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.col}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('History')}
                  style={styles.menuButton}>
                  <Image
                    style={styles.menuItem}
                    source={require('../../assets/menu/itinerary.png')}
                  />
                  <Text style={styles.menuText}>Trajets</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Settings')}
                  style={styles.menuButton}>
                  <Image
                    style={styles.menuItem}
                    source={require('../../assets/menu/gear.png')}
                  />
                  <Text style={styles.menuText}>Parametres</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.col}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Survey')}
                  style={styles.menuButton}>
                  <Image
                    style={styles.menuItem}
                    source={require('../../assets/menu/survey.png')}
                  />
                  <Text style={styles.menuText}>Questionnaire</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Report')}
                  style={styles.menuButton}>
                  <Image
                    style={styles.menuItem}
                    source={require('../../assets/menu/caution.png')}
                  />
                  <Text style={styles.menuText}>Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={{flex: 1}}></View>
        <Popup
          showOverlay={this.state.showOverlay}
          goTo={(path: string) => {
            this.setState({showOverlay: false});
            this.props.navigation.navigate(path);
          }}
          cancel={() => this.setState({showOverlay: false})}
        />
      </View>
    );
  }
}
