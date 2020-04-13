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

export default class Welcome extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {loading: true};
  componentDidMount() {
    setTimeout(() => {
      this.setState({loading: false});
    }, 1000);
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
          <View style={{flex: 55}}>
            <Image
              style={styles.logo}
              source={require('../../assets/logo256.png')}
            />
            <View
              style={{marginTop: 15, marginBottom: 50, alignItems: 'center'}}>
              <Text style={styles.number}>+2120612345678</Text>
              <Score score={3.5} />
            </View>
          </View>
          <View style={{flex: 44, width: '100%'}}>
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
                  onPress={() => this.props.navigation.navigate('About')}
                  style={styles.menuButton}>
                  <Image
                    style={styles.menuItem}
                    source={require('../../assets/menu/question.png')}
                  />
                  <Text style={styles.menuText}>A propos de nous</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={{flex: 1}}></View>
      </View>
    );
  }
}
