import {StyleSheet} from 'react-native';

const color = '#34495e';

const styles = StyleSheet.create({
  upperView: {
    flex: 2,
  },
  bottomView: {flex: 3},
  selectWrapper: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
    flex: 3,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 60,
  },
  choice: {
    alignItems: 'center',
    borderRadius: 15,
    padding: 10,
    borderWidth: 1,
    width: '30%',
    marginHorizontal: 5,
  },
  selectedChoice: {
    backgroundColor: color,
  },
  choiceIcon: {alignSelf: 'center'},
  choiceText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
  selectedText: {
    color: 'white',
  },
  desc: {
    fontSize: 18,
    color: 'gray',
    padding: 20,
    flex: 5,
    textAlign: 'center',
  },
});

export default styles;
