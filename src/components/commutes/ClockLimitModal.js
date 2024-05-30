import '../../css/commute/commute.css';
import '../../css/common.css';

const ClockLimitModal = ({ isOpen, onClose, parsingDateOffset }) => {

    console.log('parsingDateOffset : ',parsingDateOffset);

    return (
        isOpen && (
            <div className="modal fade show" style={{ display: 'block' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" style={{ color: '#112D4E' }}>출퇴근 하기</h5>
                        </div>
                        <div className="modal-body">
                            <div style={{ color: '#112D4E' }}><h6><span style={{ fontWeight: 'bold', marginRight: '80px' }} >대상 일자</span> {parsingDateOffset}</h6></div>
                            <br />
                            <h6 style={{ color: '#112D4E' }}>오늘은 이미 출근하셨습니다.</h6>
                        </div>
                        <div className="modal-footer">
                            <button onClick={onClose}

                            className="btn-negative"
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default ClockLimitModal;