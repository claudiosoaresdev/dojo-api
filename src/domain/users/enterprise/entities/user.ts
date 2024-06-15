import { Entity } from 'src/core/entities/entity';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { Optional } from 'src/core/types/optional';

import { FollowerRelationship } from 'src/domain/users/enterprise/entities/follower-relationship';
import { FriendshipRelationship } from 'src/domain/users/enterprise/entities/friendship-relationship';

export interface UserProps {
  firstName: string;
  lastName: string;
  bio?: string;
  profilePictureUrl?: string;
  coverPhotoUrl?: string;
  email: string;
  isEmailVerified?: boolean;
  password?: string;
  followersCount: number;
  followingCount: number;
  followers?: FollowerRelationship[];
  followings?: FollowerRelationship[];
  initiatedFriends?: FriendshipRelationship[];
  acceptedFriends?: FriendshipRelationship[];
  createdAt: Date;
  updatedAt?: Date | null;
}

export class User extends Entity<UserProps> {
  get firstName(): string {
    return this.props.firstName;
  }

  set firstName(firstName: string) {
    this.props.firstName = firstName;
    this.touch();
  }

  get lastName(): string {
    return this.props.lastName;
  }

  set lastName(lastName: string) {
    this.props.lastName = lastName;
    this.touch();
  }

  get bio(): string | undefined {
    return this.props.bio;
  }

  set bio(bio: string) {
    this.props.bio = bio;
    this.touch();
  }

  get profilePictureUrl(): string | undefined {
    return this.props.profilePictureUrl;
  }

  set profilePictureUrl(profilePictureUrl: string) {
    this.props.profilePictureUrl = profilePictureUrl;
    this.touch();
  }

  get coverPhotoUrl(): string | undefined {
    return this.props.coverPhotoUrl;
  }

  set coverPhotoUrl(coverPhotoUrl: string) {
    this.props.coverPhotoUrl = coverPhotoUrl;
    this.touch();
  }

  get email(): string {
    return this.props.email;
  }

  set email(email: string) {
    this.props.email = email;
    this.touch();
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }

  set isEmailVerified(isEmailVerified: boolean) {
    this.props.isEmailVerified = isEmailVerified;
    this.touch();
  }

  get password(): string | undefined {
    return this.props.password;
  }

  set password(password: string | undefined) {
    this.props.password = password;
    this.touch();
  }

  get followersCount(): number {
    return this.props.followersCount;
  }

  set followersCount(followersCount: number) {
    this.props.followersCount = followersCount;
    this.touch();
  }

  get followingCount(): number {
    return this.props.followingCount;
  }

  set followingCount(followingCount: number) {
    this.props.followingCount = followingCount;
    this.touch();
  }

  get followers(): FollowerRelationship[] | undefined {
    return this.props.followers;
  }

  get followings(): FollowerRelationship[] | undefined {
    return this.props.followings;
  }

  get initiatedFriends(): FriendshipRelationship[] | undefined {
    return this.props.initiatedFriends;
  }

  get acceptedFriends(): FriendshipRelationship[] | undefined {
    return this.props.acceptedFriends;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<
      UserProps,
      | 'bio'
      | 'profilePictureUrl'
      | 'followersCount'
      | 'followingCount'
      | 'followers'
      | 'followings'
      | 'initiatedFriends'
      | 'acceptedFriends'
      | 'createdAt'
    >,
    id?: UniqueEntityID,
  ): User {
    const user = new User(
      {
        ...props,
        bio: props.bio ?? undefined,
        profilePictureUrl: props.profilePictureUrl ?? undefined,
        coverPhotoUrl: props.coverPhotoUrl ?? undefined,
        followersCount: props.followersCount ?? 0,
        followingCount: props.followingCount ?? 0,
        followers: props.followers ?? [],
        followings: props.followings ?? [],
        initiatedFriends: props.initiatedFriends ?? [],
        acceptedFriends: props.acceptedFriends ?? [],
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return user;
  }
}
