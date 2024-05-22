import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { callSelectMemberList } from '../../apis/LeaveAPICalls';
import '../../css/leave/LeaveAccrualModal.css';

const LeaveAccrualModal = ({ isOpen, onClose, onSave }) => {
    const { memberList } = useSelector(state => state.leaveReducer);
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [days, setDays] = useState('');
    const [reason, setReason] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    
    const handleSave = () => {
        onSave({ id, days, reason });
        onClose();
    };

    const resetModal = () => {
        setId('');
        setName('');
        setDays('');
        setReason('');
    };

    const handleSelectChange = e => {
        const selectedId = e.target.value;
        const selectedMember = memberList.find(member => member.memberId == selectedId);
        if (selectedMember) {
            setId(selectedMember.memberId);
            setName(selectedMember.name);
        }
    };
    
    useEffect(() => {
        if (name) {
            setIsLoading(true);
            dispatch(callSelectMemberList(name)).finally(() => setIsLoading(false));
        }
    }, [name]);

    // 모달이 열릴 때 초기화
    useEffect(() => {
        if (isOpen) {
            resetModal();
        }
    }, [isOpen]);

    return (
        isOpen && (
            <div className="modal fade show" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">휴가 발생</h5>
                        </div>
                        <div className="modal-body">

                            <div className="leaveAccrual"><label>사원명</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="form-control" /></div>

                            <div className="leaveAccrual">
                                <label>사번</label>
                                <select value={id} onChange={handleSelectChange}  className="form-select">
                                    {isLoading ? (
                                        <option value="">로딩중...</option>
                                    ) : (
                                        <>
                                        <option value="">사번 선택</option>
                                            {memberList && memberList.map((member) => (
                                                <option key={member.memberId} value={member.memberId}>
                                                    {`${member.memberId} ${member.department} ${member.name}`}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            </div>

                            <div className="leaveAccrual"><label>발생 일수</label><input type="number" value={days} onChange={e => setDays(e.target.value)} className="form-control" /></div>

                            <label>발생 사유</label>
                            <textarea type="text" value={reason} onChange={e => setReason(e.target.value)} className="form-control" rows="3" />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>취소</button>
                            <button type="button" className="btn btn-primary" onClick={handleSave}>등록</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default LeaveAccrualModal;