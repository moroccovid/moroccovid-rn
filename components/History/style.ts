import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  list: {marginTop: 20, paddingHorizontal: 50},
  listItem: {
    marginVertical: 10,
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 20,
  },
  itemTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  notFound: {textAlign: 'center', fontSize: 16, color: 'gray', marginTop: 20},
});

export default styles;
