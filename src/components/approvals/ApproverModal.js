import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMemberAPI } from "../../apis/ApprovalAPI";
import styles from '../../css/approval/approverModal.css';

const ApproverModal = ({ isOpen, onRequestClose, onSave }) => {

    const dispatch = useDispatch();
    const members = useSelector(state => state.approval.members) || [];
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [approverLine, setApproverLine] = useState([]);
    const [referencerLine, setReferencerLine] = useState([]);
    const [expandedDepartments, setExpandedDepartments] = useState([]);

    useEffect(() => {
        if (isOpen) {
            console.log("모달이 열려 있습니다. API 호출을 시작합니다.");
            dispatch(getAllMemberAPI());
        }
        else {
            console.log("모달이 닫혀 있습니다.")
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        console.log("members 상태가 업데이트되었습니다:", members);
    }, [members]);


    const handleSelectMember = (member) => {
        if(!approverLine.includes(member) && !referencerLine.includes(member)){
            setSelectedMembers(prev => {
                if (prev.includes(member)) {
                    return prev.filter(m => m !== member);
                } else {
                    return [...prev, member];
                }
            });
        }
        
    };

    const handleSelectApprover = (member) => {
        setApproverLine(prev => {
            if(prev.includes(member)){
                return prev.filter(m => m !== member);
            }else{
                return [...prev, member];
            }
        });
    };

    const handleSelectReferencer = (member) => {
        setReferencerLine(prev => {
            if(prev.includes(member)){
                return prev.filter(m => m !== member);
            }else{
                return [ ...prev, member];
            }
        });
    };

    const toggleDepartment = (departmentName) => {
        setExpandedDepartments(prev => {
            if (prev.includes(departmentName)) {
                return prev.filter(dep => dep !== departmentName)
            } else {
                return [...prev, departmentName];
            }
        });
    };

    const addToApproverLine = () => {
        setApproverLine([...approverLine, ...selectedMembers.filter(member => !approverLine.includes(member))]);
        setSelectedMembers([]);
    };

    const addToReferencerLine = () => {
        setReferencerLine([...referencerLine, ...selectedMembers.filter(member => !referencerLine.includes(member))]);
        setSelectedMembers([]);
    };

    const removeFromApproverLine = () => {
        setApproverLine(approverLine.filter(member => !selectedMembers.includes(member)));
        setSelectedMembers([]);
    };

    const removeFromReferencerLine = (member) => {
        setReferencerLine(referencerLine.filter(member => !selectedMembers.includes(member)));
        setSelectedMembers([]);
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
    
    const handleClose = () => {
        setSelectedMembers([]);
        setApproverLine([]);
        setReferencerLine([]);
        setExpandedDepartments([]);
        onRequestClose();
    }

    const departments = [...new Set(members.map(member => member.departName))];

    return (
        <div className={`modalOverlay ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
            <div className="ApproverModalContent">
                <div style={{fontWeight:'bold', fontSize:'23px'}}>결재자 선택</div>
                <div className="ApproverModalBody">
                    <div className="ApproverMemberList">
                        <div style={{ fontSize: "20px", fontWeight:"bold" }}>사원 목록</div>
                        <div className="ApproverDepartmentList">
                            {departments.map(department => (
                                <div key={department}>
                                    <div className="ApproverDepartmentHeader" onClick={() => toggleDepartment(department)}>
                                        <span style={{color:"#5869F3"}}>{expandedDepartments.includes(department) ? '∧' : '∨'}</span>
                                        <span>{department}</span>
                                    </div>
                                    {expandedDepartments.includes(department) && (
                                        <div className="ApproverMembers">
                                            {members.filter(member => member.departName === department).map(member => (
                                                <div key={member.memberId} className="ApproverMemberItem" onClick={() => handleSelectMember(member)} >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMembers.includes(member) || approverLine.includes(member) || referencerLine.includes(member)} 
                                                        onChange={() => handleSelectMember(member)}
                                                        disabled={approverLine.includes(member) || referencerLine.includes(member) }
                                                        style={{
                                                            cursor: (approverLine.includes(member) || referencerLine.includes(member)) ? 'not-allowed' : 'pointer',
                                                            color : (approverLine.includes(member) || referencerLine.includes(member)) ? 'gray' : 'black'
                                                        }}
                                                    />
                                                    {member.positionName}  {member.name}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="ApproverButtons">
                        <div className="ApproverButtonsApprover">
                            <button className="AppPlusBtn" onClick={addToApproverLine}> +</button>
                            <button className="AppMinusBtn" onClick={removeFromApproverLine}> -</button>
                        </div>
                        <div className="ApproverButtonsReferencer">
                            <button className="AppPlusBtn" onClick={addToReferencerLine}> +</button>
                            <button className="AppMinusBtn" onClick={removeFromReferencerLine}> -</button>
                        </div>
                    </div>
                    <div className="SeletBox">
                        <div>
                            <div style={{fontWeight:'bold'}}>결재선</div>
                            <div className="SelectBoxApproverLine">
                                <ul>
                                    {approverLine.map((approver, index) => (
                                        <li key={approver.memberId} className="approvalItem">
                                            <input
                                                type="checkbox"
                                                checked={selectedMembers.includes(approver)}
                                                onChange={() => handleSelectApprover(approver)}
                                            />
                                            <span>{index + 1}. </span>
                                            {approver.departName} - {approver.positionName} {approver.name}
                                            
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div>
                            <div style={{fontWeight:'bold'}}>참조선</div>
                            <div className="SelectBoxReferencerLine">

                                <ul>
                                    {referencerLine.map(referencer => (
                                        <li key={referencer.memberId}>
                                            {referencer.departName} - {referencer.positionName} {referencer.name}
                                            <button onClick={() => removeFromReferencerLine(referencer)}>-</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
                <div style={{ textAlign: 'right ' }}>
                    <button onClick={handleClose}>취소</button>
                    <button onClick={handleSave}>저장</button>
                </div>
            </div>
        </div>
    );

};

export default ApproverModal;