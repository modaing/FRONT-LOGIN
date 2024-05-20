import React, { useState } from 'react';
import '../../css/chatting/deleteModal.css';

function DeleteRoomModal({ show, handleClose, handleConfirmDelete, handleCancelDelete }) {
  const [newRoomName, setNewRoomName] = useState('');
  const [selectedReceiver, setSelectedReceiver] = useState('');

  const handleRoomNameChange = (e) => {
    setNewRoomName(e.target.value);
  };

  const handleReceiverChange = (e) => {
    setSelectedReceiver(e.target.value);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 방을 만드는 로직 추가
    handleClose(); // 모달 닫기
  };

  return (
    <div className={`delete-modal ${show ? "show" : ""}`}>
      <div className="delete-modal-content">
        <div className='delete-modal-text'>
        <p>정말로 삭제하시겠습니까?</p>
        </div>
        <div className="button-container">
          <button className="cancel-button" onClick={handleCancelDelete}>취소</button>
          <button className="confirm-button" onClick={handleConfirmDelete}>확인</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteRoomModal;
