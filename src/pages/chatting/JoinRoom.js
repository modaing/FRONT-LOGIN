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

    const findUserPhoto = (receiverId) => {
        const memberPhoto = members.find(member => member.memberId === receiverId);
        const imageUrl = memberPhoto ? memberPhoto.imageUrl : null;
        return imageUrl;
    };

    return (
        <form onSubmit={handleNoteSubmit}>
            <label htmlFor="roomName" className="form-label">With Member ?</label>
            <select
                className="form-select"
                aria-label="Default select example"
                value={selectedMemberId}
                onChange={(e) => {
                    const [id, name] = e.target.value.split(' - ');
                    setSelectedMemberId(e.target.value);
                    setReceiveId(id);
                }}
            >
                <option key="" value="">받을 사원을 선택해주세요</option>
                {members.map((member) => (
                    <option key={member.id} value={`${member.memberId} - ${member.name}`}>
                        {`${member.memberId} - ${member.name}`}
                    </option>
                ))}
            </select>

            <div className="mb-3">
                <label htmlFor="roomName" className="form-label">Room Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="roomName"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
            </div>

            <div className="custom-btn">
                <CustomButton type="submit" />
            </div>
        </form>
    );
}

export default JoinRoom;
