
export class Equipement {
    id!: number;
    nom!: string;
    etat!: Etat;
    type!: string;
    localisation!: string;
    categorie!: string;
    fournisseur!: string;
    serviceAffecte!: string;
    dateMiseEnService!: Date;
    dateProchaineMaintenance!: Date;
    image!: string;

}

export enum Etat {
    EN_SERVICE = 'EN_SERVICE',
    EN_PANNE = 'EN_PANNE',
    EN_MAINTENANCE = 'EN_MAINTENANCE'
}

