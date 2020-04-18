import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm/browser';
import {Trajet} from './Trajet';

@Entity('location')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float', {nullable: true})
  latitude: number;

  @Column('float', {nullable: true})
  longitude: number;

  @Column('float', {nullable: true})
  altitude: number;

  @Column('float', {nullable: true})
  heading: number;

  @Column('float', {nullable: true})
  speed: number;

  @Column('double', {nullable: true})
  accuracy: number;

  @Column('unsigned big int', {nullable: true})
  timestamp: number;

  @ManyToOne((type) => Trajet, (trajet) => trajet.locations, {
    onDelete: 'CASCADE',
  })
  trajet: Trajet;
}
