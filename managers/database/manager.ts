import {Trajet} from './entities/Trajet';
import {Location} from './entities/Location';
import {createConnection} from 'typeorm/browser';
import {Alert} from 'react-native';

export default class DatabaseManager {
  async connect() {
    try {
      return createConnection({
        type: 'react-native',
        database: 'test',
        location: 'default',
        logging: ['error'],
        synchronize: true,
        entities: [Trajet, Location],
      });
    } catch (err) {
      console.warn('DatabaseManager -> connect -> err', err);
      Alert.alert('Erreur', 'Un erreur est survenu!');
    }
  }
}
