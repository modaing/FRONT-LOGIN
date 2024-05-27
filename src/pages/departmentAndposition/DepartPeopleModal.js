import { useDispatch } from 'react-redux';
import '../../css/department/departPeopleModal.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { callShowAllMemberListAPI } from '../../apis/MemberAPICalls';

function DepartPeopleModal(props) {
    const { visible, onClose, departmentInformation } = props;

    const navigate = useNavigate();
    const [memberList, setMemberList] = useState([]);

    useEffect(() => {
        const fetchMemberLists = async () => {
            try {
                // Await the result of the API call
                const memberLists = await callShowAllMemberListAPI();
    
                // Sort the memberList array by positionLevel
                memberLists.sort((a, b) => a.positionDTO.positionLevel - b.positionDTO.positionLevel);
    
                // Set the memberList state with the sorted data
                setMemberList(memberLists);
            } catch (error) {
                console.error('Error fetching member list:', error);
            }
        };
        fetchMemberLists();
    }, []);
    

    if (!props.visible) return null;

    const handleClose = () => {
        onClose();
        navigate('/departmentAndPosition');
        // window.location.reload();
    }

    return (
        <div className="modalStyle">
            <div className="modalContentStyle">
                <h2 className='changePasswordStyle'>{departmentInformation.departName} 구성원 리스트</h2>
                <div className='content123'>
                    <div className='contentBox1'>
                        <div>
                            <ol>
                            {memberList
                                .filter(member => member.departmentDTO.departNo === departmentInformation.departNo)
                                .map(member => (
                                    <li key={member.memberId}>
                                        {`${member.name} (`}<span className="boldPositionName">{member.positionDTO.positionName}</span>{`)`}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
                <br/>
                <div className='buttonContainerStyle123'>
                    <button type="button" className='closeButtonStyle' onClick={handleClose}>취소</button>
                </div>
            </div>
        </div>
    );
}

export default DepartPeopleModal;
