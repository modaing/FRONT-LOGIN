import React from 'react';
import LoginCSS from './Login.module.css';

function ModalPassword(props) {
    if (!props.visible) return null;


    //                 가입된 계정의 비밀번호를 잊으셨다면, 회사 내 인사팀 (전화번호)에게 
    //                 귀하의 비밀번호 초기화를 요청해 주세요


    return (
        <div className={LoginCSS.modalStyle123} onClick={props.onClose}>
            <div className={LoginCSS.modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <button className={LoginCSS.closeButton} onClick={props.onClose}>X</button>
                <div className={LoginCSS.information}>
                가입된 계정의 비밀번호를 잊으셨다면, 회사 내 인사팀 (전화번호)에게  <br /><br /><br />
                    귀하의 비밀번호 초기화를 요청해 주세요
                </div>
                {/* <div className={LoginCSS.buttonContainerStyle}>
                    <button className={LoginCSS.closeButton} onClick={props.onClose}>취소</button>
                </div> */}
            </div>
        </div>
    );
}

export default ModalPassword;