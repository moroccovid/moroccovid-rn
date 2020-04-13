import {StyleSheet, Dimensions} from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flex: 9,
  },
  logo: {
    width: 200,
    height: 200,
  },
  number: {
    fontSize: 18,
  },
  menu: {
    flexDirection: 'row',
    marginTop: 10,
  },
  menuButton: {
    margin: 5,
  },
  menuItem: {
    width: 60,
    height: 60,
    alignSelf: 'center',
  },
  menuText: {
    fontSize: 14,
    textAlign: 'center',
  },
  col: {
    flex: 1,
  },
});

export default styles;
