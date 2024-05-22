import React, { useState, useEffect } from 'react';
import { callMemberListAPI, callInsertRoomAPI } from '../../apis/ChattingAPICalls';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import CustomButton from './CustomButton';
import '../../css/chatting/joinRoom.css';
import { decodeJwt } from '../../utils/tokenUtils';

function JoinRoom({ onRoomCreated }) {
    const [members, setMembers] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [receiveId, setReceiveId] = useState('');
    const [roomName, setRoomName] = useState('');
    const [selectedMember, setSelectedMember] = useState("");

    const memberInfo = decodeJwt(window.localStorage.getItem("accessToken"));
    const memberId = memberInfo.memberId;

    useEffect(() => {
        callMemberListAPI().then(response => {
            const responseData = response.data;
            setMembers(responseData);
        }).catch(error => {
            console.error('Error fetching receivers:', error);
        });
    }, []);

    const handleNoteSubmit = (e) => {
        e.preventDefault();
        const request = {
            memberId: memberId,
            roomName: roomName,
            receiverId: parseInt(receiveId),
        };
        dispatch(callInsertRoomAPI(request)).then(() => {
            // 새로운 방이 성공적으로 만들어지면 부모 컴포넌트에 알립니다.
            onRoomCreated();
        }).catch(error => {
            console.error('Error creating room:', error);
        });
        navigate('/chatRoomList');
    };

    const findUserName = (receiverId) => {
        // 멤버 리스트에서 receiverId와 동일한 memberId를 가진 멤버를 찾음
        const member = members.find(member => member.memberId === receiverId);
        // 해당 멤버가 존재하면 해당 멤버의 이름과 receiverId를 반환
        return member ? `${member.name} (${receiverId})` : null;
    };


    const handleSelect = (member) => {
        setSelectedMember(member.memberId);
        setReceiveId(member.memberId);
    };

    const findUserPhoto = (memberId, members) => {
        // memberId와 일치하는 멤버를 찾아서 그 멤버의 프로필 사진을 반환
        if (members && members.length > 0) {
            const member = members.find(member => member.memberId === memberId);
            return member ? `/img/${member.imageUrl}` : null;
        }
        return null;
    };

    return (
        <form onSubmit={handleNoteSubmit}>
            <div className="mb-3 room-name">
                <label htmlFor="roomName" className="form-label">Room Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="roomName"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
            </div>

            <div className='member-list-container'>
                <label htmlFor="selectedMember" className="form-label">대화할 상대를 선택해주세요</label>
                <ul className="member-list">
                    {members.map((member) => (
                        <li key={member.id}>
                            <span onClick={() => handleSelect(member)}>
                                <input
                                    type="radio"
                                    name="member"
                                    value={member.memberId}
                                    checked={selectedMember === member.memberId}
                                    readOnly
                                />
                                <img src={findUserPhoto(member.memberId, members)} alt="User Profile" className="user-photo" />
                                <span>{`${member.memberId} - ${member.name}`}</span>
                            </span>
                        </li>
                    ))}
                </ul>
                <p>Selected Member 확인용: {receiveId}</p>
            </div>



            <div className="custom-btn">
                <CustomButton type="submit" />
            </div>
        </form>
    );
}

export default JoinRoom;
