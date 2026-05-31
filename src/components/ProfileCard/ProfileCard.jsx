import React from 'react';
import { formatDate } from '../../utils/formatters.js';
import './ProfileCard.css';

function ProfileCard({ user }) {
  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="profile-card">
      <div className="profile-card__avatar-wrapper">
        {user?.avatar ? (
          <img src={user.avatar} alt={user.fullName} className="profile-card__avatar" />
        ) : (
          <div className="profile-card__avatar-placeholder">
            <span>{initials}</span>
          </div>
        )}
      </div>
      <div className="profile-card__info">
        <h2 className="profile-card__name">{user?.fullName || 'User'}</h2>
        <p className="profile-card__email">{user?.email}</p>
        {user?.bio && <p className="profile-card__bio">{user.bio}</p>}
        <div className="profile-card__meta">
          {user?.phone && (
            <span className="profile-card__meta-item">
              📞 {user.phone}
            </span>
          )}
          {user?.joinDate && (
            <span className="profile-card__meta-item">
              📅 Joined {formatDate(user.joinDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
