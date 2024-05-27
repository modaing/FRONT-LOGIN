import Modal from './Modal'; 
import ModalID from './ModalID';
import ModalPassword from './ModalPassword';
import LoginCSS from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { callLoginAPI } from '../../apis/MemberAPICalls';
import "../../css/member/login.css";
function Login() {

    // const { login } = useContext(LoginContext)
    const [form, setForm] = useState({
        memberId: '',
        password: ''
    });
    const loginMember = useSelector(state => state.memberReducer);
    const loginButtonRef = useRef(null); 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    /* 모달창 invinsible at the start */
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isIDModalVisible, setIsIDModalVisible] = useState(false);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);


    useEffect(() => {
        
        if(loginMember.status === 200){
            console.log("[Login] Login SUCCESS {}", loginMember);
            navigate("/", { replace: true });
        }
    }
    ,[loginMember, navigate]);

    /* enter key 누르면 login click 동작 */
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Enter') {
                loginButtonRef.current.click();
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [loginMember]);

    /* 모달창 */
    const handleFindIDClick = () => {
        setIsIDModalVisible(true);
    };

    const handleFindPasswordClick = () => {
        setIsPasswordModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setIsIDModalVisible(false);
        setIsPasswordModalVisible(false);
    };

    const onChangeHandler = (e) => {
        setForm((prevForm) => ({
            ...prevForm,
            [e.target.name]: e.target.value
        }));
    };

    const isValidMemberId = (memberId) => {
        // Check if memberId is a valid integer and within the acceptable range
        const intValue = parseInt(memberId);
        return !isNaN(intValue) && intValue >= -2147483648 && intValue <= 2147483647;
    };
    
    // const memberIdInt = parseInt(form.memberId);
    const onClickLoginHandler = async () => {

        if (!isValidMemberId(form.memberId)) {
            alert("Enter a valid memberId");
            setForm({memberId: '', password: ''});
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    memberId: parseInt(form.memberId),
                    password: form.password
                }),
            });
            
            const responseData = await response.json();
            if (response.ok) {

                /* 로그인 실패시 */
                if (responseData.failType != null) {
                    alert(responseData.failType);
                    setForm({memberId: '', password: ''});
                } else {
                    /* 로그인 성공시 */
                    console.log('responseData:',responseData);
                    const token = responseData.token;
                    localStorage.setItem('accessToken', token); // Store the token in localStorage for future use
                    // console.log("token 정보:",token);
                    
                    // Navigate to the home page if login is successful
                    navigate("/main", { replace:true});
                }
            }
                
            else if (response.status === 401) {
                // Display an alert if login fails due to unauthorized access
                alert('로그인 중에 오류가 발생했습니다. 다시 시도해주세요.');
                setForm({ memberId: '', password: '' });
            }
        } catch (error) {
            // Handle any errors that occur during login
            console.log('Error during login:', error);
        }
    };

    // 1. 로그인 Button을 누르면 onSubmit event가 동작을 하면서 onLogin method를 호출하고
    return (
        <div className={LoginCSS.formContainerStyle}>
            <img src="img/logo.png" className={LoginCSS.imageStyle} alt="Logo" />
            <div className='classifyStyle'>
                {/* <form> */}
                <input type="number" name="memberId" placeholder="아이디" autoComplete='off' onChange={onChangeHandler} className="inputStyleLogin inputBoxStyle" />
                    <br /><br />
                <input type="password" name="password" placeholder="비밀번호" autoComplete='off' onChange={onChangeHandler} className="inputStyleLogin inputBoxStyle" />
                <div className={LoginCSS.linkContainerStyle}>
                    <p className="linkStyle" onClick={handleFindIDClick}>아이디 찾기</p>
                    <p className="linkStyle" onClick={handleFindPasswordClick}>비밀번호 찾기</p>
                </div>
                <button type='submit' ref={loginButtonRef} className="loginButtonStyle" onClick={onClickLoginHandler}>로그인</button>
                {/* <button type='submit' ref={loginButtonRef} className={LoginCSS.loginButtonStyle}>로그인</button> */}
            </div>
            <Modal visible={isModalVisible} onClose={handleCloseModal} />
            <ModalID visible={isIDModalVisible} onClose={handleCloseModal} />
            <ModalPassword visible={isPasswordModalVisible} onClose={handleCloseModal} />
        </div>
    );
}

export default Login;