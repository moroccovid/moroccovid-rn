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
      //TODO: remove this in prod
      dropSchema: true,
    });
  }

  async create(): Promise<number> {
    const trajet = new Trajet();
    const repo = getRepository(Trajet);

    await repo.save(trajet);

    return trajet.id;
  }

  async doneTracking(id: number, points: Location[]): Promise<Trajet> {
    const repo = getRepository(Trajet);
    const trajet = await repo.findOneOrFail(id);

    trajet.locations = points;

    // TODO: calculate max and min of each field

    await repo.save(trajet);

    return trajet;
  }

  async getAll(): Promise<Trajet[]> {
    const repo = getRepository(Trajet);

    const trajets = await repo.find();
    console.log('TrajetService -> trajets', trajets);

    return trajets;
  }
}
