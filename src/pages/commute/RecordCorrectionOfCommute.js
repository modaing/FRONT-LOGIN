import { useDispatch, useSelector } from 'react-redux';
import '../../css/commute/commute.css';
import styled from "styled-components";
import { decodeJwt } from '../../utils/tokenUtils';
import { useEffect, useState } from 'react';
import { callSelectCorrectionListAPI } from '../../apis/CommuteAPICalls';
import CorrectionItem from '../../components/commutes/CorrectionItem';
import { SET_PAGENUMBER, fetchCommuteListAsync } from '../../modules/CommuteModule';

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

    const OPTIONS = [
        { value: "2024-03", name: "2024-03" },
        { value: "2024-04", name: "2024-04" },
        { value: "2024-05", name: "2024-05" }
    ];

    const SelectBox = (props) => {
        return (
            <Select>
                {props.options.map((option) => (
                    <option
                        key={option.value}
                        value={option.value}
                        defaultValue={props.defaultValue === option.value}
                    >
                        {option.name}
                    </option>
                ))}
            </Select>
        );
    };

    /* 로그인한 유저의 토큰 복호화 */
    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    // console.log('[RecordCommute] decodedToken : ', decodedToken);
    const memberId = decodedToken.memberId;
    // console.log('[RecordCommute] memberId : ', memberId);

    const [date, setDate] = useState(new Date());

    /* UTC 기준 날짜 반환으로 한국 표준시보다 9시간 빠른 날짜가 표시 되는 문제 해결 */
    let offset = date.getTimezoneOffset() * 60000;      // ms 단위이기 때문에 60000 곱해야함
    let dateOffset = new Date(date.getTime() - offset); // 한국 시간으로 파싱
    let parsingDateOffset = dateOffset.toISOString().slice(0, 10);

    console.log('utc 변환 ', parsingDateOffset);

    /* 출퇴근 정정 내역 액션 */
    const result = useSelector(state => state.commuteReducer);
    console.log('[RecordCorrectionOfCommute] result : ', result);

    // const { commute, correction } = result || {};
    const correctionlist = result.correctionlist;
    console.log('[RecordCorrectionOfCommute] correctionlist : ', correctionlist);

    const correctionList = correctionlist?.correctionlist.response.data.results.correction || [];
    const commuteList = correctionlist?.correctionlist.response.data.results.commute || [];
    console.log('[RecordCorrectionOfCommute] correctionList : ', correctionList);
    console.log('[RecordCorrectionOfCommute] commuteList : ', commuteList);

    const pageInfo = correctionlist?.correctionlist.response.data.results || [];
    console.log('[RecordCorrectionOfCommute]  pageInfo : ', pageInfo);
    const { currentPage, totalItems, totalPages } = pageInfo || {};

    // const { submitPage } = useSelector(state => state.commuteReducer.correctionlist);
    // const { currentPage, totalItems, totalPages } = submitPage || {};
    // console.log('[출퇴근 정정 내역] submitPage : ', submitPage);

    const page = 0;
    const size = 10;
    const sort = 'corrNo';
    const direction = 'DESC';

    // const target = memberId;
    // const targetValue = 'member';

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
        console.log('[useEffect] parsingDateOffset : ', parsingDateOffset);
        dispatch(callSelectCorrectionListAPI(memberId, page, size, sort, direction, parsingDateOffset));
    }, [memberId, parsingDateOffset]);

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
                        <SelectBox options={OPTIONS} defaultValue="2024-05"></SelectBox>
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
                                            key={item.corrNo}
                                            correction={item}
                                            commute={commuteList}
                                            tableStyles={tableStyles}
                                            evenRow={index % 2 === 0}
                                            date={parsingDateOffset}
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