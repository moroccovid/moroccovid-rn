import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm/browser';
import {Trajet} from './Trajet';

@Entity('detect')
export class Detect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  mac: string;

  @ManyToOne((type) => Trajet, (trajet) => trajet.locations, {
    onDelete: 'CASCADE',
  })
  trajet: Trajet;
}
