import { useDispatch } from 'react-redux';
import '../../css/department/department.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { callRegisterPositionAPI } from '../../apis/PositionAPICalls';
function PositionRegisterModal(props) {
 
    const [newPositionName, setNewPositionName] = useState('');
    const [confirmPositionName, setConfirmPositionName] = useState('');
    const [positionLevel, setPositionLevel] = useState('');
    const { visible, onClose, positionInformation } = props;
    const navigate = useNavigate();

    if (!props.visible) return null;

    const registerPosition = async () => {
        try {
            if (newPositionName === confirmPositionName) {
                const response = await callRegisterPositionAPI({
                    newPositionName: newPositionName,
                    positionLevel: positionLevel
                });
                if (response) {
                    alert('직급를 성공적으로 등록했습니다');
                    onClose();
                    navigate('/departmentAndPosition');
                    window.location.reload();
                }
            } else if (newPositionName !== confirmPositionName) {
                alert('직급명이 일치하지 않습니다. 다시 입력해주세요');
                setNewPositionName('');
                setConfirmPositionName('');
            } else {
                alert('오류가 발생했습니다. 잠시만 기달려주세여..');
                setConfirmPositionName('');
                setNewPositionName('');
            }
        } catch (error) {
            if (error.response.data === "Position name already exists") {
                alert('직급명이 이미 존재합니다')
            }
            console.error("직급명 수정하는데 오류가 발생했습니다:", error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await registerPosition();
    }

    const handleClose = () => {
        onClose();
        navigate('/departmentAndPosition');
        // window.location.reload();
    }

    return (
        <div className="modalStyle">
            <div className="modalContentStyle">
                <h2 className='changePasswordStyle'>직급 등록</h2>
                <form onSubmit={handleSubmit}> {/* Form format */}
                    <div className='content'>
                        <div className='contentBox1'>
                            <label className='pStyle'>직급명</label>
                            <input type="text" name="newPassword1" value={newPositionName} placeholder="직급명 입력" className='inputStyle1' onChange={(e) => setNewPositionName(e.target.value)}/>
                        </div>
                        <div className='contentBox2'>
                            <label className='pStyle'>새직급명</label>
                            <input type="text" name="newPassword2" value={confirmPositionName} placeholder="새직급명 입력" className='inputStyle2' onChange={(e) => setConfirmPositionName(e.target.value)}/>
                        </div>
                        <div className='contentBox2'>
                            <label className='pStyle'>직급 레벨</label>
                            <input type="number" name="positionLevel" value={positionLevel} placeholder="직급 레벨 입력" className='inputStyle2' onChange={(e) => setPositionLevel(e.target.value)}/>
                        </div>
                    </div>
                    <br/>
                    <div className='buttonContainerStyle'>
                        <button type="button" className='closeButtonStyle' onClick={handleClose}>취소</button>
                        <button type="submit" className='confirmationButtonStyle'>등록</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PositionRegisterModal;