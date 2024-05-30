import { useDispatch } from 'react-redux';
import '../../css/department/departmentDelete.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook
import { callDeletePositionAPI, callPositionDetailListAPI } from '../../apis/PositionAPICalls';

function PositionDeleteModal(props) {

    const [positionName, setPositionName] = useState('');
    // const [departNo, setDepartNo] = useState('');
    const { visible, onClose, departmentInformation } = props;
    const navigate = useNavigate();
    

    if (!props.visible) return null;

    // const fetchSpecificDepartment = async () => {
    //     try {
    //         const response = await callGetDepartByNameAPI({
    //             departName
    //         });
    //         return response;
    //     } catch (error) {
    //         console.error('특정 부서를 불러오는데 실패했습니다:', error);
    //         throw error;
    //     }
    // };

    const deletePosition = async () => {
        try {

            if (positionName.length === 0) {
                alert('직급명을 입력하세요');
                return;
            }

            const positions = await callPositionDetailListAPI();
            console.log('position list:', positions);

            const positionToDelete = positions.find(position => position.positionName === positionName);
            if (positionToDelete === undefined) {
                alert('직급이 존재하지 않습니다');
                setPositionName('');
                return;
            }

            const positionNameToBeDeleted = positionToDelete.positionName;
            console.log('positionNameToBeDeleted:', positionNameToBeDeleted);

            console.log('people in the position:', positionToDelete.noOfPeople);
            if (positionToDelete.noOfPeople !== 0) {
                alert('직급에 인원이 있어서 삭제는 불가능합니다');
                onClose();
                return;
            }

            const deleteResponse = await callDeletePositionAPI({
                positionName
            });
            if (deleteResponse) {
                alert('부서명이 성공적으로 삭제되었습니다.');
                onClose();
                // navigate(-1); // Replace the current URL with the desired one
                navigate('/departmentAndPosition');
                window.location.reload();
            }
        } catch (error) {
            if (error.response && error.response.data === "Position name does not exist") {
                alert("직급이 존재하지 않습니다");
            } else {
                console.error('직급을 삭제하는데 오류가 발생했습니다:', error);
            }
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        await deletePosition();
        // navigate('/departmentAndPosition'); // Replace the current URL with the desired one
        // window.location.reload();
    }

    const handleClose = () => {
        onClose();
        navigate('/departmentAndPosition'); // Replace the current URL with the desired one
        // window.location.reload(); // Refresh the page
    }

    return (
        <div className="modalStyle123">
            <div className="modalContentStyle">
                <h2 className='changePasswordStyle'>직급 삭제</h2>
                <form onSubmit={handleSubmit}> {/* Form format */}
                    <div className='content123'>
                        <div className='contentBox1'>
                            <label className='positionDeleteModalStyle'>삭제할 직급</label>
                            <input type="text" name="newPassword1" placeholder="삭제할 직급" value={positionName} className='inputStyle123' onChange={(e) => setPositionName(e.target.value)}/>
                        </div>
                    </div>
                    <br/>
                    <div className='buttonContainerStyle123'>
                        <button type="button" className='closeButtonStyle' onClick={handleClose}>취소</button>
                        <button type="submit" className='confirmationButtonStyle'>삭제</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default PositionDeleteModal;