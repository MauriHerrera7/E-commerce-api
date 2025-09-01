import { ApiHideProperty, PickType } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsString, Matches,MaxLength,MinLength, Validate } from "class-validator";
import { MatchPassword } from "src/helpers/MatchPassword";


export class CreateUserDto {
    
    /**
     *@description Esta propiedad debe ser el email del usuario
     *@example Superman@gmail.com
     */

    @IsNotEmpty()
    @IsEmail()
    email: string;

    /**
    * Debe ser un string con al menos 3 caracteres y no puede estar vacío
    * @example 'ClarKent'
    */

    @IsString()
    @MinLength(3)
    name: string;
    
    /**
    * Debe ser un string con al menos una letra mayúscula, una minúscula, un número y un caracter especial
    * @example 'Luisa123!'
    */

    @MinLength(8)
    @MaxLength(15)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/,{
        message:
            "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.",
    })
    password: string;
     
    /**
    * Debe ser un string con al menos una letra mayúscula, una minúscula, un número y un caracter especial
    * @example 'Luisa123!'
    */

    @Validate(MatchPassword, ['password'])
    confirmPassword: string;
    
    /**
    * Debe ser un string con al menos 3 caracteres y no puede estar vacío
    * @example 'smallville 123'
    */

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(80)
    address: string;
    
    /**
    * Debe ser un número y no puede estar vacío
    * @example 123456789
    */

    @IsNotEmpty()
    @IsNumber()
    phone: number;
    
    /**
    * Debe ser un string con al menos 5 caracteres y no puede estar vacío
    * @example 'Argentina'
    */

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    country?: string;


    /**
    * Debe ser un string con al menos 5 caracteres y no puede estar vacío
    * @example 'Mendoza City'
    */

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    city?: string;
    
    @ApiHideProperty()
    @IsEmpty()
    isAdmin?: boolean;
}

export class LoginDto extends PickType(CreateUserDto, ['email','password']){}
