import React, { useState, useEffect } from 'react';
import '../../css/note/sendNoteForm.css';
import { useDispatch } from 'react-redux';
import { decodeJwt } from '../../utils/tokenUtils';
import { callPostNoteAPI } from '../../apis/NoteAPICalls';
import { callMemberListAPI } from '../../apis/ChattingAPICalls';
import { useNavigate } from 'react-router-dom';

function SendNoteForm({ closeForm, isFormOpen }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const token = window.localStorage.getItem("accessToken");
    const memberInfo = decodeJwt(token);
    const memberId = memberInfo.memberId;
    const [selectedReceiverId, setSelectedReceiverId] = useState('');
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [receiveId, setReceiveId] = useState('');
    const [members, setMembers] = useState([]);
    const senderId = memberId;

    useEffect(() => {
        // 컴포넌트가 처음 렌더링될 때 한 번만 호출되도록 함
        callMemberListAPI().then(response => {
            const responseData = response.data;
            setMembers(responseData);
        }).catch(error => {
            console.error('Error fetching receivers:', error);
        });
    }, []); // 빈 배열을 전달하여 컴포넌트가 처음 렌더링될 때만 호출되도록 함

    const handleNoteSubmit = () => {
        const noteDTO = {
            noteTitle: noteTitle,
            noteContent: noteContent,
            receiverId: receiveId,
            senderId: senderId
        };
        dispatch(callPostNoteAPI(noteDTO));
        navigate('/receiveNoteList'); // 보낸쪽지 상세로 이동하도록 바꿀 예정
    };

    const handleReceiverChange = (event) => {
        setSelectedReceiverId(event.target.value);
    };

    return (
        <div className={`send-note-modal-content ${isFormOpen ? 'modal-open' : ''}`}>
            {isFormOpen && (
                <div className="send-note-modal-card">
                    <div className="send-note-modal-card-header"></div>
                    <div className="send-note-modal-card-body">
                        <h5 className="send-note-modal-card-text">제목</h5>
                        <input
                            type="text"
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                            className="note-input"
                        />
                        <h5 className="send-note-modal-card-text">수신인</h5>
                        <div className="select-wrapper">
                            <select
                                value={selectedReceiverId}
                                onChange={(e) => {
                                    setSelectedReceiverId(e.target.value);
                                    setReceiveId(e.target.value.split(' ')[0]); // 선택된 멤버의 memberId를 receiverId에 설정
                                }}
                            >
                                <option key="" value={receiveId} >받을 사원을 선택해주세요</option>
                                {members.map((member, index) => (
                                    <option key={member.id} value={`${member.memberId} - ${member.name}`}>
                                        {`${member.memberId} - ${member.name}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <h5 className="send-note-modal-card-text">내용</h5>
                        <textarea
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="내용을 입력하세요"
                            className="note-textarea"
                        ></textarea>
                        <button className="send-note-modal-close" onClick={closeForm}>취소</button>
                        <button className="send-note-modal-submit" onClick={handleNoteSubmit}>전송</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SendNoteForm;
