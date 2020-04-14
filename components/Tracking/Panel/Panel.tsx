import React, {Fragment} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from '../style';
import colors from '../../../theme/colors';
import {Button} from 'react-native-elements';

export function Panel(props: {
  status: 'none' | 'started' | 'finished';
  error: boolean;
  errorMsg: string | null;
  trajet_id: number | null;
  startTracking: any;
  stopTracking: any;
  goAgain: any;
}) {
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 50,
        justifyContent: 'center',
      }}>
      {props.status == 'none' ? (
        <TouchableOpacity
          style={{
            padding: 20,
            backgroundColor: colors.primary,
            borderRadius: 20,
          }}
          onPress={props.startTracking}>
          <Text style={{textAlign: 'center', fontSize: 18, color: 'white'}}>
            START
          </Text>
        </TouchableOpacity>
      ) : props.status == 'started' ? (
        <Fragment>
          <TouchableOpacity
            style={{
              padding: 20,
              backgroundColor: 'red',
              borderRadius: 20,
            }}
            onPress={() => props.stopTracking()}>
            <Text style={{textAlign: 'center', fontSize: 18, color: 'white'}}>
              STOP
            </Text>
          </TouchableOpacity>
          <Text style={{textAlign: 'center', fontSize: 16}}>
            ID de trajet: {props.trajet_id}
          </Text>
        </Fragment>
      ) : (
        <Fragment>
          <TouchableOpacity
            style={{
              padding: 20,
              backgroundColor: colors.primary,
              borderRadius: 20,
            }}
            onPress={props.startTracking}>
            <Text style={{textAlign: 'center', fontSize: 18, color: 'white'}}>
              START
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Text style={{fontSize: 14}}>Trajet #{props.trajet_id}</Text>
            <Text style={{fontSize: 14, color: 'red'}} onPress={props.delete}>
              Supprimer
            </Text>
          </View>
        </Fragment>
      )}
      {props.error && <Text style={styles.error}>{props.errorMsg}</Text>}
    </View>
  );
}
