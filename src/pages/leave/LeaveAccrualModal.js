import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector, useDispatch } from 'react-redux';
import { callSelectMemberList } from '../../apis/LeaveAPICalls';
import LeaveCheckModal from './LeaveCheckModal';
import '../../css/leave/LeaveAccrualModal.css';
import { formattedLocalDate } from '../../utils/leaveUtil';

const LeaveAccrualModal = ({ isOpen, onClose, onSave }) => {
    const { memberList } = useSelector(state => state.leaveReducer);
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [start, setStart] = useState();
    const [end, setEnd] = useState();
    const [days, setDays] = useState('');
    const [reason, setReason] = useState('');
    const [etcReason, setEtcReason] = useState('');
    const [isCheckOpen, setIsCheckOpen] = useState(false);
    const { leaveDaysCalc } = formattedLocalDate({ leaveSubStartDate: start, leaveSubEndDate: end })

    const dispatch = useDispatch();

    const handleValidation = () => {
        if (!name || !id) {
            alert('발생 대생자의 이름 또는 사번이 유효하지 않습니다.')
            return;
        }

        if (!days || days < 0) {
            alert('발생 일수가 유효하지 않습니다.');
            return;
        }

        if (!reason) {
            alert('발생 사유가 입력되지 않았습니다.')
            return;
        }

        setIsCheckOpen(true)
    }

    const handleSave = () => {
        const AccReason = reason === '기타' ? etcReason : reason;
        onSave({ id, start, end, days, AccReason });
        setIsCheckOpen(false)
        onClose();
    };

    const resetModal = () => {
        setId('');
        setName('');
        setStart();
        setEnd();
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

            dispatch(callSelectMemberList(name));
        }
    }, [name]);

    // 모달이 열릴 때 초기화
    useEffect(() => {
        if (isOpen) {
            resetModal();
        }
    }, [isOpen]);

    useEffect(() => {
        if (reason !== '기타') {
            setEtcReason('');
        }
    }, [reason]);

    useEffect(() => {
        (start > end) && setEnd('')
        if (start && end) {
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDays(diffDays);
        }
    }, [start, end]);

    useEffect(() => {
        setDays(leaveDaysCalc);
    }, [leaveDaysCalc]);

    return (
        isOpen && (
            <div className="modal fade show" style={{ display: 'block' }}>
                <>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">휴가 발생</h5>
                            </div>
                            <div className="modal-body">

                                <div className="leaveAccrual"><label>사원명</label><input type="text" value={name} onChange={e => setName(e.target.value)} className="form-control" /></div>

                                <div className="leaveAccrual">
                                    <label>사번</label>
                                    <select value={id} onChange={handleSelectChange} className="form-select">

                                        <option value="">사번 선택</option>
                                        {memberList && memberList.map((member) => (
                                            <option key={member.memberId} value={member.memberId}>
                                                {`${member.memberId} ${member.department} ${member.name}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>발생 기간</label>
                                    <div className='dateFlex'>
                                        <DatePicker selected={start} onChange={e => setStart(e)} dateFormat="yyyy-MM-dd" className="form-control" />
                                        <DatePicker selected={end} onChange={e => setEnd(e)} dateFormat="yyyy-MM-dd" className="form-control" />
                                    </div>
                                </div>
                                <div className="leaveAccrual"><label>발생 일수</label><input type="number" value={days} onChange={e => setDays(e.target.value)} className="form-control" disabled /></div>


                                <div className="leaveAccrual">
                                    <label>사유</label>
                                    <select value={reason} onChange={e => setReason(e.target.value)} className="form-select">
                                        {!reason && <option value="">사유 선택</option>}
                                        <option value="공가">공가</option>
                                        <option value="경조사">경조사</option>
                                        <option value="예비군">예비군</option>
                                        <option value="기타">기타</option>
                                    </select>
                                </div>
                                {reason === '기타'
                                    &&
                                    <input className="form-control" placeholder="기타 사유를 입력해주세요" type='text' value={etcReason} onChange={e => setEtcReason(e.target.value)} />
                                }
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-negative" onClick={onClose}>취소</button>
                                <button type="button" className="btn btn-positive" onClick={handleValidation}>등록</button>
                            </div>
                        </div>
                    </div>
                    <LeaveCheckModal isOpen={isCheckOpen} onClose={setIsCheckOpen} onConfirm={handleSave} option='등록' />
                </>
            </div>
        )
    );
};

export default LeaveAccrualModal;