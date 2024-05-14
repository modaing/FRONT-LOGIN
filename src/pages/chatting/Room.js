import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import '../../css/chat.css';

function Room() {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [memberId, setMemberId] = useState('');
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/wss/chatting');

        const client = new Client({
            webSocketFactory: () => socket,
            debug: (msg) => console.log(msg),
        });

        client.onConnect = () => {
            console.log('STOMP 클라이언트가 서버에 연결되었습니다.');
            setStompClient(client);

            sendMessageToEnteredRoom(client);

            const subscription = client.subscribe(`/sub/room/${roomId}`, Headers, message => {
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
                console.log('초기화됨 ㅋ');
            }
        };
    }, [roomId]);

    const sendMessageToEnteredRoom = (client) => {
        if (client !== null && client.connected) {
            const message = {
                senderId: memberId,
                message: `${memberId}님이 입장하셨습니다.`
            };
            client.publish({
                destination: `/pub/room/${roomId}/entered`,
                body: JSON.stringify(message),
            });
        } else {
            console.error('STOMP 클라이언트가 초기화되지 않았거나 연결되지 않았습니다.');
        }
    };

    const sendMessage = () => {
        if (inputValue.trim() !== '' && stompClient) {
            const message = {
                senderId: memberId,
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
                body: JSON.stringify({ senderId: memberId, message: `${memberId}님이 떠나셨습니다.` }),
            });
        } else {
            console.error('STOMP 클라이언트가 초기화되지 않았거나 연결되지 않았습니다.');
        }
    };

    const handleMemberIdChange = (e) => {
        setMemberId(e.target.value);
    };

    const handleJoinRoom = () => {
        if (memberId.trim() !== '') {
            navigate(`/room/${roomId}`);
        }
    };

    return (
        <div className="chat-room">
            <div className="chat-content">
            <ul>
                {messages.map((message, index) => (
                    <li key={index} className={message.senderId === memberId ? 'sent-message' : 'received-message'}>{message.message}</li>
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
                </div>
            </div>
        </div>

    );
}

export default Room;
