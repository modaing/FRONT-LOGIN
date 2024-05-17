import { Link, useLocation, useNavigate } from 'react-router-dom';
import ApprovalListComponent from '../../components/approvals/ApprovalListComponent';
import '../../css/approval/approval.css';
import { useEffect, useReducer, useSate } from 'react';
import approvalReducer, { setFg, setTitle, setPageInfo } from '../../modules/ApprovalReducer';

const initialState = {
    fg: 'given',
    title: '',
    pageInfo: { totalPages: 0, currentPage: 0 },
    approvals: [],
    error: null,
};

function ApprovalList() {

    const [state, dispatch] = useReducer(approvalReducer, initialState);

    /* const [fg, setFg] = useState('given');
    const [title, setTitle] = useState('');
    const [pageInfo, setPageInfo] = useState({ totalPages: 0, currentPage : 0 }); */

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const fg = params.get('fg') || 'given';
        const title = params.get('title') || '';
        const currentPage = parseInt(params.get('page'), 10) || 0;


        if (!params.has('fg') || !params.has('page') || !params.has('title') || !params.has('direction')) {
            navigate('/approvals?fg=given&page=0&title=&direction=DESC', { replace: true });
        } else {
            dispatch(setFg(fg));
            dispatch(setTitle(title));

            dispatch(setPageInfo({
                totalPages: state.pageInfo.totalPages,
                currentPage: currentPage
                // totalPages: state.pageInfo.totalPages

            }));
        }

    }, [location.search, navigate]);

    const handlePageChange = (newPage) => {
        // setPageInfo({ ...pageInfo, currentPage: newPage });
        const params = new URLSearchParams(location.search);
        params.set('page', newPage);
        // dispatch(setPageInfo({ ...state.pageInfo, currentPage : newPage}));
        //현재 페이지(...state.pageInfo)를 가져와서 currentPage로 바꿔줌
        navigate(`/approvals?${params.toString()}`);
    };

    const handleFgChange = (newFg) => {
        const params = new URLSearchParams(location.search);
        params.set('fg', newFg);
        params.set('page', '0');
        params.set('title', state.title);
        params.set('direction', params.get('direction') || 'DESC');
        navigate(`/approvals?${params.toString()}`);
        dispatch(setFg(newFg));

        // setFg(newFg);
        // setPageInfo({ totalPages: 0, currentPage : 0 });    //페이지 정보를 초기화 
    };

    const handleSearchChange = (e) => {
        // setTitle(e.target.value);           //입력된 검색어로 title 상태 업데이트
        dispatch(setTitle(e.target.value));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(location.search);
        params.set('title', state.title);
        params.set('page', '0');
        // setPageInfo({ totalPages: 0, currentPage : 0 });        //페이지 정보 초기화
        // dispatch(setPageInfo({ totalPages : 0, currentPage : 0 }));
        navigate(`/approvals?${params.toString()}`);

    };


    const sendAppListButton = {
        backgroundColor: state.fg === 'given' ? '#112D4E' : 'white',
        color: state.fg === 'given' ? 'white' : '#112D4E',
        border: state.fg === 'given' ? 'none' : '1px solid #D5D5D5'
    };

    const tempAppListButton = {
        backgroundColor: state.fg === 'tempGiven' ? '#112D4E' : 'white',
        color: state.fg === 'tempGiven' ? 'white' : '#112D4E',
        border: state.fg === 'tempGiven' ? 'none' : '1px solid #D5D5D5'
    }




    return (
        <>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>결재 상신함</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item">전자결재</li>
                            <li className="breadcrumb-item active">결재 상신 내역</li>
                        </ol>
                        <div className="approvalBar">
                            <div className="approvalBarLeft">
                                <Link to="/approvals?fg=given&page=0&title=&direction=DESC" className="ApprovalListBtn" style={sendAppListButton} onClick={() => handleFgChange('given')}>내 결재함</Link>
                                <Link to="/approvals?fg=tempGiven&page=0&title=&direction=DESC" className="ApprovalListBtn" style={tempAppListButton} onClick={() => handleFgChange('tempGiven')}>임시 저장함</Link>
                            </div>
                            <div className="approvalBarRight">
                                <div className="approvalSearch">
                                    <div className="approvalSearchLabel">제목</div>
                                    <div className="approvalSearchInput">
                                        <input type="text" value={state.title} onChange={handleSearchChange}></input>
                                    </div>
                                    <div className="approvalSearchBtn">
                                        <button type="submit" onClick={handleSearchSubmit}>검색</button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <ApprovalListComponent
                        key={`${state.fg}-${state.title}-${state.pageInfo.currentPage}`}
                        pageInfo={state.pageInfo}
                        setPageInfo={(info) => dispatch(setPageInfo(info))}
                        fg={state.fg}
                        title={state.title}
                    />
                    {/* <Pagination 
                        totalPages={pageInfo.totalPages}
                        currentPage={pageInfo.currentPage}
                        onPageChange={handlePageChange}
                    /> */}
                </div>
            </main>

        </>
    )
}

export default ApprovalList;