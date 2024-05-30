// Modal.js
import React from 'react';
import LoginCSS from './Login.module.css';
import '../../css/member/loginModal.css';

function ModalID(props) {
    if (!props.visible) return null;

    const handleOnClose = () => {
        props.onClose();
    }

    return (
        <div className={LoginCSS.modalStyle123} onClick={props.onClose}>
            <div className="modalStyleForModalId" onClick={(e) => e.stopPropagation()}>
                <div className="IdInformation">
                    가입된 계정의 아이디를 잊으셨다면, 회사 내 인사팀 (전화번호)에게 <br /><br /><br />
                    귀하의 사번확인을 요청해 주세요
                </div>
                <div className="buttonContainer">
                    <button className="closeModalIdButton" onClick={handleOnClose}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default ModalID;