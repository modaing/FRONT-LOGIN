import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/chatting/room.css';
import { Client } from '@stomp/stompjs';
import { decodeJwt } from '../../utils/tokenUtils';
import { callMemberListAPI } from '../../apis/ChattingAPICalls';

function Room({ onLeaveRoom }) {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [roomLeft, setRoomLeft] = useState(false);
    const [members, setMembers] = useState([]);

    // Ref to the scrollable container
    const messagesEndRef = useRef(null);

    const token = `Authorization:` + 'BEARER' + window.localStorage.getItem("accessToken");
    const decodedTokenInfo = decodeJwt(window.localStorage.getItem("accessToken"));
    const memberId = decodedTokenInfo.memberId;
    const name = decodedTokenInfo.name;
    const imageUrl = decodedTokenInfo.imageUrl;

    useEffect(() => {
        callMemberListAPI().then(response => {
            const responseData = response.data;
            setMembers(responseData);
        }).catch(error => {
            console.error('Error fetching receivers:', error);
        });
    }, []);

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

            sendMessageToEnteredRoom(client);

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
                message: `${name} 님이 입장하셨습니다.`
            };
            client.publish({
                destination: `/pub/room/${roomId}/entered`,
                body: JSON.stringify(message),
            });
        } else {
            console.error('STOMP client is not initialized or connected.');
        }
    };

    const sendMessage = () => {
        if (inputValue.trim() !== '' && stompClient) {
            const message = {
                senderId: memberId,
                senderName: name,
                message: inputValue,
                isSent: true
            };
            stompClient.publish({ destination: `/sub/room/${roomId}`, body: JSON.stringify(message) });
            setInputValue(''); // Clear input after sending message
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
                imageUrl = '/img/gpt.jpg'; // 기본 이미지 경로를 사용자가 원하는 이미지로 수정하세요.
            }
    
            console.log(imageUrl);
            return imageUrl;
        } else {
            return null; // 자동 메시지인 경우 이미지를 반환하지 않음
        }
    };
    
    return (
        <div className="chat-room">
            <div className="chat-content">
                <ul>
                    {messages.map((message, index) => (
                        
                        <li style={{ listStyle: 'none' }} key={index} className={message.senderId === memberId ? 'sent-message' : 'received-message'}>
                            <img src={findUserPhoto(message.senderId, memberId, [], null)} className="avatar-room" style={{marginRight: "10PX"}}/>
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
                    />
                    <button onClick={sendMessage}>Send</button>
                    <button className='button-leave' onClick={handleLeaveRoom}>Leave Room</button>
                </div>
            </div>
        </div>
    );
}

export default Room;
