import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllMemberAPI } from "../../apis/ApprovalAPI";
import CancelModal from "./CancelModal";
import styles from '../../css/approval/approverModal.css';

const ApproverModal = ({ isOpen, onRequestClose, onSave }) => {

    const dispatch = useDispatch();
    const members = useSelector(state => state.approval.members) || [];
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectedMembersForRemove, setSelectedMembersForRemove] = useState([]);
    const [approverLine, setApproverLine] = useState([]);
    const [referencerLine, setReferencerLine] = useState([]);
    const [expandedDepartments, setExpandedDepartments] = useState([]);
    const [isCancelMocalOpen, setIsCancelModalOpen] = useState(false);
    const [initialApproverLine, setInitialApproverLine] = useState([]);
    const [initialReferencerLine, setInitialReferencerLine] = useState([]);

    useEffect(() => {
        if (isOpen) {
            console.log("모달이 열려 있습니다. API 호출을 시작합니다.");
            dispatch(getAllMemberAPI());
            setInitialApproverLine([...approverLine]);
            setInitialReferencerLine([...referencerLine]);
        }
    }, [isOpen, dispatch]);

    useEffect(() => {
        console.log("members 상태가 업데이트되었습니다:", members);
    }, [members]);


    const handleSelectMember = (member) => {
        if (!approverLine.includes(member) && !referencerLine.includes(member)) {
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
            if (prev.includes(member)) {
                return prev.filter(m => m !== member);
            } else {
                return [...prev, member];
            }
        });
    };

    const handleSelectReferencer = (member) => {
        setReferencerLine(prev => {
            if (prev.includes(member)) {
                return prev.filter(m => m !== member);
            } else {
                return [...prev, member];
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

    const handlerMemberSElect = (member) => {
        setSelectedMembers(member);
    };

    const handleMemberRemoveSelect = (member) => {
        if(selectedMembersForRemove.includes(member)){
            setSelectedMembersForRemove(selectedMembersForRemove.filter(m => m !== member));

        }else{
            setSelectedMembersForRemove([...selectedMembersForRemove, member])
        }
    }

    const addToApproverLine = () => {
        setApproverLine([...approverLine, ...selectedMembers.filter(member => !approverLine.includes(member))]);
        setSelectedMembers([]);
    };

    const addToReferencerLine = () => {
        setReferencerLine([...referencerLine, ...selectedMembers.filter(member => !referencerLine.includes(member))]);
        setSelectedMembers([]);
    };

    const removeFromApproverLine = () => {
        setApproverLine(approverLine.filter(member => !selectedMembersForRemove.includes(member)));
        setSelectedMembers([]);
    };

    const removeFromReferencerLine = (member) => {
        setReferencerLine(referencerLine.filter(member => !selectedMembersForRemove.includes(member)));
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
        const isApproverLineChanged = JSON.stringify(initialApproverLine) !== JSON.stringify(approverLine);
        const isReferencerLineChanged = JSON.stringify(initialReferencerLine) !== JSON.stringify(referencerLine);

        if(isApproverLineChanged || isReferencerLineChanged){
            setIsCancelModalOpen(true);
        }
        else{
            onRequestClose();
        }
        
    }

    const handleConfirmClose = () => {
        setSelectedMembers([]);
        setApproverLine([]);
        setReferencerLine([]);
        setExpandedDepartments([]);
        setIsCancelModalOpen(false);
        onRequestClose();
    } ;

    const handleCancelClose = () => {
        setIsCancelModalOpen(false);
    };

    const departments = [...new Set(members.map(member => member.departName))];

    const moveUp = (line, setLine, index) => {
        if (index === 0) {
            return;
        }

        const newLine = [...line];
        [newLine[index], newLine[index - 1]] = [newLine[index - 1], newLine[index]];
        setLine(newLine);
    };

    const moveDown = (line, setLine, index) => {
        if (index === line.length -1) 
        {
            return;
        }
        const newLine = [...line];
        [newLine[index], newLine[index + 1 ]] = [newLine[index + 1], newLine[index]];
        setLine(newLine);
    };

    return (
        <>
        <div className={`modalOverlay ${isOpen ? 'show' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
            <div className="ApproverModalContent">
                <div style={{ fontWeight: 'bold', fontSize: '23px', marginBottom:'10px' }}>결재자 선택</div>
                <div className="ApproverModalBody">
                    <div className="ApproverMemberList">
                        <div style={{ fontSize: "20px", fontWeight: "bold" }}>사원 목록</div>
                        <div className="ApproverDepartmentList">
                            {departments.map(department => (
                                <div key={department}>
                                    <div className="ApproverDepartmentHeader" onClick={() => toggleDepartment(department)}>
                                        <span style={{ color: "#5869F3" }}>{expandedDepartments.includes(department) ? '∧' : '∨'}</span>
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
                                                        disabled={approverLine.includes(member) || referencerLine.includes(member)}
                                                        style={{
                                                            cursor: (approverLine.includes(member) || referencerLine.includes(member)) ? 'not-allowed' : 'pointer',
                                                            color: (approverLine.includes(member) || referencerLine.includes(member)) ? 'gray' : 'black'
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
                            <div style={{ fontWeight: 'bold' }}>결재선</div>
                            <div className="SelectBoxApproverLine">
                                <table className="SelectBoxApproverTable">
                                    <tr>
                                        <th style={{width: '70px', marginLeft: '10px'}}></th>
                                        <th>순번</th>
                                        <th>부서</th>
                                        <th>직급명</th>
                                        <th>이름</th>
                                        <th></th>
                                    </tr>
                                        {approverLine.map((approver, index) => (
                                            <tr key={approver.memberId} className="approvalItem">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMembersForRemove.includes(approver)}
                                                    onChange={() => handleMemberRemoveSelect(approver)}
                                                />
                                                <td>{index +1}</td>
                                                <td>{approver.departName}</td>
                                                <td>{approver.positionName}</td>
                                                <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{approver.name}</td>
                                                <td style={{width:'100px'}}> 
                                                    <button className="moveButton" onClick={() => moveUp(approverLine, setApproverLine, index)}>↑</button>
                                                    <button className="moveButton" onClick={() => moveDown(approverLine, setApproverLine, index)}>↓</button>
                                                </td>
                                            </tr>
                                        ))}
                                </table>
                                
                            </div>
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>참조선</div>
                            <div className="SelectBoxReferencerLine">
                            <table className="SelectBoxApproverTable">
                                    <tr>
                                        <th style={{width: '70px', marginLeft: '10px'}}></th>
                                        <th>순번</th>
                                        <th>부서</th>
                                        <th>직급명</th>
                                        <th>이름</th>
                                        <th></th>
                                    </tr>
                                        {referencerLine.map((referencer, index) => (
                                            <tr key={referencer.memberId} className="approvalItem">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMembersForRemove.includes(referencer)}
                                                    onChange={() => handleMemberRemoveSelect(referencer)}
                                                />
                                                <td>{index +1}</td>
                                                <td>{referencer.departName}</td>
                                                <td>{referencer.positionName}</td>
                                                <td style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{referencer.name}</td>
                                                <td style={{width:'100px'}}>
                                                    <button className="moveButton" onClick={() => moveUp(referencerLine, setReferencerLine, index)}>↑</button>
                                                    <button className="moveButton" onClick={() => moveDown(referencerLine, setReferencerLine, index)}>↓</button>
                                                </td>
                                            </tr>
                                        ))}
                                </table>
                                
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
        <CancelModal
            isOpen={isCancelMocalOpen}
            message={<><div>취소하시겠습니까?</div>
            <div>마지막 저장 후 수정된 내용은 저장되지 않습니다.</div></>}
            onConfirm={handleCancelClose}
            onCancel={handleCancelClose}
        />
        </>
    );

};

export default ApproverModal;