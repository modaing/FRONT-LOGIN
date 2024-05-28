// Modal.js
import React from 'react';
import LoginCSS from './Login.module.css';

function ModalID(props) {
    if (!props.visible) return null;

    return (
        <div className={LoginCSS.modalStyle123} onClick={props.onClose}>
            <div className={LoginCSS.modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <button className={LoginCSS.closeButton} onClick={props.onClose}>X</button>
                <div className={LoginCSS.information}>
                    가입된 계정의 아이디를 잊으셨다면, 회사 내 인사팀 (전화번호)에게 <br /><br /><br />
                    귀하의 사번확인을 요청해 주세요
                </div>
                {/* <div className={LoginCSS.buttonContainerStyle}>
                    <button className={LoginCSS.closeButton} onClick={props.onClose}>취소</button>
                </div> */}
            </div>
        </div>
    );
}

export default ModalID;