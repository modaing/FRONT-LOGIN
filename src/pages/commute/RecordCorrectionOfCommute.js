import { useDispatch, useSelector } from 'react-redux';
import '../../css/commute/commute.css';
import styled from "styled-components";
import { decodeJwt } from '../../utils/tokenUtils';
import { useEffect, useState } from 'react';
import { callSelectCorrectionListAPI } from '../../apis/CommuteAPICalls';
import CorrectionItem from '../../components/commutes/CorrectionItem';
import { SET_PAGENUMBER } from '../../modules/CommuteModule';

function RecordCorrectionOfCommute() {

    const Select = styled.select`
        margin-left: 20px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 100px;
        height: 45px;
        text-align: center;
        font-size: 20px;
        border-radius: 5px;
        border-color: #D5D5D5;
        padding: '1% 1.5%',
        cursor: 'pointer',
        margin-left: '750px',
    `;

    /* UTC 기준 날짜 반환으로 한국 표준시보다 9시간 빠른 날짜가 표시 되는 문제 해결 */
    const [date, setDate] = useState(new Date());
    let offset = date.getTimezoneOffset() * 60000;      // ms 단위이기 때문에 60000 곱해야함
    let dateOffset = new Date(date.getTime() - offset); // 한국 시간으로 파싱
    let parsingDateOffset = dateOffset.toISOString().slice(0, 10);
    const [month, setMonth] = useState(parsingDateOffset);

    // console.log('utc 변환 ', parsingDateOffset);

    const currentDate = new Date(parsingDateOffset);
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const DATEOPTIONS = [];

    for (let i = 0; i < 12; i++) {
        let month = currentMonth - i;
        let year = currentYear;

        if (month <= 0) {
            month += 12;
            year -= 1;
        }

        const monthString = `${year}-${String(month).padStart(2, '0')}`;
        DATEOPTIONS.push({
            value: `${year}-${String(month).padStart(2, '0')}-01`,
            name: monthString,
        });
    }

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    const SelectBox = (props) => {
        return (
            <Select value={props.value} onChange={props.onChange}>
                {props.options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.name}
                    </option>
                ))}
            </Select>
        );
    };

    /* 로그인한 유저의 토큰 복호화 */
    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    const memberId = decodedToken.memberId;

    /* 출퇴근 정정 내역 액션 */
    const result = useSelector(state => state.commuteReducer);
    const correctionlist = result?.correctionlist?.correctionlist || [];
    const correctionList = correctionlist?.response?.data?.results?.result || [];
    const { currentPage, totalItems, totalPages } = correctionList || {};

    const [corrStatus, setCorrStatus] = useState('all');

    const filteredCorrectionList = correctionList.filter(item => {
        if (corrStatus === 'all') return true;
        return item.corrStatus === corrStatus;
    });

    const page = 0;
    const size = 10;
    const sort = 'corrNo';
    const direction = 'DESC';
    const dispatch = useDispatch();

    /* 근무 일자 형식 변경 */
    const formatWorkingDate = (workingDate) => {
        const date = new Date(workingDate);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    /* 출퇴근 정정 내역 API 호출 */
    useEffect(() => {
        dispatch(callSelectCorrectionListAPI(memberId, page, size, sort, direction, month));
    }, [memberId, month, dispatch]);

    /* 페이징 핸들러 */
    const handlePageChange = (page) => {
        dispatch(callSelectCorrectionListAPI(memberId, page, size, sort, direction, parsingDateOffset));
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            dispatch(callSelectCorrectionListAPI(memberId, currentPage - 1, size, sort, direction, parsingDateOffset));
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            dispatch(callSelectCorrectionListAPI(memberId, currentPage + 1, size, sort, direction, parsingDateOffset));
        }
    };

    return (
        <main id="main" className="main">
            <div className="pagetitle" style={pageTitleStyle}>
                <h1>출퇴근</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">출퇴근</li>
                        <li className="breadcrumb-item active">출퇴근 정정 내역</li>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                            <Select
                                id="corrStatus"
                                value={corrStatus}
                                onChange={(e) => setCorrStatus(e.target.value)}
                            >
                                <option value="all">전체</option>
                                <option value="대기">대기</option>
                                <option value="승인">승인</option>
                                <option value="반려">반려</option>
                            </Select>
                            <SelectBox options={DATEOPTIONS} value={month} onChange={handleMonthChange} style={{ float: 'right' }}></SelectBox>
                        </div>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12">
                <div className="card">
                    <div className="content2" style={contentStyle}>
                        <table className="table table-hover" style={tableStyle}>
                            <thead>
                                <tr>
                                    <th style={tableStyles.tableHeaderCell} scope="col">정정 대상 일자</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">정정 요청 출근 시간</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">정정 요청 퇴근 시간</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">정정 등록 일자</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">정정 상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCorrectionList.length > 0 ? (
                                    filteredCorrectionList.map((item, index) => (
                                        <CorrectionItem
                                            key={item.corrRegistrationDate}
                                            correction={item}
                                            tableStyles={tableStyles}
                                            evenRow={index % 2 === 0}
                                            style={{ zIndex: '1' }}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7}>출퇴근 정정 내역이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <nav>
                            <ul className="pagination">

                                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={handlePrevPage}>◀</button>
                                </li>
                                {[...Array(totalPages).keys()].map((page, index) => (
                                    <li key={index} className={`page-item ${currentPage === page ? 'active' : ''}`} style={{ zIndex: '0' }}>
                                        <button className="page-link" onClick={() => {
                                            console.log('[page]', page);
                                            handlePageChange(page)
                                        }}>
                                            {page + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages - 1 && 'disabled'}`}>
                                    <button className="page-link" onClick={handleNextPage}>▶</button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default RecordCorrectionOfCommute;

const pageTitleStyle = {
    marginBottom: '20px',
    marginTop: '20px'
};

const contentStyle = {
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
        width: '20%',
        textAlign: 'center',
        padding: '10px',
    },
    tableCell2: {
        width: '20%',
        textAlign: 'center',
        padding: '10px',
    },
    tableCell3: {
        width: '20%',
        textAlign: 'center',
        padding: '10px',
    },
    tableCell4: {
        width: '20%',
        textAlign: 'center',
        padding: '10px',
    },
    tableCell5: {
        width: '20%',
        textAlign: 'center',
        padding: '10px',
    },
    evenRow: {
        backgroundColor: '#f9f9f9'
    }
};