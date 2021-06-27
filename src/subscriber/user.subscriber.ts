import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { User } from '../entity/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeUpdate(event: UpdateEvent<User>): Promise<any> {
    console.log('update');
    const passwordChange = event.updatedColumns.find(
      (col) => col.propertyName === 'password',
    );
    if (passwordChange) {
      event.entity.password = await User.hashPassword(
        passwordChange.getEntityValue(event.entity) as string,
      );
    }
  }
}
