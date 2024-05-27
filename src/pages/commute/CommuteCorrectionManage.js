import styled from "styled-components";
import { decodeJwt } from "../../utils/tokenUtils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callSelectCorrectionListAPI } from "../../apis/CommuteAPICalls";
import { SET_PAGENUMBER } from "../../modules/CommuteModule";
import CorrectionManageItem from "../../components/commutes/CorrectionManageItem";

function CommuteCorrectionManage() {

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

    /* 액션 */
    // const result = useSelector(state => state.commuteReducer);
    // const correctionlist = result.correctionlist;

    // const pageInfo = correctionlist?.correctionlist.response.data.results || [];
    // const { currentPage, totalItems, totalPages } = pageInfo || {};

    // const correctionList = correctionlist?.correctionlist.response.data.results.correction || [];
    // const commuteList = correctionlist?.correctionlist.response.data.results.commute || [];
    // // const memberList = correctionlist?.correctionlist.reponse.data.results.member || [];
    // // const departList = correctionlist?.correctionlist.response.data.results.depart || [];

    // const result = useSelector(state => state.commuteReducer.correctionlist || []);
    // const correctionlist = result.correctionlist.response || {};

    // const pageInfo = correctionlist?.data.results || [];
    // const { currentPage, totalItems, totalPages } = pageInfo || {};

    // const correctionList = correctionlist?.data.results.correction || [];
    // const commuteList = correctionlist?.data.results.commute || [];
    // const memberList = correctionlist?.data.results.member || [];
    // const departList = correctionlist?.data.results.depart || [];

    // const result = useSelector((state) => state.commuteReducer.correctionlist.correctionlist || {});
    // const { currentPage, totalItems, totalPages, data = [] } = result.response || {};
    // const { correction: correctionList = [], commute: commuteList = [], member: memberList = [], depart: departList = [] } = data || {};

    const result = useSelector((state) => state.commuteReducer.correctionlist || {});
    const correctionlist = result?.correctionlist?.response?.data?.results || [];
    const correctionList = correctionlist?.result || [];
    const { currentPage, totalItems, totalPages } = correctionlist || {};
    // const { response = {} } = result.correctionlist || {};
    // const { data = { results: { correction: [], commute: [], member: [], depart: [] } } } = response || {};
    // const { results = { correction: [], commute: [], member: [], depart: [] } } = data || {};
    // const { currentPage = 0, totalItems = 0, totalPages = 0, correction: correctionList = [], commute: commuteList = [], member: memberList = [], depart: departList = [] } = results || {};

    console.log('[CommuteCorrectionManage] result : ', result);
    console.log('[CommuteCorrectionManage] correctionlist : ', correctionlist);
    console.log('[CommuteCorrectionManage] correctionList : ', correctionList);

    const dispatch = useDispatch();

    const [date, setDate] = useState(new Date());

    /* UTC 기준 날짜 반환으로 한국 표준시보다 9시간 빠른 날짜가 표시 되는 문제 해결 */
    let offset = date.getTimezoneOffset() * 60000;      // ms 단위이기 때문에 60000 곱해야함
    let dateOffset = new Date(date.getTime() - offset); // 한국 시간으로 파싱
    let parsingDateOffset = dateOffset.toISOString().slice(0, 10);

    console.log('utc 변환 ', parsingDateOffset);

    const memberId = null;
    const page = 0;
    const size = 10;
    const sort = 'corrNo';
    const direction = 'DESC';

    /* 출퇴근 정정 내역 API 호출 */
    useEffect(() => {
        dispatch(callSelectCorrectionListAPI(memberId, page, size, sort, direction, parsingDateOffset));
    }, [parsingDateOffset]);

    /* 근무 일자 형식 변경 */
    const formatWorkingDate = (workingDate) => {
        const date = new Date(workingDate);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

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
                        <li className="breadcrumb-item active">출퇴근 정정 관리</li>
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
                                    <th style={tableStyles.tableHeaderCell} scope="col">요청자</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">소속 부서</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">정정 사유</th>
                                    <th style={tableStyles.tableHeaderCell} scope="col">정정 상태</th>
                                </tr>
                            </thead>
                            <tbody>
                                {correctionList && correctionList.length > 0 ? (
                                    correctionList.map((item, index) => (
                                        <CorrectionManageItem
                                            key={item.corrNo}
                                            correction={item}
                                            tableStyles={tableStyles}
                                            evenRow={index % 2 === 0}
                                            date={parsingDateOffset}
                                            style={{ zIndex: '1' }}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5}>출퇴근 정정 관리 내역이 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <nav >
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

export default CommuteCorrectionManage;

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