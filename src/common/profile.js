import React from 'react';
import { decodeJwt } from '../utils/tokenUtils';
import '../css/profile.css';

function Profile() {
    const token = window.localStorage.getItem("accessToken");
    const memberInfo = decodeJwt(token);
    const image = `/img/${memberInfo.imageUrl}`;
    console.log(memberInfo)

    return (
        <div className="main-profile">
            <div className="main-profile-picture">
                <img src={image} alt="프로필 이미지" />
            </div>
            <div className="main-profile-details">
                <p style={{ fontWeight: 'bold' }}>
                    <span style={{ fontSize: '19px' }}>{memberInfo.name}</span> (<span style={{ fontSize: '14px'}}>{memberInfo.positionName}</span>)
                </p>
                <p style={{ fontSize: '12px', color: '#B0C4DE' }}>- {memberInfo.departName}</p>
            </div>
        </div>
    );
}

export default Profile;
