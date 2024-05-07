import { ApiProperty } from "@nestjs/swagger";

export class AssociationParamID {
  @ApiProperty({
    description: "The association's ID",
    default: 0,
    minimum: 0,
    type: Number
  })
  public id: number;
}