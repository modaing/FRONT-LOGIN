import { useEffect, useState } from "react";
import '../../css/commute/commute.css';
import styled from "styled-components";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

function CorrectionUpdateModal({ isOpen, onClose, onSave, correction }) {

    // console.log('[CorrectionUpdateModal] correction.corrNo : ', correction.corrNo);

    const [selectedStatus, setSelectedStatus] = useState(correction?.corrStatus || null);
    const [reasonForRejection, setReasonForRejection] = useState(correction.reasonForRejection || null);
    const [corrStatus, setCorrStatus] = useState('');
    const [isInputClicked, setIsInputClicked] = useState(false);
    const [showStatusErrorMessage, setShowStatusErrorMessage] = useState(false);
    const [showReasonErrorMessage, setShowReasonErrorMessage] = useState(false);

    // /* 반려/ 승인 렌더링 변경 */
    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        setShowStatusErrorMessage(false);
    };

    const handleRejectionReasonChange = (e) => {
        setReasonForRejection(e.target.value);
        setShowReasonErrorMessage(false);

    };

    /* UTC 기준 날짜 반환으로 한국 표준시보다 9시간 빠른 날짜가 표시 되는 문제 해결 */
    const date = new Date();
    let offset = date.getTimezoneOffset() * 60000;      // ms 단위이기 때문에 60000 곱해야함
    let dateOffset = new Date(date.getTime() - offset); // 한국 시간으로 파싱
    let parsingDateOffset = dateOffset.toISOString().slice(0, 10);

    // console.log('날짜 파싱 : ', parsingDateOffset);

    /* 정정 처리 */
    const handleSave = () => {

        // if (!corrStatus && !reasonForRejection) {
        //     setShowStatusErrorMessage(true);
        //     setShowReasonErrorMessage(true);
        //     return;
        // }

        // if (!corrStatus) {
        //     setShowStatusErrorMessage(true);
        //     return;
        // }

        // if (!reasonForRejection) {
        //     setShowReasonErrorMessage(true);
        //     return;
        // }

        if (!selectedStatus) {
            setShowStatusErrorMessage(true);
            return;
        }

        if (selectedStatus === '반려' && !reasonForRejection) {
            setShowReasonErrorMessage(true);
            return;
        }

        if (selectedStatus === '승인') {
            setShowStatusErrorMessage(true);
            onSave({
                corrStatus: '승인',
                reasonForRejection: null,
                corrProcessingDate: parsingDateOffset
            });

        } else if (selectedStatus === '반려') {
            onSave({
                corrStatus: '반려',
                reasonForRejection,
                corrProcessingDate: parsingDateOffset
            });
        };
        onClose();
    };

    const resetModal = () => {
        setSelectedStatus(null);
        // setCorrStatus(null);
        setReasonForRejection(null);
        setShowStatusErrorMessage(false);
        setShowReasonErrorMessage(false);
    };

    useEffect(() => {
        if (isOpen) {
            resetModal();
        }
    }, [isOpen]);

    /* 근무 일자 형식 변경 */
    const formatWorkingDate = (workingDate) => {
        const date = new Date(workingDate);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    /* 출근시간, 퇴근시간 형식 변경 */
    const formatWorkingTime = (workingTime) => {
        if (Array.isArray(workingTime)) {

            let result = '';

            for (let i = 0; i < workingTime.length; i++) {
                const minutes = workingTime[i] % 100;
                result += `${String(minutes).padStart(2, '0')}`;

                if (i < workingTime.length - 1) {
                    result += ':';
                }
            }
            return result;
        }
        return '';
    };

    return (
        isOpen && (
            <div className="modal fade show" style={{ display: 'block', zIndex: 1 }}>
                <div className="modal-dialog" style={{ padding: '0px' }}>
                    <div className="modal-content" style={{ padding: '25px', width: '550px' }}>
                        <div className="modal-header" style={{ paddingBottom: '20px', paddingTop: '0px' }}>
                            <h5 className="modal-title">출퇴근 정정 등록 처리</h5>
                            <button type="button" className="btn-close" onClick={onClose} style={{ backgroundColor: '#ffffff', cursor: 'pointer' }}></button>
                        </div>
                        <div className="modal-body" style={{ paddingTop: '30px', paddingBottom: '20px' }}>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '290px' }}>요청자</h6>
                                <h6>{correction && correction?.name}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '270px' }}>소속 부서</h6>
                                <h6>{correction && correction?.departName}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '215px' }}>정정 대상 일자</h6>
                                <h6>{correction && formatWorkingDate(correction.workingDate)}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '237px' }}>기존 출근 시간</h6>
                                <h6>{correction && formatWorkingTime(correction.startWork)}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '237px' }}>기존 퇴근 시간</h6>
                                <h6>{correction && formatWorkingTime(correction.endWork)}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '200px' }}>정정 요청 출근 시간</h6>
                                <h6>{correction && correction?.reqStartWork}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '200px' }}>정정 요청 퇴근 시간</h6>
                                <h6>{correction && correction?.reqEndWork}</h6>
                            </div>
                            <div>
                                <h6 style={{ fontWeight: 'bold', marginRight: '200px', textAlign: 'left', paddingBottom: '12px' }}>정정 사유</h6>
                                <h6 style={{ textAlign: 'left', paddingBottom: '8px' }}>{correction && correction?.reasonForCorr}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '220px' }}>정정 등록 일자</h6>
                                <h6>{correction && formatWorkingDate(correction.corrRegistrationDate)}</h6>
                            </div>
                            <hr />
                            {correction && correction?.corrStatus === '대기' && (
                                <div style={{ display: 'flex' }}>
                                    <h6 style={{ fontWeight: 'bold', marginRight: '50px', textAlign: 'left', paddingBottom: '12px' }}>정정 상태
                                        {showStatusErrorMessage && (
                                            <h6 style={{ color: 'red', marginTop: '10px', fontSize: '15px', marginBottom: '14px', textAlign: 'left' }}>
                                                정정 상태를 선택해주세요!
                                            </h6>
                                        )}
                                    </h6>
                                    <div>
                                        <label style={{ cursor: 'pointer', border: '1px', height: '24px', width: '90px', backgroundColor: '#00000' }}>
                                            <input
                                                type="radio"
                                                name="corrStatus"
                                                value='승인'
                                                checked={selectedStatus === '승인'}
                                                // onChange={(e) => {
                                                //     setSelectedStatus(e.target.value);
                                                //     setShowStatusErrorMessage(false);
                                                // }}
                                                onChange={handleStatusChange}
                                            // id="select"
                                            />
                                            승인
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="corrStatus"
                                                value='반려'
                                                checked={selectedStatus === '반려'}
                                                // onChange={(e) => {
                                                //     setSelectedStatus(e.target.value);
                                                //     setShowStatusErrorMessage(false);
                                                // }}
                                                onChange={handleStatusChange}
                                            // id="select2"
                                            />
                                            반려
                                        </label>
                                    </div>
                                </div>
                            )}
                            {(correction?.corrStatus === '승인' || correction?.corrStatus === '반려') && (
                                <div>
                                    <h6 style={{ fontWeight: 'bold', marginRight: '0px', textAlign: 'left', paddingBottom: '12px' }}>정정 상태</h6>
                                    <h6>{correction?.corrStatus === '승인' ? '승인' : '반려'}</h6>
                                </div>
                            )}
                            {selectedStatus === '반려' && (
                                <div>
                                    <h6 style={{ fontWeight: 'bold', marginRight: '100px', textAlign: 'left', paddingBottom: '12px' }}>반려 사유
                                        {showReasonErrorMessage && (
                                            <h6 style={{ color: 'red', marginTop: '10px', fontSize: '15px', marginBottom: '0px' }}>
                                                반려 사유를 반드시 입력해주세요!
                                            </h6>
                                        )}
                                    </h6>
                                    <textarea
                                        type="text"
                                        value={reasonForRejection}
                                        onChange={handleRejectionReasonChange}
                                        style={{ width: '100%', height: '100px' }}
                                        // onChang={(e) => {
                                        //     setReasonForRejection(e.target.value);
                                        //     setShowReasonErrorMessage(false);
                                        // }}
                                        onFocus={() => {
                                            setIsInputClicked(true);
                                        }}
                                        onBlur={() => {
                                            setIsInputClicked(false);
                                        }}
                                        placeholder={isInputClicked === true ? '' : '30자 이내로 정정 사유를 입력해주세요.'}
                                    />
                                </div>
                            )}
                            {/* {correction?.corrStatus !== '대기' && (
                                <div>
                                    <h6 style={{ fontWeight: 'bold', marginRight: '0px', textAlign: 'left', paddingBottom: '12px' }}>정정 상태</h6>
                                    <h6>{selectedStatus === '승인' ? '승인' : '반려'}</h6>
                                </div>
                            )} */}
                            {correction?.corrStatus === '반려' && (
                                <div>
                                    <h6 style={{ fontWeight: 'bold', marginRight: '0px', textAlign: 'left', paddingBottom: '12px' }}>반려 사유</h6>
                                    <h6>{correction.reasonForRejection}</h6>
                                </div>
                            )}
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '220px' }}>정정 처리 일자</h6>
                                <h6>{correction && correction?.corrProcessingDate ? formatWorkingDate(correction.corrProcessingDate) : ''}</h6>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ paddingBottom: '0px', paddingTop: '20px' }}>
                            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ backgroundColor: '#FFFFFF', border: '1px solid #D5D5D5', color: '#000000' }}>
                                목록
                            </button>
                            {correction?.corrStatus === '대기' && (
                                <button type="button" className="btn btn-secondary" onClick={handleSave} style={{ backgroundColor: '#3F72AF', border: '1px solid #3F72AF' }}>
                                    처리
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default CorrectionUpdateModal;