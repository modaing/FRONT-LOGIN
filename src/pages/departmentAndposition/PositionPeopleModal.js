import { useDispatch } from 'react-redux';
import '../../css/department/departmentRegistModal.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { callShowAllMemberListAPI } from '../../apis/MemberAPICalls';

function PositionPeopleModal(props) {
    const { visible, onClose, positionInformation } = props;

    const navigate = useNavigate();
    const [memberList, setMemberList] = useState([]);

    useEffect(() => {
        const fetchMemberLists = async () => {
            try {
                // Await the result of the API call
                const memberLists = await callShowAllMemberListAPI();
                console.log('memberList:', memberLists);
                // Set the memberList state with the resolved data
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
        <div className="modalStyle123">
            <div className="modalContentStyle">
                <h2 className='changePasswordStyle'>{positionInformation.positionName} 구성원 리스트</h2>
                <div className='content123'>
                    <div className='contentBox1'>
                        <div>
                            <ol>
                            {memberList
                                .filter(member => member.positionDTO.positionName === positionInformation.positionName)
                                .map(member => (
                                        <li key={member.memberId}>
                                            {member.name}
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

export default PositionPeopleModal;
