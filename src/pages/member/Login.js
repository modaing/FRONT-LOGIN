import Modal from './Modal'; 
import ModalID from './ModalID';
import ModalPassword from './ModalPassword';
import LoginCSS from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { callLoginAPI } from '../../apis/MemberAPICalls';
import "../../css/member/login.css";
function Login({ onLogin }) {

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
            onLogin();
            navigate("/", { replace: true });
        }
    }
    ,[loginMember, navigate, onLogin]);

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
        const intValue = parseInt(memberId);
        return !isNaN(intValue) && intValue >= -2147483648 && intValue <= 2147483647;
    };
    
    // const memberIdInt = parseInt(form.memberId);
    const onClickLoginHandler = async () => {
        const { memberId, password } = form;

        if (memberId.trim() === '' || password.trim() === '') {
            alert('아이디 또는 비밀번호를 입력하세요.');
            // setForm({memberId: '', password: ''});
            return;
        }

        if (!isValidMemberId(memberId)) {
            alert('유효한 아이디를 입력하세요');
            // setForm({memberId: '', password: ''});
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    memberId: parseInt(memberId),
                    password: password
                }),
            });
            console.log('response:',response);
            
            const responseData = await response.json();
            // console.log('responseData:',responseData);
            if (response.ok) {

                if (responseData.message === '로그인 성공입니다.') {
                    const token = responseData.token;
                    localStorage.setItem('accessToken',token);
                    console.log('메인 페이지로 이동');
                    navigate("/main", { replace:true });
                    // window.location.reload();
                } else if (responseData.failType != null) {
                    alert(responseData.failType);
                    setForm({memberId: '', password: ''});
                } else if (responseData.message === '휴먼 상태의 계정입니다') {
                    alert('휴먼 계정입니다. 사용이 불가능합니다');
                    setForm({memberId: '', password: ''});
                } else {
                    alert('로그인 중에 오류가 발생했습니다. 다시 시도해주세요.');
                    setForm({ memberId: '', password: '' });
                }
            } else if (response.status === 401) {
                // Display an alert if login fails due to unauthorized access
                alert('로그인 중에 오류가 발생했습니다. 다시 시도해주세요.');
                setForm({ memberId: '', password: '' });
            }  
        } catch (error) {
            // Handle any errors that occur during login
            console.log('Error during login:', error);
            setForm({memberId: '', password: ''});
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