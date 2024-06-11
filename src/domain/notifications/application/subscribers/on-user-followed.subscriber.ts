import { DomainEvents } from 'src/core/events/domain-events';
import { EventHandler } from 'src/core/events/event-handler';

import { UserFollowedEvent } from 'src/domain/feed/enterprise/events/user-followed.event';
import { UsersRepository } from 'src/domain/users/application/repositories/users.repository';
import { SendNotificationUseCase } from 'src/domain/notifications/application/usecases/send-notification.usecase';

export class OnUserFollowed implements EventHandler {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  public setupSubscriptions(): void {
    DomainEvents.register(
      this.sendUserNewFollowerNotification.bind(this),
      UserFollowedEvent.name,
    );
  }

  private async sendUserNewFollowerNotification({
    followerRelationship,
  }: UserFollowedEvent) {
    const following = await this.usersRepository.findById(
      followerRelationship.followingId.toValue(),
    );

    if (following) {
      await this.sendNotificationUseCase.execute({
        recipientId: following.id.toValue(),
        title: `${followerRelationship.followerId} começou a seguir você`,
      });
    }
  }
}
