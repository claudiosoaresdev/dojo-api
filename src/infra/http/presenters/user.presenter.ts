import { User } from 'src/domain/users/enterprise/entities/user';

export interface UserPresenterResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  coverPhotoUrl?: string;
  profilePictureUrl?: string;
  followersCount: number;
  followingCount: number;
}

export class UserPresenter {
  static toHTTP(user: User): UserPresenterResponse {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      bio: user.bio,
      coverPhotoUrl: user.coverPhotoUrl,
      profilePictureUrl: user.profilePictureUrl,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
    };
  }
}
