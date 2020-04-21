import {StyleSheet, Dimensions} from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flex: 9,
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    marginTop: 10,
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
