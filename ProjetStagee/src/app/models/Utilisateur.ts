
export class Utilisateur {
    id!: number;
    cin!: string;
    nom!: string;
    password!: string;
    email!: string;
    role!: Role;
    image!: string;
    status!: boolean;


}


export enum Role {
    ADMIN = 'ADMIN',
    TECHNICIEN_MAINTENANCE = 'TECHNICIEN_MAINTENANCE',
    CHEF_SERVICE_MAINTENANCE = 'CHEF_SERVICE_MAINTENANCE',
    CHEF_SERVICE_HOSPITALIER = 'CHEF_SERVICE_HOSPITALIER',
    CHEF_SERVICE_MAGASIN = 'CHEF_SERVICE_MAGASIN'
}


