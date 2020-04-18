import React, {Fragment} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import styles from '../style';
import colors from '../../../theme/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';

export function Panel(props: {
  status: 'none' | 'started' | 'finished';
  error: boolean;
  synced: boolean;
  syncing: boolean;
  errorMsg: string | null;
  trajet_id: number | null;
  startTracking: any;
  stopTracking: any;
  goAgain: any;
  delete: any;
  syncTrajet: any;
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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {props.syncing ? (
                <ActivityIndicator />
              ) : !props.synced ? (
                <TouchableOpacity
                  onPress={async () => await props.syncTrajet()}>
                  <Icon
                    name="cloud-upload-alt"
                    size={22}
                    style={{marginLeft: 10}}
                  />
                </TouchableOpacity>
              ) : (
                <Icon name="check" size={22} style={{marginLeft: 10}} />
              )}
              <Icon
                name="trash"
                size={22}
                color={colors.danger}
                style={{marginLeft: 10}}
                onPress={() => props.delete(props.trajet_id)}
              />
            </View>
          </View>
        </Fragment>
      )}
      {props.error && <Text style={styles.error}>{props.errorMsg}</Text>}
    </View>
  );
}
