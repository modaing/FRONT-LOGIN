import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { callCahttingAPI, leaveRoom } from '../../apis/ChattingAPICalls';
import { callMemberListAPI } from '../../apis/ChattingAPICalls';
import { decodeJwt } from '../../utils/tokenUtils';
import '../../css/chatting/roomList.css';
import Room from './Room';
import InsertRoomModal from './InsertRoomModal'; // 모달창 컴포넌트 임포트
import JoinRoom from './JoinRoom';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [receivers, setReceivers] = useState([]); // 받는 사람 목록
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 띄우는 상태
  const history = useNavigate();

  const token = window.localStorage.getItem("accessToken");
  const memberInfo = decodeJwt(token);
  const profilePic = memberInfo.imageUrl;
  const memberId = memberInfo.memberId;
  const [roomId, setRoomId] = useState(null); // 클릭한 방의 ID를 상태로 관리
  const [enteredRooms, setEnteredRooms] = useState(null); // 클릭한 방의 ID를 상태로 관리


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
  }, []);

  const handleRoomClick = (roomId) => {
    setRoomId(roomId); // 클릭한 방의 ID 설정
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom(); // 방을 나가는 API 호출
      // 방을 나갔을 때 방 목록을 다시 가져옵니다.
      const updatedRooms = await callCahttingAPI(memberId);
      setRooms(updatedRooms);
      setRoomId(null); // 방을 나가면 roomId를 null로 설정합니다.
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
  

  return (
    <main id="main" className="main">
      <div className="pagetitle">
        <h1>채팅</h1>
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item">채팅</li>
            <button onClick={() => setIsModalOpen(true)} style={{ backgroundColor: '#112D4E', color: 'white', borderRadius: '10px', padding: '1% 2%', cursor: 'pointer', marginLeft: '76%', textDecoration: 'none' }}>방 만들기</button>
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
                  {/* 여기에 3개짜리 점 삭제버튼 만들기 */}
                </div>

                <div className="inbox_chat">
                  <div className="chat_list active_chat">
                    <div className="chat_people">
                      {Array.isArray(rooms) && rooms.length > 0 ? (
                        rooms.map((room, index) => (
                          <div key={index} onClick={() => handleRoomClick(room.enteredRoomId)} className="chat_room">
                            <div className="chat_img">
                              <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" />
                            </div>
                            <div className="chat_ib">
                              <h5>{room.roomName}</h5>
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
                  {roomId ? (
                    <Room roomId={roomId} onLeaveRoom={handleLeaveRoom} />
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
