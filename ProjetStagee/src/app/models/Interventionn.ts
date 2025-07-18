
export class Interventionn {
  id!: number;
  date!: Date;
  description!: string;
  typeIntervention!: TypeIntervention;
equipement: any;
 
}


  export enum TypeIntervention {
  MAINTENANCE_PREVENTIVE = 'MAINTENANCE_PREVENTIVE',
  MAINTENANCE_CURATIVE = 'MAINTENANCE_CURATIVE'
}


