import React from 'react';
import {Text, View, Dimensions} from 'react-native';
import {StackedBarChart} from 'react-native-chart-kit';
import backendManager from '../../../../managers/backend/backendManager';
import dayjs from 'dayjs';
import fr from 'dayjs/locale/fr';
import {ActivityIndicator} from 'react-native';

dayjs.locale(fr);

export default class StackedChart extends React.Component {
  state: any = {data: [], loading: true};
  async componentDidMount() {
    let stats = await backendManager.citizen.getStats();
    const barColors = ['#2ecc71', '#f1c40f', '#e74c3c'];
    const legend = ['Non infecté', 'Suspect', 'Infecté'];
    const labels: any = [];
    let data: any = {labels, legend, barColors, data: []};
    for (let i = 0; i < stats.infected.length; i++) {
      labels.push(
        dayjs()
          .add(i - 7, 'day')
          .format('dd'),
      );
      data.data.push([
        stats.nonInfected[i] + Math.ceil(Math.random() * 5),
        stats.suspect[i] + Math.ceil(Math.random() * 3),
        stats.infected[i] + Math.ceil(Math.random() * 1),
      ]);
    }
    this.setState({loading: false, data});
    console.log('Chart -> componentWillMount -> data', JSON.stringify(data));
  }
  render() {
    return this.state.loading ? (
      <ActivityIndicator size="large" />
    ) : (
      <StackedBarChart
        width={Dimensions.get('screen').width - 20}
        height={300}
        data={this.state.data}
        chartConfig={{
          propsForBackgroundLines: {
            stroke: 0,
          },
          barPercentage: 0.8,
          backgroundColor: 'white',
          backgroundGradientFrom: 'white',
          backgroundGradientTo: 'white',
          style: {padding: 20},
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        hideLegend={true}
      />
    );
  }
}
