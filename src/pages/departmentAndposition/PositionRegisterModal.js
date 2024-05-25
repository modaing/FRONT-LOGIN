import { useDispatch } from 'react-redux';
import '../../css/department/department.css'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { callRegisterPositionAPI, callPositionDetailListAPI } from '../../apis/PositionAPICalls';
function PositionRegisterModal(props) {
 
    const [newPositionName, setNewPositionName] = useState('');
    const [positionLevel, setPositionLevel] = useState('');
    const { visible, onClose, positionInformation } = props;
    const [positionList, setPositionList] = useState([]);
    const navigate = useNavigate();

    if (!props.visible) return null;

    const fetchPositionDetails = async() => {
        try {
            const positionDetailList = await callPositionDetailListAPI();
            if (Array.isArray(positionDetailList)) {
                setPositionList(positionDetailList);
                return positionDetailList;
            } else {
                console.error('position details is not an array:', positionDetailList);
            }
        } catch (error) {
            console.error('직급 리스트를 불러 오는데 오류가 발생했습니다:', error);
        }
    }

    // const registerPosition = async () => {
    //     try {
    //         if (newPositionName) {
    //             const response = await callRegisterPositionAPI({
    //                 newPositionName: newPositionName,
    //                 positionLevel: positionLevel
    //             });
    //             if (response) {
    //                 alert('직급를 성공적으로 등록했습니다');
    //                 onClose();
    //                 navigate('/departmentAndPosition');
    //                 window.location.reload();
    //             }
    //         } else {
    //             alert('오류가 발생했습니다. 잠시만 기달려주세여..');
    //             setNewPositionName('');
    //         }
    //     } catch (error) {
    //         if (error.response.data === "Position name already exists") {
    //             alert('직급명이 이미 존재합니다')
    //         }
    //         console.error("직급명 수정하는데 오류가 발생했습니다:", error);
    //     }
    // }

    const registerPosition = async () => {
        try {
            if (newPositionName) {
                const isPositionNameExists = positionList.some(pos => pos.positionName === newPositionName);
                if (isPositionNameExists) {
                    alert('이미 같은 이름의 직급이 존재합니다.');
                    return;
                }

                const isPositionLevelExists = positionList.some(pos => pos.positionLevel === parseInt(positionLevel));
                if (isPositionLevelExists) {
                    alert('이미 같은 레벨의 직급이 존재합니다.');
                    return;
                }

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
            } else {
                alert('오류가 발생했습니다. 잠시만 기다려주세요..');
                setNewPositionName('');
            }
        } catch (error) {
            if (error.response.data === "Position name already exists") {
                alert('직급명이 이미 존재합니다')
            } else if (error.response.data === 'Position level already exists') {
                alert('직급 레벨이 이미 존재합니다')
            }
            console.error("직급명 수정하는데 오류가 발생했습니다:", error);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (parseInt(positionLevel) < 0) {
            alert('올바른 직급레벨이 아닙니다. 다시 입력해주세요');
        } else if (newPositionName.trim()) {
            await registerPosition();
        } else {
            alert('등록할 부서명을 입력하세요')
        }

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
                    <div className='content123'>
                        <div className='contentBox1'>
                            <label className='pStyle'>직급명</label>
                            <input
                                type="text"
                                name="newPassword1"
                                value={newPositionName}
                                placeholder="직급명 입력"
                                className='inputStyle123'
                                onChange={(e) => setNewPositionName(e.target.value)}
                            />
                        </div>
                        <div className='contentBox2'>
                            <label className='pStyle'>직급 레벨</label>
                            <input 
                                type="number" 
                                name="positionLevel" 
                                value={positionLevel} 
                                placeholder="직급 레벨 입력" 
                                className='inputStyle123' 
                                onChange={(e) => setPositionLevel(Math.max(0, parseInt(e.target.value)))}
                                min="0"
                            />
                        </div>
                    </div>
                    <br/>
                    <div className='buttonContainerStyle123'>
                        <button type="button" className='closeButtonStyle' onClick={handleClose}>취소</button>
                        <button type="submit" className='confirmationButtonStyle'>등록</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PositionRegisterModal;