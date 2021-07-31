import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ActionPipe implements PipeTransform {
  transform(value: any) {
    return value;
  }
}
