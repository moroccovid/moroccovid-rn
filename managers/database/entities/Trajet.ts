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

  @Column('unsigned big int', {nullable: true})
  start: number;

  @Column('unsigned big int', {nullable: true})
  end: number;

  @Column('float', {nullable: true})
  min_latitude: number;

  @Column('float', {nullable: true})
  max_latitude: number;

  @Column('float', {nullable: true})
  min_longitude: number;

  @Column('float', {nullable: true})
  max_longitude: number;

  @Column('float', {nullable: true})
  min_altitude: number;

  @Column('float', {nullable: true})
  max_altitude: number;

  @Column('float', {nullable: true})
  min_heading: number;

  @Column('float', {nullable: true})
  max_heading: number;

  @Column('float', {nullable: true})
  min_speed: number;

  @Column('float', {nullable: true})
  max_speed: number;

  @Column('double', {nullable: true})
  min_accuracy: number;

  @Column('double', {nullable: true})
  max_accuracy: number;
}
