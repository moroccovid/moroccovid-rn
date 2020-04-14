import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm/browser';
import {Location} from './Location';

@Entity('trajet')
export class Trajet {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => Location, (location) => location.trajet)
  locations: Location[];

  @Column('long')
  start: number;

  @Column('long')
  end: number;

  @Column('float')
  min_latitude: number;

  @Column('float')
  max_latitude: number;

  @Column('float')
  min_longitude: number;

  @Column('float')
  max_longitude: number;

  @Column('float')
  min_altitude: number;

  @Column('float')
  max_altitude: number;

  @Column('float')
  min_heading: number;

  @Column('float')
  max_heading: number;

  @Column('float')
  min_speed: number;

  @Column('float')
  max_speed: number;

  @Column('double')
  min_accuracy: number;

  @Column('double')
  max_accuracy: number;
}
