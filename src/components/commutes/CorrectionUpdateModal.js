import { useState } from "react";
import '../../css/commute/commute.css';
import styled from "styled-components";

function CorrectionUpdateModal({ isOpen, onClose, onSave, correction, commute }) {

    console.log('[CorrectionUpdateModal] correction.corrNo : ', correction.corrNo);

    const [selectedStatus, setSelectedStatus] = useState(correction.corrStatus);
    const [reasonForRejection, setReasonForRejection] = useState(correction.reasonForRejection || '');

    /* 반려/ 승인 렌더링 변경 */
    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    const handleRejectionReasonChange = (e) => {
        setReasonForRejection(e.target.value);
    };

    /* UTC 기준 날짜 반환으로 한국 표준시보다 9시간 빠른 날짜가 표시 되는 문제 해결 */
    const date = new Date();
    let offset = date.getTimezoneOffset() * 60000;      // ms 단위이기 때문에 60000 곱해야함
    let dateOffset = new Date(date.getTime() - offset); // 한국 시간으로 파싱
    let parsingDateOffset = dateOffset.toISOString().slice(0, 10);

    console.log('날짜 파싱 : ', parsingDateOffset);

    /* 정정 처리 */
    const handleSave = () => {
        if (selectedStatus === '승인') {
            onSave({
                corrStatus: '승인',
                reasonForRejection: '',
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
                                <h6 style={{ fontWeight: 'bold', marginRight: '215px' }}>요청자</h6>
                                {/* <h6>{commute.map((item, index) => (formatWorkingDate(item.workingDate)))}</h6> */}
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '215px' }}>소속 부서</h6>
                                {/* <h6>{commute.map((item, index) => (formatWorkingDate(item.workingDate)))}</h6> */}
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '215px' }}>정정 대상 일자</h6>
                                <h6>{commute.map((item, index) => (formatWorkingDate(item.workingDate)))}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '235px' }}>기존 출근 시간</h6>
                                <h6>{commute.map((item, index) => (formatWorkingTime(item.startWork)))}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '235px' }}>기존 퇴근 시간</h6>
                                <h6>{commute.map((item, index) => (formatWorkingTime(item.endWork)))}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '200px' }}>정정 요청 출근 시간</h6>
                                <h6>{correction.reqStartWork}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '200px' }}>정정 요청 퇴근 시간</h6>
                                <h6>{correction.reqEndWork}</h6>
                            </div>
                            <div>
                                <h6 style={{ fontWeight: 'bold', marginRight: '200px', textAlign: 'left', paddingBottom: '12px' }}>정정 사유</h6>
                                <h6 style={{ textAlign: 'left', paddingBottom: '8px' }}>{correction.reasonForCorr}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '220px' }}>정정 등록 일자</h6>
                                <h6>{formatWorkingDate(correction.corrRegistrationDate)}</h6>
                            </div>
                            <hr />
                            {correction.corrStatus === '대기' && (
                                <div style={{ display: 'flex' }}>
                                    <h6 style={{ fontWeight: 'bold', marginRight: '150px', textAlign: 'left', paddingBottom: '12px' }}>정정 상태</h6>
                                    <div>
                                        <label style={{ cursor: 'pointer', border: '1px', height: '24px', width: '90px', backgroundColor: '#00000' }}>
                                            <input
                                                type="radio"
                                                name="corrStatus"
                                                value="승인"
                                                checked={selectedStatus === '승인'}
                                                onChange={handleStatusChange}
                                                // id="select"
                                            />
                                            승인
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="corrStatus"
                                                value="반려"
                                                checked={selectedStatus === '반려'}
                                                onChange={handleStatusChange}
                                                // id="select2"
                                            />
                                            반려
                                        </label>
                                    </div>
                                </div>
                            )}
                            {selectedStatus === '반려' && (
                                <div>
                                    <h6 style={{ fontWeight: 'bold', marginRight: '200px', textAlign: 'left', paddingBottom: '12px' }}>반려 사유</h6>
                                    <textarea
                                        value={reasonForRejection}
                                        onChange={handleRejectionReasonChange}
                                        style={{ width: '100%', height: '100px' }}
                                    />
                                </div>
                            )}
                            {correction.corrStatus !== '대기' && (
                                <div>
                                    <h6 style={{ fontWeight: 'bold', marginRight: '200px', textAlign: 'left', paddingBottom: '12px' }}>정정 상태</h6>
                                    <h6>{selectedStatus === '승인' ? '승인' : '반려'}</h6>
                                </div>
                            )}
                            {correction.corrStatus === '반려' && (
                                <div>
                                    <h6>{correction.reasonForRejection}</h6>
                                </div>
                            )}
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '220px' }}>정정 처리 일자</h6>
                                <h6>{correction.corrProcessingDate ? formatWorkingDate(correction.corrProcessingDate) : ''}</h6>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ paddingBottom: '0px', paddingTop: '20px' }}>
                            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ backgroundColor: '#FFFFFF', border: '1px solid #D5D5D5', color: '#000000' }}>
                                취소
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={handleSave} style={{ backgroundColor: '#3F72AF', border: '1px solid #3F72AF' }}>
                                처리
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default CorrectionUpdateModal;