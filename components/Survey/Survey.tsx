import React, {Component} from 'react';
import {Text, View, Picker, ToastAndroid} from 'react-native';
import styles from './style';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import Header from '../utils/Header/Header';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import {Input, CheckBox} from 'react-native-elements';
import colors from '../../theme/colors';
import {ScrollView} from 'react-native-gesture-handler';
import backendManager from '../../managers/backend/backendManager';
import Success from './Success';
export default class Survey extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {
    success: false,
    sexe: 'homme',
    chronic: false,
    symptoms: [
      {
        text: 'Difficulté à respirer',
        checked: false,
        label: 'difficultybreathing',
      },
      {text: 'Fièvre supérieure à 38 degrés', checked: false, label: 'fever'},
      {text: "Maux d'estomac", checked: false, label: 'stomachache'},
      {text: 'Douleurs musculaires', checked: false, label: 'muscleaches'},
      {
        text: 'Fatigue ou faiblesse importante',
        checked: false,
        label: 'weakness',
      },
      {
        text: 'Congestion nasale ou nez qui coule',
        checked: false,
        label: 'nasal',
      },
      {
        text: 'Inflammation de la gorge',
        checked: false,
        label: 'throatinflammation',
      },
      {text: 'Toux sèche', checked: false, label: 'drycough'},
      {text: 'Toux Avec mucus', checked: false, label: 'coughmucus'},
    ],
  };

  toggleSymptom = (index: number) => {
    let {symptoms} = this.state;
    symptoms[index].checked = !symptoms[index].checked;
    this.setState({symptoms});
  };

  handleNumberChange = (number: string) => {
    this.setState({number});
    if (number.match(/(06|07)[0-9]{8}$/g))
      return this.setState({numberError: ''});

    this.setState({numberError: 'Format invalide'});
  };

  submit = async () => {
    let data: any = {
      datetime: new Date().getTime(),
      age: this.state.age,
      sexe: this.state.sexe,
      chronic: this.state.chronic ? 1 : 0,
      coughduration: this.state.days,
      phone: this.state.number,
    };
    this.state.symptoms.forEach((el: any) => {
      data[el.label] = el.checked ? 1 : 0;
    });
    let success = await backendManager.saveSurvey(data);

    if (success) return this.setState({success});

    ToastAndroid.show(
      'Une erreur est survenue, réessayez plus tard.',
      ToastAndroid.LONG,
    );
  };
  render() {
    return this.state.success ? (
      <Success goHome={() => this.props.navigation.navigate('Home')} />
    ) : (
      <View style={{flex: 1}}>
        <Header
          title="Questionnaire"
          tapped={() => (this.props.navigation as any).toggleDrawer()}
        />
        <View style={{flex: 9}}>
          <ProgressSteps>
            <ProgressStep
              nextBtnDisabled={!this.state.age || !this.state.sexe}
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
                  onPress={() => this.setState({chronic: !this.state.chronic})}
                  textStyle={{fontSize: 16, fontWeight: 'normal'}}
                  title="Avez-vous actuellement une maladie chronique?"
                  checked={this.state.chronic}
                />
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
              nextBtnDisabled={
                this.state.numberError?.length > 0 || !this.state.number
              }
              onSubmit={this.submit}
              finishBtnText="Envoyer">
              <View style={styles.stepView}>
                <Text style={styles.label}>Votre numero de telephone:</Text>
                <Input
                  onChangeText={this.handleNumberChange}
                  placeholder="Numéro de téléphone"
                  value={this.state.number}
                  errorMessage={this.state.numberError}
                  keyboardType="number-pad"
                  containerStyle={{marginTop: 20}}
                />
              </View>
            </ProgressStep>
          </ProgressSteps>
        </View>
      </View>
    );
  }
}
