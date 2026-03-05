'use client';

import ProfileImage from '@/components/ProfileImage';
import ProfileTable from '@/components/ProfileTable';
import type { IUser } from '@/lib/models/user';

interface AccountInformationProps {
  user: IUser;
}

export default function AccountInformation({ user }: AccountInformationProps) {
  const { name, email, lists, avatar } = user;

  return (
    <div className="account-box">
      <div className="profile-card">
        <div className="profile-top">
          <div className="profile-image">
            <ProfileImage avatar={avatar} />
          </div>
          <div className="profile-data">
            <p className="profile-item-name">Name:</p>
            <h1 className="profile-title">{name}</h1>
            <p className="profile-item-name">Email / Auth:</p>
            <h2 className="profile-auth">{email}</h2>
          </div>
        </div>
        <hr />
        <div className="profile-row">
          <ProfileTable lists={lists} />
        </div>
      </div>
    </div>
  );
}
