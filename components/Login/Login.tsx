import React, {Component, Fragment} from 'react';
import {Text, View, Image} from 'react-native';
import styles from './style';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import Loading from '../utils/Loading/Loading';
import {Input, Button} from 'react-native-elements';
import colors from '../../theme/colors';
import * as yup from 'yup';
import {Formik} from 'formik';
import StorageManager from '../../managers/storage/storageManager';

export default class Login extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {loadingForm: false};
  submit(values: any) {
    this.setState({loadingForm: true});
    StorageManager.saveItem('number', values.number)
      .then(() => {
        this.setState({loadingForm: false});
        this.props.navigation.navigate('Drawer');
      })
      .catch((err: any) => {
        console.warn(err);
      });
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <Image
          style={styles.logo}
          source={require('../../assets/logo256.png')}
        />
        <Text style={styles.title}>Identification</Text>
        <Text style={styles.subtitle}>
          On est besoin de votre numero de telephone pour vous identifiez.
        </Text>

        <View style={{paddingHorizontal: 50, marginTop: 100}}>
          <Formik
            initialValues={{number: ''}}
            onSubmit={(values) => this.submit(values)}
            validationSchema={yup.object().shape({
              number: yup
                .string()
                .required('Veuillez remplir ce champ')
                .matches(
                  /(06|07)[0-9]{8}$/g,
                  'Doit suivre le format 06xxxxxxxx ou 07xxxxxxxx',
                ),
            })}>
            {({
              values,
              handleChange,
              errors,
              setFieldTouched,
              touched,
              isValid,
              handleSubmit,
            }) => (
              <Fragment>
                <Input
                  placeholder="Telephone, ex: 0612345678"
                  keyboardType="phone-pad"
                  inputStyle={{fontSize: 16}}
                  leftIcon={{type: 'font-awesome', size: 24, name: 'phone'}}
                  value={values.number}
                  onChangeText={handleChange('number')}
                  onChange={() => setFieldTouched('number')}
                  errorMessage={errors.number}
                />
                <Button
                  containerStyle={{marginTop: 50}}
                  buttonStyle={{backgroundColor: colors.primary}}
                  title="S'identifier"
                  onPress={handleSubmit}
                  disabled={!isValid || !touched.number}
                  loading={this.state.loadingForm}
                />
              </Fragment>
            )}
          </Formik>
        </View>
      </View>
    );
  }
}
