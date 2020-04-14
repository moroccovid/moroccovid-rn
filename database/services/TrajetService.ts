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

  async delete(id: number) {
    const repo = getRepository(Trajet);
    await repo.delete(id);
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

    trajet.min_altitude = Math.min(...points.map((point) => point.altitude));
    trajet.max_altitude = Math.max(...points.map((point) => point.altitude));

    trajet.min_latitude = Math.min(...points.map((point) => point.latitude));
    trajet.max_latitude = Math.max(...points.map((point) => point.latitude));

    trajet.min_longitude = Math.min(...points.map((point) => point.longitude));
    trajet.max_longitude = Math.max(...points.map((point) => point.longitude));

    trajet.min_heading = Math.min(...points.map((point) => point.heading));
    trajet.max_heading = Math.max(...points.map((point) => point.heading));

    trajet.min_accuracy = Math.min(...points.map((point) => point.accuracy));
    trajet.max_accuracy = Math.max(...points.map((point) => point.accuracy));

    trajet.min_speed = Math.min(...points.map((point) => point.speed));
    trajet.max_speed = Math.max(...points.map((point) => point.speed));

    trajet.start = Math.min(...points.map((point) => point.timestamp));
    trajet.end = Math.max(...points.map((point) => point.timestamp));

    try {
      await repo.save(trajet);
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

  async get(id: number): Promise<Trajet> {
    const repo = getRepository(Trajet);

    const trajet = await repo.findOneOrFail(id, {relations: ['locations']});

    return trajet;
  }
}
