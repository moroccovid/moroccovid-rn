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

    points.forEach((point) => {
      let location = new Location();
      Object.keys(point).forEach((key) => {
        (location as any)[key] = (point as any)[key];
      });
      location.trajet = trajet;
      getRepository(Location).save(location);
    });

    // TODO: calculate max and min of each field

    try {
      await repo.update(id, trajet);
    } catch (error) {
      console.log('TrajetService -> error', error);
    }

    return trajet;
  }

  async getAll(includeLocatios: boolean = false): Promise<Trajet[]> {
    const repo = getRepository(Trajet);

    const trajets = includeLocatios
      ? await repo.find({relations: ['locations']})
      : await repo.find();

    return trajets;
  }
}
