import React, {Component} from 'react';
import {View, Text, Picker} from 'react-native';
import {Input} from 'react-native-elements';
import styles from './style';
import * as yup from 'yup';
import {Formik} from 'formik';

export default class Perso extends Component<{}> {
  next(values: any) {}
  render() {
    return (
      <Formik
        initialValues={{age: '', sexe: 'homme'}}
        onSubmit={(values) => this.next(values)}
        validationSchema={yup.object().shape({
          age: yup
            .number()
            .integer("L'age est un entier!")
            .typeError('Doit être un numéro')
            .required('Veuillez remplir ce champ')
            .min(0, 'Doit être supérieur à 0'),
          sexe: yup.string().required(),
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
          <View>
            <Text style={styles.label}>Votre age:</Text>
            <Input
              onChangeText={handleChange('age')}
              placeholder="Age"
              errorMessage={errors.age}
              value={values.age}
              keyboardType="number-pad"
              containerStyle={{marginTop: 20}}
            />

            <Text style={styles.label}>Votre sexe:</Text>
            <Picker
              style={{marginHorizontal: 20, marginTop: 20}}
              selectedValue="homme"
              onValueChange={handleChange('sexe')}>
              <Picker.Item label="Homme" value="homme" />
              <Picker.Item label="Femme" value="femme" />
            </Picker>
          </View>
        )}
      </Formik>
    );
  }
}
