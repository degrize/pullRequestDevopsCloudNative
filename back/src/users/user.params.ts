import { ApiProperty } from "@nestjs/swagger";

export class UserParamID {
  @ApiProperty({
    description: "The user's ID",
    default: 0,
    minimum: 0,
    type: Number
  })
  public id: number;
}

export class UserParamEmail {
  @ApiProperty({
    description: "The user's email",
    example: "myemail@mail.com",
    type: String
  })
  public email: string;
}