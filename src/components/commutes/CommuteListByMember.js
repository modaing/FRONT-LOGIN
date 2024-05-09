import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callCommuteListAPI } from "../../apis/CommuteAPICalls";
import CommuteItem from "./CommuteItem";

function CommuteListByMember({commute}) {

    console.log('[CommuteListByMember] commute : ', commute);

    const content2 = {
        marginLeft: '25px'

    };

    const tableStyle = {
        width: '97%',
        borderCollapse: 'collapse',
        textAlign: 'center',
    };

    const tableStyles = {
        tableHeaderCell: {
            cursor: 'pointer',
            fontWeight: 'bold',
            padding: '15px'
        },
        tableCell1: {
            width: '15%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell2: {
            width: '13%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell3: {
            width: '13%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell4: {
            width: '13%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell5: {
            width: '22%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell6: {
            width: '13%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell7: {
            width: '15%',
            textAlign: 'center',
            padding: '10px',
        },
        evenRow: {
            backgroundColor: '#f9f9f9'
        }
    };

    const insertCorrection = {
        backgroundColor: '#3F72AF',
        cursor: 'pointer',
        color: '#FFFFFF',
        borderRadius: '4px',
        border: '1px solid #3F72AF',
        '&:hover': {
            cursor: '#112D4E',
        }
    };

    const ProgressBar = ({ progress, style }) => {
        return (
            <div className="progress" style={style}>
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>
        );
    };

    return (
        <div className="col-lg-12">
            <div className="card">
                <div className="content2" style={content2}>
                    <table className="table table-hover" style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={tableStyles.tableHeaderCell} scope="col">근무일자</th>
                                <th style={tableStyles.tableHeaderCell} scope="col">총 근무 시간</th>
                                <th style={tableStyles.tableHeaderCell} scope="col">출근 시간</th>
                                <th style={tableStyles.tableHeaderCell} scope="col">퇴근 시간</th>
                                <th style={tableStyles.tableHeaderCell} scope="col">근무 시간</th>
                                <th style={tableStyles.tableHeaderCell} scope="col">근무 상태</th>
                                <th style={tableStyles.tableHeaderCell} scope="col">정정 요청</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={tableStyles.evenRow}>
                                <td style={tableStyles.tableCell1} scope="row">{commute.workingDate}</td>
                                <td style={tableStyles.tableCell2}>{commute.totalWorkingHours}</td>
                                <td style={tableStyles.tableCell3}>{commute.startWork}</td>
                                <td style={tableStyles.tableCell4}>{commute.endWork}</td>
                                <td style={tableStyles.tableCell5}><ProgressBar progress={100} /></td>
                                <td style={tableStyles.tableCell6}>{commute.workingStatus}</td>
                                <td style={tableStyles.tableCell7}><button to="/" style={insertCorrection}>정정</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CommuteListByMember;