import { MockInstance } from 'vitest';

import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from 'src/domain/notifications/application/usecases/send-notification.usecase';
import { OnUserFollowed } from 'src/domain/notifications/application/subscribers/on-user-followed.subscriber';

import { makeUser } from 'test/factories/make-user';
import { makeFollowerRelationship } from 'test/factories/make-follower-relationship';
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository';
import { InMemoryFollowerRelationshipsRepository } from 'test/repositories/in-memory-follower-relationships-repository';
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository';
import { waitFor } from 'test/utils/wait-for';

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryFollowerRelationshipsRepository: InMemoryFollowerRelationshipsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe('On User Followed', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryFollowerRelationshipsRepository =
      new InMemoryFollowerRelationshipsRepository(inMemoryUsersRepository);
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnUserFollowed(inMemoryUsersRepository, sendNotificationUseCase);
  });

  it('should send a notification when an user is followed', async () => {
    const follower = makeUser({}, new UniqueEntityID('follower-1'));
    const following = makeUser({}, new UniqueEntityID('following-1'));

    inMemoryUsersRepository.items.push(follower);
    inMemoryUsersRepository.items.push(following);

    const followerRelationship = makeFollowerRelationship({
      followerId: follower.id,
      follower: follower,
      followingId: following.id,
      following: following,
    });

    await inMemoryFollowerRelationshipsRepository.create(followerRelationship);

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled();
    });
  });
});
