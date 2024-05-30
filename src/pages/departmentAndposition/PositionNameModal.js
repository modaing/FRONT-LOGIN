import { useDispatch } from 'react-redux';
import '../../css/department/departmentNameModal.css'
import { callChangePositionNameAPI } from '../../apis/PositionAPICalls';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook

function PositionNameModal(props) {

    const [positionName, setPositionName] = useState('');
    const { visible, onClose, positionInformation } = props;
    const navigate = useNavigate();
    console.log('props:',props);

    if (!props.visible) return null;

    const changePositionName = async () => {
        try {
            const response = await callChangePositionNameAPI({
                positionName: positionInformation.positionName,
                newPositionName: positionName
            });

            if (response) {
                alert('직급명이 성공적으로 변경되었습니다.');
                props.onClose();
            }
        } catch (error) {
            if(error.response.data === "Position name already exists") {
                alert("직급명이 이미 존재합니다");
            }
            console.error('직급명 수정하는데 오류가 발생했습니다:', error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        await changePositionName();
        navigate('/departmentAndPosition'); // Replace the current URL with the desired one
        window.location.reload();
    }

    const handleClose = () => {
        onClose();
        // navigate(-1); // Replace the current URL with the desired one
        navigate('/departmentAndPosition');
        // window.location.reload(); // Refresh the page
    }

    return (
        <div className="modalStyle123">
            <div className="modalContentStyle">
                <h2 className='changePasswordStyle'>직급명 변경</h2>
                <form onSubmit={handleSubmit}>
                    <div className='content123'>
                        <div className='contentBox1'>
                            <label className='departNameStyle1234'>직급명</label>
                            <input type="text" name="newPassword1" placeholder={positionInformation.positionName} className='inputStyle123' readOnly/>
                        </div>
                        <div className='contentBox2'>
                            <label className='departNameStyle1234'>새직급명</label>
                            <input type="text" name="newPassword2" value={positionName} placeholder="새직급명 입력" className='inputStyle123' onChange={(e) => setPositionName(e.target.value)}/>
                        </div>
                    </div>
                    <br/>
                    <div className='buttonContainerStyle123'>
                        <button type="button" className='closeButtonStyle' onClick={handleClose}>취소</button>
                        <button type="submit" className='confirmationButtonStyle'>변경</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PositionNameModal;
