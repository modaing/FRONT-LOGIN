import React, { useState } from 'react';
import LoginCSS from '../member/Login.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { setPassword1Action, setPassword2Action } from '../../modules/PasswordReducer';
import { useNavigate } from 'react-router-dom';
import { callChangePasswordAPI } from '../../apis/MemberAPICalls';
import '../../css/member/changePasswordModal.css';

function ChangePasswordModal(props) {
    const dispatch = useDispatch();
    const password1 = useSelector(state => state.passwordReducer.password1);
    const password2 = useSelector(state => state.passwordReducer.password2);
    const [currentPassword, setCurrentPassword] = useState('');
    const navigate = useNavigate();
    
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        name === 'newPassword1' ? dispatch(setPassword1Action(value)) : dispatch(setPassword2Action(value));
    };
    
    const handleConfirmationButtonClick = async (e) => {
        e.preventDefault();

        const data = {
            currentPassword: currentPassword,
            newPassword1: password1,
            newPassword2: password2
        };
        if (!currentPassword || !password1 || !password2) {
            alert('값을 입력해주세요');
        } else if (password1 !== password2) {
            alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요');
            setPassword1Action('');
            setPassword2Action('');
        } else if (currentPassword === password1 && currentPassword === password2) {
            alert('기존의 비밀번호랑 같으면 안됩니다');
            setPassword1Action('');
            setPassword2Action('');
        } else {
            try {
                const response = await callChangePasswordAPI(data);
                // alert('response.data:',response.data);
                if (response === 'Successfully changed the password') {
                    alert('비밀번호를 성공적으로 변경했습니다');
                    navigate('/myProfile');
                    window.location.reload();
                } else if (response.data === 'New passwords do not match') {
                    alert('비밀번호가 일치하지 않습니다');
                } else if (response === 'Incorrect current password') {
                    alert('비밀번호가 틀렸습니다');
                }
            } catch (error) {
                console.error('Failed to change password:', error);
            }
        }
    };

    const handleClose = () => {
        window.history.replaceState(null, '', `/myProfile`);
        props.onClose();
    }
    
    if (!props.visible) return null;
    
    return (
        <div className={LoginCSS.modalStyle123} onClick={props.onClose}>
            <div className={LoginCSS.modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <h2 className={LoginCSS.changePasswordStyle}>비밀번호 변경</h2>
                <form onSubmit={handleConfirmationButtonClick}> {/* Form format */}
                <p className={LoginCSS.pStyle}>기존 비밀번호</p>
                    <input type="password" name="currentPassword" placeholder="기존 비밀번호 입력" className="inputStyleWidth" onChange={(e) => setCurrentPassword(e.target.value)}/>
                    <br /><br />
                    <p className={LoginCSS.pStyle}>새 비밀번호</p>
                    <input type="password" name="newPassword1" placeholder="새 비밀번호 입력" className="inputStyleWidth" onChange={handlePasswordChange}/>
                    <br /><br />
                    <p className={LoginCSS.pStyle}>새 비밀번호 (확인)</p>
                    <input type="password" name="newPassword2" placeholder="새 비밀번호 (확인)" className="inputStyleWidth" onChange={handlePasswordChange}/>
                    <br/>
                    <div className={LoginCSS.buttonContainerStyle}>
                        <button type="button" className={LoginCSS.closeButtonStyle} onClick={handleClose}>취소</button>
                        <button type="submit" className={LoginCSS.confirmationButtonStyle}>변경</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordModal;