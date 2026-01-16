import { ApiProperty } from "@nestjs/swagger";

export class ParseCvDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}