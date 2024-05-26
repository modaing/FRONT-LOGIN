import React, { useEffect, useState } from "react";
import '../../css/commute/commute.css';
import '../../css/common.css';
import { LocalizationProvider, PickersActionBar, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'boxicons/css/boxicons.css';
import 'remixicon/fonts/remixicon.css';
import '../../style.css';

dayjs.extend(utc);
dayjs.extend(timezone);

const InsertCorrectionModal = ({ commute, isOpen, onClose, onSave, date, startWork, endWork }) => {

    // console.log('정정 요청 날짜 : ', date);
    // console.log('기존 출근 시간 : ', startWork);
    // console.log('기존 퇴근 시간 : ', endWork);
    console.log('commute번호 : ', commute.commuteNo);

    const [corrStartWork, setCorrStartWork] = useState(null);
    const [corrEndWork, setCorrEndWork] = useState(null);
    const [reason, setReason] = useState('');
    const [isInputClicked, setIsInputClicked] = useState(false);
    const [showTimeErrorMessage, setShowTimeErrorMessage] = useState(false);
    const [showReasonErrorMessage, setShowReasonErrorMessage] = useState(false);

    const handleSave = () => {

        if (!reason && !corrStartWork && !corrEndWork) {
            setShowReasonErrorMessage(true);
            setShowTimeErrorMessage(true);
            return;
        };

        if (!reason) {
            setShowReasonErrorMessage(true);
            return;
        };

        if (!corrStartWork && !corrEndWork) {
            setShowTimeErrorMessage(true);
            return;
        };

        const koreaStartTime = corrStartWork ? parseTime(corrStartWork) : null;
        const koreaEndTime = corrEndWork ? parseTime(corrEndWork) : null;

        onSave({
            commuteNo: commute.commuteNo,
            corrStartWork: koreaStartTime,
            corrEndWork: koreaEndTime,
            reason: reason
        });
        onClose();
    };

    const resetModal = () => {
        setCorrStartWork(null);
        setCorrEndWork(null);
        setReason('');
        setShowTimeErrorMessage(false);
        setShowReasonErrorMessage(false);
    };


    useEffect(() => {
        if (isOpen) {
            resetModal();
        }
    }, [isOpen]);

    /* 날짜 데이터 파싱 */
    const parseDate = (dateData) => {
        if (Array.isArray(dateData)) {
            return dayjs(new Date(dateData[0], dateData[1] - 1, dateData[2])).format('YYYY-MM-DD');
        } else {
            return dateData;
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
        isOpen && (
            <div className="modal fade show" style={{ display: 'block', zIndex: 1 }}>
                <div className="modal-dialog" style={{ padding: '0px' }}>
                    <div className="modal-content" style={{ padding: '25px', width: '550px' }}>
                        <div className="modal-header" style={{ paddingBottom: '20px', paddingTop: '0px' }}>
                            <h5 className="modal-title">출퇴근 정정 등록</h5>
                            <button type="button" onClick={resetModal} style={{ background: '#ffffff', color: '#000000', paddingLeft: '20px', cursor: 'pointer' }}><i className="bi bi-arrow-counterclockwise"></i></button>
                            <button type="button" className="btn-close" onClick={onClose} style={{ backgroundColor: '#ffffff', cursor: 'pointer' }}></button>
                            {/* 시간 새로고침 안됨! 추후 해결해야 할 것 */}
                        </div>
                        <div className="modal-body" style={{ paddingTop: '30px', paddingBottom: '20px' }}>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '180px' }}>정정 대상 일자</h6>
                                <h6 style={{ textAlign: 'center' }}>{parseDate(date)}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '200px' }}>기존 출근 시간</h6>
                                <h6>{startWork}</h6>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '200px' }}>기존 퇴근 시간</h6>
                                <h6>{endWork}</h6>
                            </div>
                            {showTimeErrorMessage && (
                                <h6 style={{ color: 'red', marginTop: '10px', fontSize: '15px', marginBottom: '14px', textAlign: 'left' }}>
                                    정정 요청할 시간을 입력해주세요!
                                </h6>
                            )}
                            {/* {(!corrStartWork && !corrEndWork) && (
                                <h6 style={{ color: 'red', marginTop: '10px', fontSize: '15px', marginBottom: '14px', textAlign: 'left' }}>
                                    정정 요청 출근 시간 또는 정정 요청 퇴근 시간을 입력해주세요!
                                </h6>
                            )} */}
                            <div style={{ display: 'flex', marginBottom: '0px' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '20px', marginBottom: '0px', width: '150px' }}>정정 요청 출근 시간</h6>
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
                            {endWork &&
                                <div style={{ display: 'flex', marginBottom: '0px' }}>
                                    <h6 style={{ fontWeight: 'bold', marginRight: '20px', marginBottom: '0px', width: '150px' }}>정정 요청 퇴근 시간</h6>
                                    <div className="form-group" style={{ marginBottom: '0px' }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimePicker
                                                label="정정 요청 퇴근 시간"
                                                onChange={(e) => {
                                                    setCorrEndWork(e);
                                                    setShowTimeErrorMessage(false);
                                                }}
                                                format="HH:mm"
                                                TimePicker={corrEndWork}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                            }
                            {/* <div style={{ display: 'flex', marginBottom: '0px' }}>
                                <h6 style={{ fontWeight: 'bold', marginRight: '20px', marginBottom: '0px', width: '150px' }}>정정 요청 퇴근 시간</h6>
                                <div className="form-group" style={{ marginBottom: '0px' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            label="정정 요청 퇴근 시간"
                                            onChange={(e) => {
                                                setCorrEndWork(e);
                                                setShowTimeErrorMessage(false);
                                            }}
                                            format="HH:mm"
                                            TimePicker={corrEndWork}
                                            onBlur={e => this.focusOut(e.target.value)}
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div> */}
                            <div>
                                <h6 style={{ fontWeight: 'bold', textAlign: 'left', paddingBottom: '10px' }}>정정 사유
                                    {showReasonErrorMessage && (
                                        <h6 style={{ color: 'red', marginTop: '10px', fontSize: '15px', marginBottom: '0px' }}>
                                            정정 사유를 입력해주세요!
                                        </h6>
                                    )}
                                    {/* {!reason && (
                                        <h6 style={{ color: 'red', marginTop: '10px', fontSize: '15px', marginBottom: '0px' }}>
                                            정정 사유를 입력해주세요!
                                        </h6>
                                    )} */}
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
                            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ backgroundColor: '#FFFFFF', border: '1px solid #D5D5D5', color: '#000000' }}>
                                취소
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={handleSave} style={{ backgroundColor: '#3F72AF', border: '1px solid #3F72AF' }}>
                                등록
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default InsertCorrectionModal;