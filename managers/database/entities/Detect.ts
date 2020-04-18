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

  @Column('varchar')
  mac: number;

  @ManyToOne((type) => Trajet, (trajet) => trajet.locations, {
    onDelete: 'CASCADE',
  })
  trajet: Trajet;
}
