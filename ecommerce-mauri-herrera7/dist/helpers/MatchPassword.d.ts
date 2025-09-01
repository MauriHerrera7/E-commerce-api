import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
export declare class MatchPassword implements ValidatorConstraintInterface {
    validate(password: string, args: ValidationArguments): boolean;
    defaultMessage(): string;
}
