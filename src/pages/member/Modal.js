// Modal.js
import React from 'react';
import LoginCSS from './Login.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setPassword1Action, setPassword2Action } from '../../modules/PasswordReducer';

function Modal(props) {
    const dispatch = useDispatch();
    const password1 = useSelector(state => state.passwordReducer.password1);
    const password2 = useSelector(state => state.passwordReducer.password2);
    
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        name === 'passwordConfirmation1' ? dispatch(setPassword1Action(value)) : dispatch(setPassword2Action(value));
    };
    
    const handleConfirmationButtonClick = () => {
        if (password1 !== password2) {
            alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요');
            dispatch(setPassword1Action(''));
            dispatch(setPassword2Action(''));
        } else {
            console.log('비밀번호 성공적으로 변경 되었습니다');
        }
    };
    
    if (!props.visible) return null;
    
    return (
        <div className={LoginCSS.modalStyle123} onClick={props.onClose}>
            <div className={LoginCSS.modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <h2 className={LoginCSS.changePasswordStyle}>비밀번호 변경</h2>
                <form onSubmit={handleConfirmationButtonClick}> {/* Form format */}
                    <p className={LoginCSS.pStyle}>새 비밀번호</p>
                    <input type="password" name="newPassword1" placeholder="새 비밀번호 입력" value={password1} className={LoginCSS.inputStyle1} onChange={handlePasswordChange}/>
                    <p className={LoginCSS.pStyle}>새 비밀번호 (확인)</p>
                    <input type="password" name="newPassword2" placeholder="새 비밀번호 (확인)" value={password2} className={LoginCSS.inputStyle2} onChange={handlePasswordChange}/>
                    <br/>
                    <div className={LoginCSS.buttonContainerStyle}>
                        <button type="button" className={LoginCSS.closeButtonStyle} onClick={props.onClose}>취소</button>
                        <button type="submit" className={LoginCSS.confirmationButtonStyle}>변경</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Modal;