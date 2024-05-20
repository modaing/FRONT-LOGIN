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
