import React, { useState } from 'react';
import '../../css/note/noteDetail.css';
import SendNoteForm from './SendNoteForm';
import { callPostNoteAPI } from '../../apis/NoteAPICalls';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { decodeJwt } from '../../utils/tokenUtils';


const ResponseNoteModal = ({ note, onClose, showResponseButton = true }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');
    const [receiverId, setReceiverId] = useState(note.senderId);
    const token = window.localStorage.getItem("accessToken");
    const memberInfo = decodeJwt(token);
    const memberId = memberInfo.memberId;


    const dispatch = useDispatch();
    const navigate = useNavigate();
    const openForm = () => {
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
    };

    const handleNoteSubmit = () => {
        const noteDTO = {
            noteTitle: noteTitle,
            noteContent: noteContent,
            receiverId: receiverId,
            senderId: memberId
        };
        dispatch(callPostNoteAPI(noteDTO));
        onClose();
        navigate('/sendNoteList')
    };

    console.log(receiverId)

    return (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">답장</h5>
                    </div>
                    <div className="modal-body">
                    <div className="note-detail-item">
                                <div className="note-detail-label">보낸 사람:</div>
                                <div className="note-detail-value">{note.senderId}</div>
                            </div>
                        <div className="note-detail-item">
                            <div className="note-detail-label">제목:</div>
                            <input
                                type="text"
                                className="note-detail-value note-content-input"
                                value={noteTitle}
                                onChange={(e) => setNoteTitle(e.target.value)}
                                placeholder="답장 내용을 입력하세요"
                            />
                        </div>
                        <div className="note-detail-item">
                            <div className="note-detail-label">내용:</div>
                            <input
                                type="text"
                                className="note-detail-value note-content-input"
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                placeholder="답장 내용을 입력하세요"
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose} style={{ backgroundColor: '#ec76a2' }}>닫기</button>
                        {showResponseButton && (
                            <button type="button" className="btn btn-secondary" style={{ backgroundColor: '#112D4E', color: 'white', borderRadius: '5px' }} onClick={handleNoteSubmit}>답장</button>
                        )}
                    </div>
                </div>
            </div>
            {isFormOpen && <SendNoteForm closeForm={closeForm} isFormOpen={isFormOpen} senderId={note.receiverId} />}
        </div>
    );
}

export default ResponseNoteModal;
