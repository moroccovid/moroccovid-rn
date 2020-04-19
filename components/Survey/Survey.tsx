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
import {ScrollView} from 'react-native-gesture-handler';
export default class Survey extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {
    loading: false,
    sexe: 'homme',
    symptoms: [
      {text: 'Difficulté à respirer', checked: false},
      {text: 'Fièvre supérieure à 38 degrés', checked: false},
      {text: "Maux d'estomac", checked: false},
      {text: 'Douleurs musculaires', checked: false},
      {text: 'Fatigue ou faiblesse importante', checked: false},
      {text: 'Congestion nasale ou nez qui coule', checked: false},
      {text: 'Inflammation de la gorge', checked: false},
      {text: 'Toux sèche', checked: false},
      {text: 'Toux Avec mucus', checked: false},
    ],
  };
  componentDidMount() {}

  toggleSymptom = (index: number) => {
    let {symptoms} = this.state;
    symptoms[index].checked = !symptoms[index].checked;
    this.setState({symptoms});
  };
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
          <ProgressSteps activeStep={2}>
            <ProgressStep
              nextBtnDisabled={
                !this.state.age ||
                !this.state.sexe ||
                (this.state.chronique && !this.state.maladie)
              }
              nextBtnText="Suivant"
              label="Information personel">
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
                  containerStyle={styles.checkboxContainer}
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
            <ProgressStep
              label="Symptômes"
              previousBtnText="Précédent "
              nextBtnDisabled={
                (this.state.symptoms[7].checked ||
                  this.state.symptoms[8].checked) &&
                !this.state.days
              }
              nextBtnText="Suivant">
              <View style={styles.stepView}>
                <Text style={styles.label}>
                  Avez-vous eu les symptômes suivants aujourd'hui?.Veuillez les
                  cocher si c'est le cas:
                </Text>

                <ScrollView>
                  {this.state.symptoms.map((symp: any, index: number) => (
                    <CheckBox
                      title={symp.text}
                      checked={symp.checked}
                      containerStyle={styles.checkboxContainer}
                      onPress={() => this.toggleSymptom(index)}
                    />
                  ))}
                  {this.state.symptoms[7].checked ||
                  this.state.symptoms[8].checked ? (
                    <View>
                      <Text style={styles.label}>
                        Depuis combien du temps avez-vous toussé ?
                      </Text>
                      <Input
                        onChangeText={(days) => this.setState({days})}
                        placeholder="Nombre de jours"
                        value={this.state.days}
                        keyboardType="number-pad"
                        containerStyle={{marginTop: 20}}
                      />
                    </View>
                  ) : null}
                </ScrollView>
              </View>
            </ProgressStep>

            <ProgressStep
              label="Finalisation"
              previousBtnText="Précédent"
              nextBtnDisabled={!this.state.number}
              finishBtnText="Envoyer">
              <View style={styles.stepView}>
                <Text style={styles.label}>Votre numero de telephone:</Text>
              </View>
            </ProgressStep>
          </ProgressSteps>
        </View>
      </View>
    );
  }
}
