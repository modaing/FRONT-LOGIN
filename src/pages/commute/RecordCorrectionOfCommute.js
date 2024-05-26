import { useDispatch, useSelector } from 'react-redux';
import '../../css/commute/commute.css';
import styled from "styled-components";
import { decodeJwt } from '../../utils/tokenUtils';
import { useEffect, useState } from 'react';
import { callSelectCorrectionListAPI } from '../../apis/CommuteAPICalls';
import CorrectionItem from '../../components/commutes/CorrectionItem';
import { SET_PAGENUMBER } from '../../modules/CommuteModule';

function RecordCorrectionOfCommute() {


    const pageTitleStyle = {
        marginBottom: '20px',
        marginTop: '20px'
    };

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

    /* UTC 기준 날짜 반환으로 한국 표준시보다 9시간 빠른 날짜가 표시 되는 문제 해결 */
    const [date, setDate] = useState(new Date());
    let offset = date.getTimezoneOffset() * 60000;      // ms 단위이기 때문에 60000 곱해야함
    let dateOffset = new Date(date.getTime() - offset); // 한국 시간으로 파싱
    let parsingDateOffset = dateOffset.toISOString().slice(0, 10);
    const [month, setMonth] = useState(parsingDateOffset);

    console.log('utc 변환 ', parsingDateOffset);

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
    // console.log('[RecordCorrectionOfCommute] result : ', result);
    const correctionlist = result?.correctionlist?.correctionlist || [];
    // console.log('[RecordCorrectionOfCommute] correctionlist : ', correctionlist);
    const correctionList = correctionlist?.response?.data?.results?.result || [];
    // console.log('[RecordCorrectionOfCommute] correctionList : ', correctionList.result);
    const { currentPage, totalItems, totalPages } = correctionList || {};

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
        console.log('[useEffect] memberId : ', memberId);
        console.log('[useEffect] page : ', currentPage);
        console.log('[useEffect] month : ', month);
        dispatch(callSelectCorrectionListAPI(memberId, page, size, sort, direction, month));
    }, [memberId, month, page, dispatch]);

    /* 페이징 핸들러 */
    const handlePageChange = (page) => {
        dispatch({ type: SET_PAGENUMBER, payload: { page: page } });
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            dispatch({ type: SET_PAGENUMBER, payload: { page: currentPage - 1 } });
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            dispatch({ type: SET_PAGENUMBER, payload: { page: currentPage + 1 } });
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
                        <SelectBox options={DATEOPTIONS} value={month} onChange={handleMonthChange} style={{float: 'right'}}></SelectBox>
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
                                {correctionList.length > 0 ? (
                                    correctionList.map((item, index) => (
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