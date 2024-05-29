import '../../css/commute/commute.css';
import '../../css/common.css';

function CorrectionDetailModal({ isOpen, onClose, correction }) {

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
            <div className="modal fade show" style={{ display: 'block'}}>
                <div className="modal-dialog" style={{ padding: '0px' }}>
                    <div className="modal-content" style={{ padding: '25px', width: '550px' }}>
                        <div className="modal-header" style={{ paddingBottom: '20px', paddingTop: '0px' }}>
                            <h5 className="modal-title">출퇴근 정정 등록 내역</h5>
                            <button type="button" className="btn-close" onClick={onClose} style={{ backgroundColor: '#ffffff', cursor: 'pointer' }}></button>
                        </div>
                        <div className="modal-body" style={{ paddingTop: '30px', paddingBottom: '20px' }}>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '215px' }}>정정 대상 일자</h6>
                                <h6>{formatWorkingDate(correction.workingDate)}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '235px' }}>기존 출근 시간</h6>
                                <h6>{formatWorkingTime(correction?.startWork)}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '235px' }}>기존 퇴근 시간</h6>
                                <h6>{formatWorkingTime(correction?.endWork)}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '200px' }}>정정 요청 출근 시간</h6>
                                <h6>{correction?.reqStartWork}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '200px' }}>정정 요청 퇴근 시간</h6>
                                <h6>{correction?.reqEndWork}</h6>
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
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '280px' }}>정정 상태</h6>
                                <h6>{correction.corrStatus}</h6>
                            </div>
                            <div>
                                <h6 style={{ fontWeight: 'bold', marginRight: '200px', textAlign: 'left', paddingBottom: '12px' }}>반려 사유</h6>
                                <h6 style={{ textAlign: 'left', paddingBottom: '8px' }}>
                                    {correction.reasonForRejection ? correction.reasonForRejection : ''}
                                </h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '220px' }}>정정 처리 일자</h6>
                                <h6>{correction.corrProcessingDate ? formatWorkingDate(correction.corrProcessingDate) : ''}</h6>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ paddingBottom: '0px', paddingTop: '20px' }}>
                            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ backgroundColor: '#ffffff', border: '2px solid #D9D9D9', color: '#000000' }}>
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default CorrectionDetailModal;