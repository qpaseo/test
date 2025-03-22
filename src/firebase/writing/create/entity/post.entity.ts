import { IsString, IsUrl, IsDate, IsNotEmpty } from 'class-validator';

export class PostEntity {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsUrl()
  imageUrl: string;

  @IsDate()
  createdAt: Date;
}
