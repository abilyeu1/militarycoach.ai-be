import { PipeTransform } from '@nestjs/common';
export declare class EnumValidationPipe implements PipeTransform<string, Promise<any>> {
    private enumEntity;
    constructor(enumEntity: any);
    transform(value: string): Promise<any>;
}
