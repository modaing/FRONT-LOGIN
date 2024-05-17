import React, { useState } from 'react';
import '../../css/note/noteDetail.css';
import ResponseNoteModal from './ResponseNoteModal';

const NoteDetail = ({ note, onClose, showResponseButton, isSentNote  }) => {
    const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);

    const openResponseModal = () => {
        setIsResponseModalOpen(true);
    };

    const closeResponseModal = () => {
        setIsResponseModalOpen(false);
    };

    return (
        <>
            <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">✉️쪽지✉️</h5>
                        </div>
                        <div className="modal-body">
                        <div className="note-detail-item">
                                <div className="note-detail-label">{isSentNote ? '받는 사람:' : '보낸 사람:'}</div>
                                <div className="note-detail-value">{isSentNote ? note.receiverId : note.senderId}</div>
                            </div>
                            <div className="note-detail-item">
                                <div className="note-detail-label">제목:</div>
                                <div className="note-detail-value">{note.noteTitle}</div>
                            </div>
                            <div className="note-detail-item">
                                <div className="note-detail-label">보낸 날짜:</div>
                                <div className="note-detail-value">{note.sendNoteDate}</div>
                            </div>
                            <div className="note-detail-item"> 
                                <div className="note-detail-label">내용:</div>
                                <div className="note-detail-value note-content">{note.noteContent}</div> 
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ backgroundColor: '#ec76a2'}}>닫기</button>
                            {showResponseButton && (
                                <button type="button" className="btn btn-secondary" style={{ backgroundColor: '#112D4E', color: 'white', borderRadius: '5px'}} onClick={openResponseModal}>답장</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isResponseModalOpen && <ResponseNoteModal note={note} onClose={closeResponseModal} />}
        </>
    );
}

export default NoteDetail;
