import { ApiProperty } from "@nestjs/swagger";

export class AssociationInput {

  @ApiProperty({
    description: "The IDs of the users belonging to the association",
    example: [0, 1],
    type: [Number]
  })
  public idUsers: Array<number>;

  @ApiProperty({
    description: "The name of the association.",
    example: "Doe",
    type: String
  })
  public name: string;
}

export class AssociationJoinInput {
  @ApiProperty({
    description: "The ID of the user joining the association",
    example: 1,
    type: Number
  })
  public userId: number;
}

export class NotificationInput {
  @ApiProperty({
    description: "The ID of the user sending the notification",
    example: 1,
    type: Number
  })
  public userId: number;

  @ApiProperty({
    description: "The message of the notification the president want to send to the members of the association",
    example: "This is a notification",
    type: String
  })
  public message: string;
}