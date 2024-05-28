import { useDispatch } from 'react-redux';
import '../../css/department/departmentDelete.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook
import { callDeleteDepartmentAPI, callDepartmentDetailListAPI } from '../../apis/DepartmentAPICalls';

function DepartDeleteModal(props) {

    const [departName, setDepartName] = useState('');
    const [departNoMap, setDepartNoMap] = useState('');
    const { visible, onClose, departmentInformation } = props;
    const navigate = useNavigate();
    

    if (!props.visible) return null;

    const deleteDepartment = async () => {
        try {

            /* 입력한 부서명이 없으면 */
            if (departName.length === 0) {
                alert('부서명을 입력하세요');
                return;
            }

            // Fetch the department list
            const departments = await callDepartmentDetailListAPI();
            console.log('department list:', departments);

            /* 입력한 부서명이 존재하는지 찾는 logic */
            const departmentToDelete = departments.find(department => department.departName === departName);
            if (departmentToDelete === undefined) {
                alert('부서자 존재하지 않습니다');
                setDepartName('');
                return;
            }

            /* 입력한 부서명 */
            const departNameToBeDeleted = departmentToDelete.departName;
            console.log('departmentToBeDeleted name:', departNameToBeDeleted);

            // 부서에 직급이 존재하는지 확인하는 logic
            console.log('people in the department:',departmentToDelete.noOfPeople);
            if (departmentToDelete.noOfPeople !== 0) {
                alert('부서에 인원이 있어서 삭제는 불가능합니다');
                onClose();
                return;
            }
            /* logic이 다 통과되면 해당 부서를 삭제하는 logic */
            const deleteResponse = await callDeleteDepartmentAPI({ departNo: departmentToDelete.departNo });
            if (deleteResponse) {
                alert('부서명이 성공적으로 삭제되었습니다.');
                onClose();
                navigate('/departmentAndPosition'); // Replace the current URL with the desired one
                window.location.reload();
            }
        } catch (error) {
            console.log('error message:',error);
            if (error.response && error.response.data === "Department name does not exist") {
                alert("부서가 존재하지 않습니다");
                return;
            } else {
                console.error('부서를 삭제하는데 오류가 발생했습니다:', error);
                return;
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        await deleteDepartment();
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
                <h2 className='changePasswordStyle'>부서명 삭제</h2>
                <form onSubmit={handleSubmit}> {/* Form format */}
                    <div className='content123'>
                        <div className='contentBox1'>
                            <label className='pStyleDeleteDepart'>삭제할 부서명</label>
                            <input type="text" name="newPassword1" placeholder="삭제할 부서명" value={departName} className='inputStyle123' onChange={(e) => setDepartName(e.target.value)}/>
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

export default DepartDeleteModal;
