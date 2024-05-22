import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMemberAPI } from "../../apis/ApprovalAPI";
import styles from '../../css/approval/approverModal.css';

const ApproverModal = ({ isOpen, onRequestClose, onSave }) => {

    const dispatch = useDispatch();
    const members = useSelector(state => state.approval.members) || [];
    const [selectedMember, setSelectedMember] = useState(null);
    const [approverLine, setApproverLine] = useState([]);
    const [referencerLine, setReferencerLine] = useState([]);

    useEffect(() => {
        if (isOpen) {
            console.log("모달이 열려 있습니다. API 호출을 시작합니다.");
            dispatch(getAllMemberAPI());
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        console.log("members 상태가 업데이트되었습니다:", members);
    }, [members]);

    const addToApproverLine = () => {
        if (selectedMember && !approverLine.includes(selectedMember)) {
            setApproverLine([...approverLine, selectedMember]);
        }
    };

    const addToReferencerLine = () => {
        if (selectedMember && !referencerLine.includes(selectedMember)) {
            setReferencerLine([...referencerLine, selectedMember]);
        }
    };

    const removeFromApproverLine = () => {
        setApproverLine(approverLine.filter(member => member !== selectedMember));
    };

    const removeFromReferencerLine = () => {
        setReferencerLine(referencerLine.filter(member => member !== selectedMember));
    };

    const handleSave = () => {
        if (approverLine.length === 0) {
            alert('결재선이 선택되지 않았습니다. 결재선을 선택해주세요.');
        }
        else {
            onSave(approverLine, referencerLine);
            onRequestClose();
        }
    };

    return (
        <div className={`modalOverlay ${isOpen ? 'show' : ''}`}>
            <div className="modalContent">
                <h3>결재자 선택</h3>
                <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1 }}>
                        <h3>사원 목록</h3>
                        <ul>
                            {Array.isArray(members) && members.length > 0 ? members.map(member => (
                                <li key={member.memberId} onClick={() => setSelectedMember(member)}>
                                    {member.name}
                                </li>
                            )) : <p>사원 목록이 존재하지 않습니다.</p>}
                        </ul>
                        <div>멤버목록 : {members}</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center' }}>
                        <h3>결재선</h3>
                        <button onClick={addToApproverLine}>+</button>
                        <button onClick={removeFromApproverLine}>-</button>
                        <ul>
                            {approverLine.map(approver => (
                                <li key={approver.memberId}>
                                    {approver.name}
                                </li>
                            ))}
                        </ul>
                        <h3>참조선</h3>
                        <button onClick={addToReferencerLine}>+</button>
                        <button onClick={removeFromReferencerLine}>-</button>
                        <ul>
                            {referencerLine.map(referencer => (
                                <li key={referencer.memberId}>
                                    {referencer.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
                <div style={{ textAlign: 'right ' }}>
                    <button onClick={onRequestClose}>취소</button>
                    <button onClick={handleSave}>저장</button>
                </div>
            </div>
        </div>
    );

};

export default ApproverModal;