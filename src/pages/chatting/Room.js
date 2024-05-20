import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/chatting/room.css';
import { Client } from '@stomp/stompjs';
import { decodeJwt } from '../../utils/tokenUtils';

function Room({ onLeaveRoom }) {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const [roomLeft, setRoomLeft] = useState(false);
    const navigate = useNavigate();

    // Ref to the scrollable container
    const messagesEndRef = useRef(null);

    const token = `Authorization:` + 'BEARER' + window.localStorage.getItem("accessToken");
    const decodedTokenInfo = decodeJwt(window.localStorage.getItem("accessToken"));
    const memberId = decodedTokenInfo.memberId;
    const name = decodedTokenInfo.name;
    const imageUrl = decodedTokenInfo.imageUrl;

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

    return (
        <div className="chat-room">
            <div className="chat-content">
                <ul>
                    {messages.map((message, index) => (
                        <li style={{ listStyle: 'none' }} key={index} className={message.senderId === memberId ? 'sent-message' : 'received-message'}>
                            <img src={imageUrl} className="avatar-room" />
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
