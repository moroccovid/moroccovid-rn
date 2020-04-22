import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Header from '../utils/Header/Header';
import {
  NavigationScreenProp,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import styles from './style';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default class Report extends Component<{
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}> {
  state: any = {
    selected: 0,
    descs: [
      '',
      "Vous n'avez pas attrapé le coronavirus et vous ne pensez pas l'avoir attrapé.",
      'Vous pensez que vous avez peut-être attrapé le virus.',
      'Vous avez été testé positif au virus.',
    ],
  };

  select = (selected: number) => {
    this.setState({selected});
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Header
          title="Report"
          tapped={() => (this.props.navigation as any).toggleDrawer()}
        />
        <View style={styles.upperView}>
          <Text style={styles.title}>
            Veuillez nous aider en fournissant votre statut actuel.
          </Text>
        </View>

        <View style={styles.bottomView}>
          <View style={styles.selectWrapper}>
            <Choice
              title="Testé négatif"
              icon="thumbs-up"
              selected={this.state.selected == 1}
              select={() => this.select(1)}
            />

            <Choice
              title="Suspect"
              icon="question-circle"
              selected={this.state.selected == 2}
              select={() => this.select(2)}
            />

            <Choice
              title="Testé positif"
              icon="hospital"
              selected={this.state.selected == 3}
              select={() => this.select(3)}
            />
          </View>
          <Text style={styles.desc}>
            {this.state.descs[this.state.selected]}
          </Text>
          <Button title="Confirmer" disabled={!this.state.selected} />
        </View>
      </View>
    );
  }
}

function Choice(props: {
  title: string;
  icon: string;
  selected: boolean;
  select: any;
}) {
  return (
    <View
      style={[styles.choice, props.selected ? styles.selectedChoice : null]}>
      <TouchableOpacity onPress={() => props.select(1)}>
        <Icon
          name={props.icon}
          size={50}
          color={props.selected ? 'white' : 'black'}
          style={styles.choiceIcon}
        />
        <Text
          style={[
            styles.choiceText,
            props.selected ? styles.selectedText : null,
          ]}>
          {props.title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
