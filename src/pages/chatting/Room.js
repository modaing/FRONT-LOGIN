import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import '../../css/chatting/room.css';
import { Client } from '@stomp/stompjs';
import { decodeJwt } from '../../utils/tokenUtils';
import { callMemberListAPI, callPostMessages, callGetMessages  } from '../../apis/ChattingAPICalls';

function Room({ roomId, onLeaveRoom , senderDeleteYn, receiverDeleteYn}) {
    const dispatch = useDispatch();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [roomLeft, setRoomLeft] = useState(false);
    const [members, setMembers] = useState([]);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    const token = `Authorization:` + 'BEARER' + window.localStorage.getItem("accessToken");
    const decodedTokenInfo = decodeJwt(window.localStorage.getItem("accessToken"));
    const memberId = decodedTokenInfo.memberId;
    const name = decodedTokenInfo.name;
    const imageUrl = decodedTokenInfo.imageUrl;

    const isRoomDeleted = senderDeleteYn === 'Y' || receiverDeleteYn === 'Y';

    useEffect(() => {
        callMemberListAPI().then(response => {
            const responseData = response.data;
            setMembers(responseData);
        }).catch(error => {
            console.error('Error fetching receivers:', error);
        });
    
        // 방에 들어갈 때 메시지들을 불러옴
        const fetchMessages = async () => {
            try {
                const getMessagesResponse = await dispatch(callGetMessages(roomId));
                setMessages(getMessagesResponse.data); // API 호출 결과를 상태에 저장
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
    
        fetchMessages(); // 함수 호출
    
    }, [dispatch, roomId]); // roomId가 바뀔 때마다 실행

    useEffect(() => {
        const socket = new WebSocket(`ws://localhost:8080/wss/chatting`);

        const client = new Client({
            webSocketFactory: () => socket,
            debug: (msg) => console.log(msg),
            token: token
        });

        client.onConnect = () => {
            console.log('STOMP client connected to the server.');
            setStompClient(client);

            /* sendMessageToEnteredRoom(client);  입장 시 자동 메시지 제거 */

            const subscription = client.subscribe(`/sub/room/${roomId}`, message => {
                console.log('Received message:', message.body);
                try {
                    const newMessage = JSON.parse(message.body);
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                    scrollToBottom(); // Scroll to bottom when new message arrives
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            });
        };

        client.activate();

        return () => {
            if (client && client.connected) {
                client.deactivate();
                console.log('Deactivated.');
            }
        };
    }, [roomId]);

    useEffect(() => {
        scrollToBottom(); // Scroll to bottom when messages update
    }, [messages]);

    const scrollToBottom = () => {
        const chatContent = document.querySelector('.chat-content');
        chatContent.scrollTop = chatContent.scrollHeight;
    };

    const sendMessageToEnteredRoom = (client) => {
        if (client !== null && client.connected) {
            const message = {
                senderId: memberId,
                senderName: name,
                message: `${name} 님이 입장하셨습니다.`,
            };
            client.publish({
                destination: `/pub/room/${roomId}/entered`,
                body: JSON.stringify(message),
            });
        } else {
            console.error('STOMP client is not initialized or connected.');
        }
    };

    const sendMessage = async () => {
        try {
            if (inputValue.trim() !== '' && stompClient) {
                const message = {
                    senderId: memberId,
                    senderName: name,
                    message: inputValue,
                    isSent: true
                };
                // WebSocket을 통해 메시지 전송
                stompClient.publish({ destination: `/sub/room/${roomId}`, body: JSON.stringify(message) });

                // API 호출 액션 디스패치
                const messageDTO = {
                    message: inputValue,
                    senderId: memberId,
                    senderName: name,
                    enteredRoomId: roomId
                };
                await dispatch(callPostMessages(messageDTO));

                // 입력값 초기화
                setInputValue('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };


    const handleLeaveRoom = () => {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: `/pub/room/${roomId}/leave`,
                body: JSON.stringify({ senderId: name, message: `${name} 님이 떠나셨습니다.` }),
            });
            setRoomLeft(true);
            if (onLeaveRoom) {
                onLeaveRoom(); // Notify parent component that the user has left the room
            }
        } else {
            console.error('STOMP client is not initialized or connected.');
        }
    };

    const findUserPhoto = (receiverId, message) => {
        // 자동 메시지 여부 확인
        const isAutoMessage = message && message.message && (message.message.includes('님이 입장하셨습니다') || message.message.includes('님이 퇴장하셨습니다'));

        if (!isAutoMessage) {
            const memberPhoto = members.find(member => member.memberId === receiverId);
            let imageUrl = null;

            if (memberPhoto) {
                imageUrl = `/img/${memberPhoto.imageUrl}`;
            } else {
                imageUrl = '/img/gpt.jpg'; 
            }

            console.log(imageUrl);
            return imageUrl;
        } else {
            return '/img/gpt.jpg'; 
        }
    };

    return (
        <div className="chat-room">
            <div className="chat-content">
                <ul>
                    {messages.map((message, index) => (
                        <li style={{ listStyle: 'none' }} key={index} className={message.senderId === memberId ? 'sent-message' : 'received-message'}>
                            <img src={findUserPhoto(message.senderId, message)} className="avatar-room" style={{ marginRight: "10PX" }} />
                            <span className="sender-name">{message.senderName}</span>
                            <div className="message-info"></div>
                            <span className="message-text">{message.message}</span>
                        </li>
                    ))}
                    <div ref={messagesEndRef} />
                </ul>
            </div>
            
            <div className="send-area">
                <div className="message-input">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage();
                            }
                        }}
                        disabled={isRoomDeleted}
                        placeholder={isRoomDeleted ? "상대방이 퇴장하였습니다." : "메시지를 입력해주세요"}
                    />
                    <button className='button-post' onClick={sendMessage} >Send</button>
                    <button className='button-leave' onClick={handleLeaveRoom}>Leave Room</button>
                </div>
            </div>
        </div>
    );
}

export default Room;
