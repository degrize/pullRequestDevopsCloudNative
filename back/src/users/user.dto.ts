import { AssociationDTO } from "src/associations/association.dto";

export class UserDTO {
    constructor(
        public id: number,
        public firstname: string,
        public lastname: string,
        public email: string,
        public age: number,
        public associations: AssociationDTO[]
    ) { }
}