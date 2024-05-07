import { ApiProperty } from "@nestjs/swagger";

export class UserPasswordChanging {
  @ApiProperty({
    description: "The current password of the user",
    example: "My current New P@ssw0rd",
    type: String
  })
  public currentPassword: string;

  @ApiProperty({
    description: "The new password of the user",
    example: "My New P@ssw0rd",
    type: String
  })
  public newPassword: string;
}
