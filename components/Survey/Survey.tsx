import React, {Component} from 'react';
import {Text, View, Picker} from 'react-native';
import styles from './style';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import Loading from '../utils/Loading/Loading';
import Header from '../utils/Header/Header';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import {Input, CheckBox} from 'react-native-elements';
import colors from '../../theme/colors';
export default class Survey extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {loading: false, sexe: 'homme'};
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

  persoDone = () => {};
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
          <ProgressSteps activeStep={0}>
            <ProgressStep
              nextBtnDisabled={
                !this.state.age ||
                !this.state.sexe ||
                (this.state.chronique && !this.state.maladie)
              }
              label="Information personel"
              nextBtnText="Suivant">
              <View style={styles.stepView}>
                <Text style={styles.label}>Votre age:</Text>
                <Input
                  onChangeText={(age) => this.setState({age})}
                  placeholder="Age"
                  value={this.state.age}
                  keyboardType="number-pad"
                  containerStyle={{marginTop: 20}}
                />

                <Text style={styles.label}>Votre sexe:</Text>
                <Picker
                  style={{marginHorizontal: 20, marginTop: 20}}
                  selectedValue="homme"
                  onValueChange={(sexe) => this.setState({sexe})}>
                  <Picker.Item label="Homme" value="homme" />
                  <Picker.Item label="Femme" value="femme" />
                </Picker>

                <CheckBox
                  containerStyle={{
                    marginTop: 20,
                    backgroundColor: 'transparent',
                  }}
                  checkedColor={colors.primary}
                  onPress={() =>
                    this.setState({chronique: !this.state.chronique})
                  }
                  textStyle={{fontSize: 16, fontWeight: 'normal'}}
                  title="Avez-vous actuellement une maladie chronique?"
                  checked={this.state.chronique}
                />

                {this.state.chronique && (
                  <Input
                    onChangeText={(maladie) => this.setState({maladie})}
                    placeholder="Votre maladie"
                    value={this.state.maladie}
                    containerStyle={{marginTop: 20}}
                  />
                )}
              </View>
            </ProgressStep>
            <ProgressStep label="Second Step">
              <View style={styles.stepView}>
                <Text style={styles.label}>Votre sexe:</Text>
                <Picker
                  style={{marginHorizontal: 20, marginTop: 20}}
                  selectedValue="homme"
                  onValueChange={(sexe) => this.setState({sexe})}>
                  <Picker.Item label="Homme" value="homme" />
                  <Picker.Item label="Femme" value="femme" />
                </Picker>
              </View>
            </ProgressStep>
          </ProgressSteps>
        </View>
      </View>
    );
  }
}
