import Modal from './Modal'; 
import ModalID from './ModalID';
import ModalPassword from './ModalPassword';
import LoginCSS from './Login.module.css';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { callLoginAPI } from '../../apis/MemberAPICalls';

function Login() {

    const navigate = useNavigate();
    // const { login } = useContext(LoginContext)
    const [form, setForm] = useState({
        memberId: '',
        password: ''
    });
    const loginMember = useSelector(state => state.memberReducer);
    const loginButtonRef = useRef(null); 
    const dispatch = useDispatch();

    /* 모달창 invinsible at the start */
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isIDModalVisible, setIsIDModalVisible] = useState(false);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

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

    /* 설명 필요 */
    useEffect(() => {
        if (loginMember.status === 200) {
            dispatch(callLoginAPI({ form }));
            console.log(`Login success!`, loginMember);
            navigate("/", { replace: true });
        }
    }, [loginMember, navigate]);

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
        const { name, value } = e.target;
        setForm(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    const onClickLoginHandler = async () => {
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

                console.log("inputted memberID:",form.memberId);
                console.log("inputted password:",form.password);
                const token = responseData.token;
                localStorage.setItem('accessToken', token); // Store the token in localStorage for future use
                console.log("token 정보:",token);
                
                // Navigate to the home page if login is successful
                navigate("/");

                if (responseData.failType === '존재하지 않는 사용자입니다') {
                    alert('존재하지 않는 사용자입니다');
                } else if (responseData.failType ===' 아이디 또는 비밀번호가 틀립니다') {
                    alert('아이디 또는 비밀번호가 틀립니다');
                } else if (responseData.failType === '잠긴 계정입니다. 관리자에게 문의하세요') {
                    alert('잠긴 계정입니다. 관리자에게 문의하세요');
                } else if (responseData.failType === '비활성화된 계정입니다. 관리자에게 문의하세요') {
                    alert('비활성화된 계정입니다. 관리자에게 문의하세요')
                } else if (responseData.failType === '만료된 계정입니다. 관리자에게 문의하세요') {
                    alert('만료된 계정입니다. 관리자에게 문의하세요');
                } else if (responseData.failType === '비밀번호가 만료되었습니다') {
                    alert('비밀번호가 만료되었습니다');
                } else if (responseData.failType === '인증 요청이 거부되었습니다') {
                    alert('인증 요청이 거부되었습니다');
                } else if (responseData.failType === '존재하지 않는 이메일입니다') {
                    alert('존재하지 않는 이메일입니다');
                } else if (responseData.failType=== '정의되지 않은 케이스의 오류입니다. 관리자에게 문의해 주세요'){
                    alert('정의되지 않은 케이스의 오류입니다. 관리자에게 문의해 주세요');
                }
                
            } else if (response.status === 401) {
                // Display an alert if login fails due to unauthorized access
                alert('로그인을 다시 해주세요');
                setForm({ id: '', pass: '' });
            }
        } catch (error) {
            // Handle any errors that occur during login
            console.log('Error during login:', error);
        }
    };
    

    // id 저장 기능 구현 후 추가
    // rememberUserId를 넣어줘
    // defaultValue={}


    // 1. 로그인 Button을 누르면 onSubmit event가 동작을 하면서 onLogin method를 호출하고
    return (
        <div className={LoginCSS.formContainerStyle}>
            <img src="https://s3.us-east-1.amazonaws.com/cdn.designcrowd.com/blog/120-cool-logos-for-a-fresh-new-look/FAMOUS/Apple.png" className={LoginCSS.imageStyle} alt="Logo" />
            <div>
            {/* <form> */}
                <input type="text" name="memberId" placeholder="아이디" autoComplete='off' onChange={onChangeHandler} className={LoginCSS.inputStyle1} />
                    <br /><br />
                <input type="password" name="password" placeholder="비밀번호" autoComplete='off' onChange={onChangeHandler} className={LoginCSS.inputStyle2} />
                <div className={LoginCSS.linkContainerStyle}>
                    <p className={LoginCSS.linkStyle} onClick={handleFindIDClick}>아이디 찾기</p>
                    <p className={LoginCSS.linkStyle} onClick={handleFindPasswordClick}>비밀번호 찾기</p>
                </div>
                <button type='submit' ref={loginButtonRef} className={LoginCSS.loginButtonStyle} onClick={onClickLoginHandler}>로그인</button>
                {/* <button type='submit' ref={loginButtonRef} className={LoginCSS.loginButtonStyle}>로그인</button> */}
            </div>
            <Modal visible={isModalVisible} onClose={handleCloseModal} />
            <ModalID visible={isIDModalVisible} onClose={handleCloseModal} />
            <ModalPassword visible={isPasswordModalVisible} onClose={handleCloseModal} />
        </div>
    );
}

export default Login;