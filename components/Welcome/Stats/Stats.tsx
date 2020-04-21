import React from 'react';
import {Text, View} from 'react-native';
import Header from '../../utils/Header/Header';
import StackedChart from './StackedChart/StackedChart';

export default class Stats extends React.Component {
  render() {
    return (
      <View>
        <Header
          title="Statistique"
          icon="arrow-left"
          tapped={() => (this.props as any).navigation.navigate('Welcome')}
        />
        <View
          style={{
            padding: 20,
            backgroundColor: 'white',
            borderRadius: 20,
            margin: 10,
            alignItems: 'center',
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 16, marginBottom: 20}}>
            Contacts par jours (derniere semaine)
          </Text>
          <StackedChart />
        </View>
      </View>
    );
  }
}
