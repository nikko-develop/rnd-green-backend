import { ExceptionCodes } from '@Libs/Exceptions';
import { ExceptionResponse } from '@Libs/Exceptions/Exception.response';

export class LoginUnauthorizedReposneDto extends ExceptionResponse({
	code: ExceptionCodes.Unauthorized,
	message: 'Логин или пароль не верные'
}) {}
