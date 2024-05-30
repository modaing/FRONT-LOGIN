import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { callInsertNewCorrectionAPI } from "../../apis/CommuteAPICalls";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

const NewCommuteAndCorrection = ({ commuteList, isOpen, onClose, parsingDateOffset, memberId }) => {

    console.log('commuteList', commuteList);
    console.log('parsingDateOffset', parsingDateOffset);

    const dispatch = useDispatch();

    const [workingDate, setWorkingDate] = useState(null);
    const [corrStartWork, setCorrStartWork] = useState(null);
    const [corrEndWork, setCorrEndWork] = useState(null);
    const [reason, setReason] = useState('');
    const [isInputClicked, setIsInputClicked] = useState(false);
    const [showDateErrorMessage, setShowDateErrorMessage] = useState(false);
    const [showTimeErrorMessage, setShowTimeErrorMessage] = useState(false);
    const [showReasonErrorMessage, setShowReasonErrorMessage] = useState(false);

    const isFormValid = () => {
        let isValid = true;

        if (!workingDate) {
            setShowDateErrorMessage(true);
            isValid = false;
        } else {
            setShowDateErrorMessage(false);
        }

        if (!corrStartWork || !corrEndWork) {
            setShowTimeErrorMessage(true);
            isValid = false;
        } else {
            setShowTimeErrorMessage(false);
        }

        if (!reason) {
            setShowReasonErrorMessage(true);
            isValid = false;
        } else {
            setShowReasonErrorMessage(false);
        }

        return isValid;
    };

    const handleSave = () => {

        if (isFormValid()) {

            const koreaStartTime = parseTime(corrStartWork);
            const koreaEndTime = parseTime(corrEndWork);

            console.log('parsingDateOffset', parsingDateOffset);

            let newCorrection = {
                memberId: memberId,
                workingDate: parseDate(workingDate),
                reqStartWork: koreaStartTime,
                reqEndWork: koreaEndTime,
                corrRegistrationDate: parsingDateOffset,
                corrStatus: '대기',
                reasonForCorr: reason
            };

            console.log('workingDate', workingDate);
            console.log('parseDate(workingDate)', parseDate(workingDate));
            console.log('koreaStartTime', koreaStartTime);
            console.log('koreaEndTime', koreaEndTime);
            console.log('parsingDateOffset', parsingDateOffset);

            dispatch(callInsertNewCorrectionAPI(newCorrection));
            // handleCorrectionRegistered();
            onClose();
        }
    };

    const resetModal = () => {
        setCorrStartWork(null);
        setCorrEndWork(null);
        setReason('');
        setShowTimeErrorMessage(false);
        setShowReasonErrorMessage(false);
        setShowDateErrorMessage(false);
    };


    useEffect(() => {
        if (isOpen) {
            resetModal();
        }
    }, [isOpen]);

    const shouldDisableDate = (date) => {
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        return commuteList.some((commute) => commute.workingDate === formattedDate);
    };
    

    /* 날짜 데이터 파싱 */
    const parseDate = (date) => {
        if (date) {
            return dayjs(date).tz('Asia/Seoul').format('YYYY-MM-DD');
        } else {
            return null;
        }
    };

    /* 시간 데이터 파싱 */
    const parseTime = (time) => {
        if (time) {
            return dayjs(time).tz('Asia/Seoul').format('HH:mm');
        } else {
            return '';
        }
    };

    return (
        <div className="modal fade show" style={{ display: 'block', zIndex: 999, color: '#000000' }}>
            <div className="modal-dialog" style={{ padding: '0px' }}>
                <div className="modal-content" style={{ padding: '25px', width: '550px' }}>
                    <div className="modal-header" style={{ paddingBottom: '20px', paddingTop: '0px' }}>
                        <h5 className="modal-title">출퇴근 정정 등록</h5>
                        {/* <button type="button" onClick={resetModal} style={{ background: '#ffffff', color: '#000000', paddingLeft: '20px', cursor: 'pointer' }}><i className="bi bi-arrow-counterclockwise"></i></button> */}
                        {/* 시간 새로고침은 되는데 화면에 반영안됨!! */}
                    </div>
                    <div className="modal-body" style={{ paddingTop: '30px', paddingBottom: '20px' }}>
                    <p style={{color: 'blue'}}>* 출퇴근 미입력 후 지나간 날짜만 등록해주세요.</p>
                        {showDateErrorMessage && (
                            <h6 style={{ color: 'red', marginTop: '10px', fontSize: '15px', marginBottom: '14px', textAlign: 'left' }}>
                                정정 요청 날짜를 입력해주세요!
                            </h6>
                        )}
                        <div style={{ display: 'flex' }}>
                            <h6 style={{ fontWeight: 'bold', marginRight: '20px', marginBottom: '0px', width: '180px', textOverflow: 'ellipsis' }}>정정 요청 대상 일자
                            </h6>
                            <div className="form-group" style={{ marginBottom: '0px' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    {/* <DemoContainer components={['DatePicker']}> */}
                                    <DatePicker
                                        label="정정 요청 대상 일자"
                                        selected={parseDate(workingDate)}
                                        format="YYYY-MM-DD"
                                        onChange={(e) => {
                                            setWorkingDate(e);
                                            setShowDateErrorMessage(false);
                                        }}
                                        // ={}
                                        // DatePicker={workingDate}
                                        maxDate={dayjs().startOf('day')}
                                        shouldDisableDate={shouldDisableDate}
                                    />
                                    {/* </DemoContainer> */}
                                </LocalizationProvider>
                            </div>
                        </div>
                        {showTimeErrorMessage && (
                            <h6 style={{ color: 'red', marginTop: '10px', fontSize: '15px', marginBottom: '14px', textAlign: 'left' }}>
                                정정 요청할 시간을 모두 입력해주세요!
                            </h6>
                        )}
                        <div style={{ display: 'flex', marginBottom: '0px' }}>
                            <h6 style={{ fontWeight: 'bold', marginRight: '20px', marginBottom: '0px', width: '180px', textOverflow: 'ellipsis' }}>정정 요청 출근 시간</h6>
                            <div className="form-group" style={{ marginBottom: '0px' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="정정 요청 출근 시간"
                                        onChange={(e) => {
                                            setCorrStartWork(e);
                                            setShowTimeErrorMessage(false);
                                        }}
                                        format="HH:mm"
                                        TimePicker={corrStartWork}
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>
                        <div style={{ display: 'flex', marginBottom: '0px' }}>
                            <h6 style={{ fontWeight: 'bold', marginRight: '20px', marginBottom: '0px', width: '180px', textOverflow: 'ellipsis' }}>정정 요청 퇴근 시간</h6>
                            <div className="form-group" style={{ marginBottom: '0px' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="정정 요청 퇴근 시간"
                                        onChange={(e) => {
                                            setCorrEndWork(e);
                                            // setShowTimeErrorMessage(false);
                                        }}
                                        format="HH:mm"
                                        TimePicker={corrEndWork}
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>
                        <div>
                            <h6 style={{ fontWeight: 'bold', textAlign: 'left', paddingBottom: '10px' }}>정정 사유
                                {showReasonErrorMessage && (
                                    <h6 style={{ color: 'red', marginTop: '10px', fontSize: '15px', marginBottom: '0px' }}>
                                        정정 사유를 반드시 입력해주세요!
                                    </h6>
                                )}
                            </h6>
                            <textarea
                                type="text"
                                value={reason}
                                className="form-control"
                                rows="3"
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setShowReasonErrorMessage(false);
                                }}
                                onFocus={() => {
                                    setIsInputClicked(true);
                                }}
                                onBlur={() => {
                                    setIsInputClicked(false);
                                }}
                                placeholder={isInputClicked === true ? '' : '30자 이내로 정정 사유를 입력해주세요.'}
                            />
                        </div>
                    </div>
                    <div className="modal-footer" style={{ paddingBottom: '0px', paddingTop: '20px' }}>
                        <button type="button" className="cancel" onClick={onClose} 
                        >
                            취소
                        </button>
                        <button type="button" className="regist" onClick={handleSave} 
                        >
                            등록
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewCommuteAndCorrection;