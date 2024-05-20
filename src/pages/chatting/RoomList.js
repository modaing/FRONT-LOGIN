import React, { useState, useEffect, useRef } from 'react';
import { callCahttingAPI, leaveRoom, callDeleteRoomAPI } from '../../apis/ChattingAPICalls';
import { callMemberListAPI } from '../../apis/ChattingAPICalls';
import { useDispatch, useSelector } from 'react-redux';
import { decodeJwt } from '../../utils/tokenUtils';
import '../../css/chatting/roomList.css';
import '../../css/chatting/customDropdown.css';
import Room from './Room';
import InsertRoomModal from './InsertRoomModal'; // 모달창 컴포넌트 임포트
import JoinRoom from './JoinRoom';

function RoomList() {
  const dispatch = useDispatch();
  const [rooms, setRooms] = useState([]);
  const [setIsLoadingRooms] = useState(true);
  const [setReceivers] = useState([]); // 받는 사람 목록
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 띄우는 상태
  const [showDropdown, setShowDropdown] = useState(null); // 드롭다운 메뉴 상태
  const dropdownRef = useRef(null);
  const [activeRoomId, setActiveRoomId] = useState(null); // 활성화된 방의 ID를 상태로 관리

  const token = window.localStorage.getItem("accessToken");
  const memberInfo = decodeJwt(token);
  const memberId = memberInfo.memberId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await callCahttingAPI(memberId);
        console.log(response); // 방 정보 확인
        setRooms(response);
        setIsLoadingRooms(false);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchData();

    // 받는 사람 목록을 가져오는 함수 호출
    callMemberListAPI().then(response => {
      const responseData = response.data;
      setReceivers(responseData);
    }).catch(error => {
      console.error('Error fetching receivers:', error);
    });

    return () => { };
  }, [memberId, setIsLoadingRooms, setReceivers]);

  const handleRoomClick = (roomId) => {
    setActiveRoomId(roomId); // 클릭한 방의 ID로 활성화된 방 설정
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom(); // 방을 나가는 API 호출
      // 방을 나갔을 때 방 목록을 다시 가져옵니다.
      const updatedRooms = await callCahttingAPI(memberId);
      setRooms(updatedRooms);
      setActiveRoomId(null); // 방을 나가면 활성화된 방 ID를 null로 설정합니다.
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const handleInsertRoom = async () => {
    try {
      const updatedRooms = await callCahttingAPI(memberId);
      setRooms(updatedRooms);
    } catch (error) {
      console.error('Error update room:', error);
    }
  };

  const handleDeleteRoom = async (enteredRoomId) => {
    try {
      await dispatch(callDeleteRoomAPI(enteredRoomId));
      console.log(`Deleting room with ID: ${enteredRoomId}`);
      if (activeRoomId === enteredRoomId) {
        await handleLeaveRoom();
      }
      // 방 삭제 후 방 목록을 다시 가져옵니다.
      const updatedRooms = await callCahttingAPI(memberId);
      setRooms(updatedRooms);
      setShowDropdown(null); // 드롭다운 메뉴 닫기
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleToggleDropdown = (index, event) => {
    event.stopPropagation(); // 이벤트 버블링 중지
    setShowDropdown(showDropdown === index ? null : index); // 드롭다운 메뉴 토글
  };

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>채팅</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item">채팅</li>
          </ol>
        </nav>
      </div>
      <div className="col-lg-12">
        <div className="container">
          <div className="messaging">
            <div className="inbox_msg">
              <div className="inbox_people">
                <div className="headind_srch">
                  <div className="recent_heading">
                    <h4>Chatting</h4>
                  </div>
                </div>

                <div className="inbox_chat">
                  <div className="chat_list active_chat">
                    <div className="chat_people">
                      {Array.isArray(rooms) && rooms.length > 0 ? (
                        rooms.map((room, index) => (
                          <div
                            key={index}
                            className={`chat_room ${room.enteredRoomId === activeRoomId ? 'active' : ''}`}
                            onClick={() => !activeRoomId && handleRoomClick(room.enteredRoomId)}
                          >
                            <div className="chat_room_info">
                              <div className="chat_img">
                                <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" />
                              </div>
                              <div className="chat_ib">
                                <h5>{room.roomName}</h5>
                              </div>
                            </div>
                            <div className="custom-dropdown" ref={dropdownRef} onMouseLeave={() => setShowDropdown(null)}>
                              <button onClick={(event) => handleToggleDropdown(index, event)} className="custom-dropbtn">⋮</button>
                              {showDropdown === index && (
                                <div className="custom-dropdown-content custom-show" onClick={(e) => e.stopPropagation()}>
                                  <span onClick={() => handleDeleteRoom(room.enteredRoomId)}>삭제</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>메시지가 없습니다</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mesgs">
                <div className="msg_history">
                  {activeRoomId ? (
                    <Room roomId={activeRoomId} onLeaveRoom={handleLeaveRoom} />
                  ) : (
                    <div>
                      <JoinRoom onRoomCreated={handleInsertRoom} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 모달창 */}
      <InsertRoomModal
        show={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

export default RoomList;
