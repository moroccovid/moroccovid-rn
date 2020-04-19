import React, {Component} from 'react';
import {Text, View} from 'react-native';
import styles from './style';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import Loading from '../utils/Loading/Loading';
import Header from '../utils/Header/Header';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import {Input} from 'react-native-elements';
import Perso from './Perso';

export default class Survey extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {loading: false};
  componentDidMount() {}
  /**
   * First step: (age,sexe)
   * Second step:
   */
  //   Votre age :
  // Votre sexe:
  // Avez-vous actuellement une maladie chronique :
  // Avez-vous eu les symptômes suivants aujourd'hui?.Veuillez les cocher si c'est le cas :
  // --Fièvre supérieure à 38 degrés.
  // --Difficulté à respirer.
  // --Maux d'estomac.
  // --Douleurs musculaires.
  // --Fatigue ou faiblesse importante.
  // --Congestion nasale ou nez qui coule.
  // --Inflammation de la gorge.
  // --Toux sèche.
  // --Toux Avec mucus.
  // Depuis combien du temps avez-vous toussé ?
  render() {
    return this.state.loading ? (
      <Loading />
    ) : (
      <View style={{flex: 1}}>
        <Header
          title="Questionnaire"
          tapped={() => (this.props.navigation as any).toggleDrawer()}
        />
        <View style={{flex: 9}}>
          <ProgressSteps>
            <ProgressStep label="Information personel" nextBtnText="Suivant">
              <View style={styles.stepView}>
                <Perso />
              </View>
            </ProgressStep>
            <ProgressStep label="Second Step">
              <View style={{alignItems: 'center'}}>
                <Text>This is the content within step 2!</Text>
              </View>
            </ProgressStep>
          </ProgressSteps>
        </View>
      </View>
    );
  }
}
