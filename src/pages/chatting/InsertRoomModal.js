import React, { useState } from 'react';
import '../../css/chatting/insertRoom.css'

function InsertRoomModal({ show, handleClose }) {
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
    <div className={`modal ${show ? "show" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>&times;</span>
        <h2>방 만들기</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="roomName">방 이름:</label>
          <input type="text" id="roomName" value={newRoomName} onChange={handleRoomNameChange} />
          <label htmlFor="receiver">받는 사람:</label>
          <select id="receiver" value={selectedReceiver} onChange={handleReceiverChange}>
            <option value="">선택하세요</option>
            {/* 받는 사람 목록 옵션 추가 */}
          </select>
          <button type="submit">방 만들기</button>
        </form>
      </div>
    </div>
  );
}

export default InsertRoomModal;
