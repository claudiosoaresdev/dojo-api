import { NotificationsRepository } from 'src/domain/notifications/application/repositories/notifications.repository';
import { Notification } from 'src/domain/notifications/enterprise/entities/notification';

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = [];

  async findById(id: string) {
    const notification = this.items.find((item) => item.id.toString() === id);

    if (!notification) {
      return null;
    }

    return notification;
  }

  async create(notification: Notification) {
    this.items.push(notification);
  }

  async update(notification: Notification) {
    const itemIndex = this.items.findIndex(
      (item) => item.id === notification.id,
    );

    this.items[itemIndex] = notification;
  }
}
