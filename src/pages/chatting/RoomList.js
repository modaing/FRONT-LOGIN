import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRooms, leaveRoom, createRoom, memberList } from '../../apis/ChattingAPICalls';
import { callMemberListAPI } from '../../apis/ChattingAPICalls';
import { decodeJwt } from '../../utils/tokenUtils';
import '../../css/chatting/roomList.css';
import { Link } from 'react-router-dom';
import Room from './Room';
import InsertRoomModal from './InsertRoomModal'; // 모달창 컴포넌트 임포트

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
        const response = await fetchRooms(memberId);
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
                      <div className="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                      <div className="chat_ib">
                        {isLoadingRooms ? (
                          <p>Loading Rooms...</p>
                        ) : (
                          <ul>
                            {Array.isArray(rooms) && rooms.length > 0 ? (
                              rooms.map((room, index) => (
                                <li key={index} onClick={() => handleRoomClick(room.enteredRoomId)}>{room.roomName}</li>
                              ))
                            ) : (
                              <li>메시지가 없습니다</li>
                            )}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mesgs">
                <div className="msg_history">
                  {roomId && <Room roomId={roomId} />} {/* 클릭한 방의 ID를 props로 전달하여 Room 컴포넌트 렌더링 */}
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
