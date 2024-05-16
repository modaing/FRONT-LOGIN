import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../css/chatting/room.css';
import { Client } from '@stomp/stompjs';
import { decodeJwt } from '../../utils/tokenUtils';

function Room() {
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [stompClient, setStompClient] = useState(null);

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
                senderName: name, // 발신자의 이름 추가
                message: inputValue,
                isSent: true
            };
            stompClient.publish({ destination: `/sub/room/${roomId}`, body: JSON.stringify(message) });
            setInputValue('');
        }
    };

    const handleLeaveRoom = () => {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: `/pub/room/${roomId}/leave`,
                body: JSON.stringify({ senderId: name, message: `${name} 님이 떠나셨습니다.` }),
            });
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
                            <div className="message-info">
                                <img src={imageUrl} className="avatar" />
                                <span className="sender-name">{message.senderName}</span>
                            </div>
                            <span className="message-text">{message.message}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="send-area">
                <div className="message-input">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send</button>
                    <button onClick={handleLeaveRoom}>Leave Room</button>
                </div>
            </div>
        </div>
    );
}

export default Room;