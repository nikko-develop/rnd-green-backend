import { LoggerService } from '@nestjs/common';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars */
export class DisabledLogger implements LoggerService {
  public log(message: any, ...optionalParams: any[]): any {}
  public error(message: any, ...optionalParams: any[]): any {}
  public warn(message: any, ...optionalParams: any[]): any {}
  public debug(message: any, ...optionalParams: any[]): any {}
}
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars */
