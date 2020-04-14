import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm/browser';
import {Trajet} from './Trajet';

@Entity('location')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column('float')
  altitude: number;

  @Column('float')
  heading: number;

  @Column('float')
  speed: number;

  @Column('double')
  accuracy: number;

  @Column('long')
  timestamp: number;

  @ManyToOne((type) => Trajet, (trajet) => trajet.locations)
  trajet: Trajet;
}
