import { useDispatch } from 'react-redux';
import '../../css/department/department.css'
import { callChangeDepartmentNameAPI } from '../../apis/DepartmentAPICalls';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function DepartNameModal(props) {

    const [departName, setDepartName] = useState('');
    const { visible, onClose, departmentInformation } = props;
    const navigate = useNavigate();

    if (!props.visible) return null;

    const changeDepartmentName = async () => {
        try {
            const response = await callChangeDepartmentNameAPI({
                departNo: departmentInformation.departNo,
                departmentName: departmentInformation.departName,
                newDepartName: departName
            });

            if (response) {
                alert('부서명이 성공적으로 변경되었습니다.');
                props.onClose();
            }
        } catch (error) {
            if(error.response.data === "Department name already exists") {
                alert("부서명이 이미 존재합니다");
            }
            console.error('부서명 수정하는데 오류가 발생했습니다:', error);
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await changeDepartmentName();
        navigate('/departmentAndPosition'); // Replace the current URL with the desired one
        window.location.reload();
    }

    const handleClose = () => {
        onClose();
        navigate('/departmentAndPosition'); // Replace the current URL with the desired one
        // window.location.reload(); // Refresh the page
    }

    return (
        <div className="modalStyle">
            <div className="modalContentStyle">
                <h2 className='changePasswordStyle'>부서명 변경</h2>
                <form onSubmit={handleSubmit}> {/* Form format */}
                    <div className='content'>
                        <div className='contentBox1'>
                            <label className='pStyle'>현재 부서명</label>
                            <input type="text" name="newPassword1" placeholder={departmentInformation.departName} className='inputStyle1' readOnly />
                        </div>
                        <div className='contentBox2'>
                            <label className='pStyle'>새부서명</label>
                            <input type="text" name="newPassword2" value={departName} placeholder="새부서명 입력" className='inputStyle2' onChange={(e) => setDepartName(e.target.value)}/>
                        </div>
                    </div>
                    <br/>
                    <div className='buttonContainerStyle'>
                        <button type="button" className='closeButtonStyle' onClick={handleClose}>취소</button>
                        <button type="submit" className='confirmationButtonStyle'>변경</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DepartNameModal;