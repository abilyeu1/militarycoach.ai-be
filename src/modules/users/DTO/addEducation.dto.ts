// Class Validator imports
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddEducationDto {
  @IsNotEmpty()
  @IsUUID('all')
  @Expose()
  _id: string = '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d';

  @IsNotEmpty()
  @IsString()
  @Expose()
  levelOfEducation: string = 'Bachelor';

  @IsNotEmpty()
  @IsString()
  @Expose()
  nameOfInstitution: string = 'University of California, Berkeley';

  @IsNotEmpty()
  @IsString()
  @Expose()
  degreeAndFieldOfStudy: string = 'B.S. Computer Science';

  @IsNotEmpty()
  @IsString()
  @Expose()
  Associates: string = 'B.S. Computer Science';
}
