import {createConnection, getRepository} from 'typeorm/browser';
import {Location} from '../entities/Location';
import {Trajet} from '../entities/Trajet';
import {ToastAndroid, Alert} from 'react-native';

export default class TrajetService {
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

  async doneTracking(id: number, points: Location[]): Promise<Trajet | null> {
    try {
      const repo = getRepository(Trajet);
      let trajet = await repo.findOneOrFail(id);
      points.forEach((point) => {
        let location = new Location();
        Object.keys(point).forEach((key) => {
          (location as any)[key] = (point as any)[key];
        });
        location.trajet = trajet;
        getRepository(Location).insert(location);
      });

      trajet.min_altitude = Math.min(...points.map((point) => point.altitude));
      trajet.max_altitude = Math.max(...points.map((point) => point.altitude));

      trajet.min_latitude = Math.min(...points.map((point) => point.latitude));
      trajet.max_latitude = Math.max(...points.map((point) => point.latitude));

      trajet.min_longitude = Math.min(
        ...points.map((point) => point.longitude),
      );
      trajet.max_longitude = Math.max(
        ...points.map((point) => point.longitude),
      );

      trajet.min_heading = Math.min(...points.map((point) => point.heading));
      trajet.max_heading = Math.max(...points.map((point) => point.heading));

      trajet.min_accuracy = Math.min(...points.map((point) => point.accuracy));
      trajet.max_accuracy = Math.max(...points.map((point) => point.accuracy));

      trajet.min_speed = Math.min(...points.map((point) => point.speed));
      trajet.max_speed = Math.max(...points.map((point) => point.speed));

      trajet.start = Math.min(...points.map((point) => point.timestamp));
      trajet.end = Math.max(...points.map((point) => point.timestamp));

      delete trajet.locations;
      await repo.update(id, trajet);
      return trajet;
    } catch (error) {
      console.log('TrajetService -> error', error);
    }
    return null;
  }

  async getAll(includeLocatios: boolean = false): Promise<Trajet[]> {
    const repo = getRepository(Trajet);

    const trajets = includeLocatios
      ? await repo.find({relations: ['locations'], order: {id: 'DESC'}})
      : await repo.find({order: {id: 'DESC'}});

    return trajets;
  }

  async get(id: number): Promise<Trajet> {
    const repo = getRepository(Trajet);

    const trajet = await repo.findOneOrFail(id, {relations: ['locations']});

    return trajet;
  }

  async synced(id: number) {
    let trajet = await this.get(id);
    trajet.synced = true;
    await getRepository(Trajet).save(trajet);
  }
}
