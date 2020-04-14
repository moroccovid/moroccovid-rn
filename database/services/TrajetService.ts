import {createConnection, getRepository} from 'typeorm/browser';
import {Location} from '../entities/Location';
import {Trajet} from '../entities/Trajet';

export default class TrajetService {
  async connect() {
    return createConnection({
      type: 'react-native',
      database: 'test',
      location: 'default',
      logging: ['error', 'query', 'schema'],
      synchronize: true,
      entities: [Trajet, Location],
      dropSchema: true,
    });
  }

  async create(): Promise<number> {
    await this.connect();

    const trajet = new Trajet();
    const repo = getRepository(Trajet);

    await repo.save(trajet);
    console.log('TrajetService -> trajet', trajet);

    return trajet.id;
  }

  async getAll(): Promise<Trajet[]> {
    await this.connect();
    const repo = getRepository(Trajet);

    const trajets = await repo.find();
    console.log('TrajetService -> trajets', trajets);

    return trajets;
  }
}
