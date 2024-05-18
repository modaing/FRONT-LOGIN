import { Link, useLocation, useNavigate } from 'react-router-dom';
import ApprovalListComponent from '../../components/approvals/ApprovalListComponent';
import '../../css/approval/approval.css';
import React, { useEffect, useState, useCallback } from 'react';
import { setFg, setTitle, setPageInfo } from '../../modules/ApprovalReducer';
import { useDispatch, useSelector } from 'react-redux';
import { getApprovalsAPI, deleteApprovalAPI } from '../../apis/ApprovalAPI';
import DeleteConfirmModal from '../../components/approvals/DeleteConfirmModal';
import Pagination from '../../components/approvals/Pagination';
import { decodeJwt } from '../../utils/tokenUtils';

const initialState = {
    fg: 'given',
    title: '',
    pageInfo: { totalPages: 0, currentPage: 0 },
    approvals: [],
    loading: false,
    error: null,
};

function ApprovalList() {

    const dispatch = useDispatch();
    const approvalState = useSelector((state) => state.approval || initialState);
    const { pageInfo, fg, title, approvals, loading, error } = approvalState;
    const [localTitle, setLocalTitle] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    const memberId = decodedToken.memberId;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteApproval, setDeleteApproval] = useState(null);

    /* const [fg, setFg] = useState('given');
    const [title, setTitle] = useState('');
    const [pageInfo, setPageInfo] = useState({ totalPages: 0, currentPage : 0 }); */

    const updateQueryParams = useCallback((params) => {
        navigate(`/approvals?${params.toString()}`, { replace: true });
    }, [navigate]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const fg = params.get('fg') || 'given';
        const title = params.get('title') || '';
        const currentPage = parseInt(params.get('page'), 10) || 0;
        const direction = params.get('direction') || 'DESC';

        const shouldUpdateParams = !params.has('fg') || !params.has('page') || !params.has('title') || !params.has('direction');

        if (shouldUpdateParams) {
            updateQueryParams(new URLSearchParams({ fg: 'given', page: '0', title: '', direction: 'DESC' }));
        } else {
            const stateHasChanged = (
                approvalState.fg !== fg ||
                approvalState.title !== title ||
                approvalState.pageInfo.currentPage !== currentPage
            );
    
           if (stateHasChanged) {
                if (approvalState.fg !== fg) dispatch(setFg(fg));
                if (approvalState.title !== title) {
                    dispatch(setTitle(title));
                    setLocalTitle(title);
                }
    
                if (approvalState.pageInfo.currentPage !== currentPage) {
                    dispatch(setPageInfo({
                        totalPages: approvalState.pageInfo.totalPages,
                        currentPage: currentPage
                    }));
                }
            }else{
                dispatch(getApprovalsAPI(fg, currentPage, title, direction));
            }
                
            
        }
    }, [location.search, dispatch, updateQueryParams, approvalState.fg, approvalState.title, approvalState.pageInfo.currentPage]);

    /* useEffect(() => {
        dispatch(getApprovalsAPI(approvalState.fg, approvalState.pageInfo.currentPage, approvalState.title, 'DESC'));
    }, [dispatch, approvalState.fg, approvalState.pageInfo.currentPage, approvalState.title])
 */

    const handlePageChange = useCallback((newPage) => {
        // setPageInfo({ ...pageInfo, currentPage: newPage });
        const params = new URLSearchParams(location.search);
        params.set('page', newPage);
        // dispatch(setPageInfo({ ...state.pageInfo, currentPage : newPage}));
        //현재 페이지(...state.pageInfo)를 가져와서 currentPage로 바꿔줌
        // navigate(`/approvals?${params.toString()}`);
        updateQueryParams(params);
    }, [location.search, updateQueryParams]);

    const handleFgChange = useCallback((newFg) => {
        const params = new URLSearchParams(location.search);
        params.set('fg', newFg);
        params.set('page', '0');
        params.set('title', approvalState.title);
        params.set('direction', params.get('direction') || 'DESC');
        // navigate(`/approvals?${params.toString()}`);
        updateQueryParams(params);
        /* dispatch(setFg(newFg)); */

        // setFg(newFg);
        // setPageInfo({ totalPages: 0, currentPage : 0 });    //페이지 정보를 초기화 
    }, [location.search, approvalState.title, updateQueryParams]);

        const handleSearchChange = (e) => {
       
        // setTitle(e.target.value);           //입력된 검색어로 title 상태 업데이트
       /*  dispatch(setTitle(newTitle));
        const params = new URLSearchParams(location.search);
        params.set('title', newTitle);
        params.set('page', '0');
        navigate(`/approvals?${params.toString()}`); */
        setLocalTitle(e.target.value);
        
    };        

    const handleSearchSubmit = useCallback((e) => {
        e.preventDefault();
        const params = new URLSearchParams(location.search);
        params.set('title', localTitle);
        params.set('page', '0');
        // setPageInfo({ totalPages: 0, currentPage : 0 });        //페이지 정보 초기화
        // dispatch(setPageInfo({ totalPages : 0, currentPage : 0 }));
        // navigate(`/approvals?${params.toString()}`);
        updateQueryParams(params);
        
    }, [localTitle, location.search, updateQueryParams]);


    const handleSortDirectionChange = () => {
        const params = new URLSearchParams(location.search);
        const currentDirection = params.get("direction");
        const newDirection = currentDirection === 'ASC' ? 'DESC' : 'ASC';
        params.set("direction", newDirection);
        params.set('page', '0');
        navigate(`/approvals?${params.toString()}`);
    };

    const handleDeleteClick = (e, approvalNo) => {
        e.stopPropagation();
        setDeleteApproval(approvalNo);
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteApproval) {
            dispatch(deleteApprovalAPI(deleteApproval));
            setIsModalOpen(false);
            setDeleteApproval(null);
        }
    };

    const handleDeleteCancel = () => {
        setIsModalOpen(false);
        setDeleteApproval(null);
    };

    const sendAppListButton = {
        backgroundColor: approvalState.fg === 'given' ? '#112D4E' : 'white',
        color: approvalState.fg === 'given' ? 'white' : '#112D4E',
        border: approvalState.fg === 'given' ? 'none' : '1px solid #D5D5D5'
    };

    const tempAppListButton = {
        backgroundColor: approvalState.fg === 'tempGiven' ? '#112D4E' : 'white',
        color: approvalState.fg === 'tempGiven' ? 'white' : '#112D4E',
        border: approvalState.fg === 'tempGiven' ? 'none' : '1px solid #D5D5D5'
    };

    const receivedAppListButton = {
        backgroundColor: approvalState.fg === 'received' ? '#112D4E' : 'white',
        color: approvalState.fg === 'received' ? 'white' : '#112D4E',
        border: approvalState.fg === 'received' ? 'none' : '1px solid #D5D5D5'
    }

    const receivedRefAppListButton = {
        backgroundColor: approvalState.fg === 'receivedRef' ? '#112D4E' : 'white',
        color: approvalState.fg === 'receivedRef' ? 'white' : '#112D4E',
        border: approvalState.fg === 'receivedRef' ? 'none' : '1px solid #D5D5D5'
    }



    return (
        <>
            <main id="main" className="main">
                <div className="pagetitle">
                    <h1>{fg === 'given' || fg === 'tempGiven' ? '결재 상신함' : 
                         fg === 'received' || fg == 'receivedRef' ? '결재 수신함' 
                            : ''}</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item">전자결재</li>
                            <li className="breadcrumb-item active">{fg === 'given' || fg === 'tempGiven' ? '결재 상신 내역' :
                                                                    fg === 'received' || fg === 'receivedRef' ? '결재 수신 내역'
                                                                    : ''}</li>
                        </ol>
                        <div className="approvalBar">
                            <div className="approvalBarLeft">
                                {fg === 'given' || fg === 'tempGiven' ? (
                                    <Link to="/approvals?fg=given&page=0&title=&direction=DESC" className="ApprovalListBtn" style={sendAppListButton} onClick={() => handleFgChange('given')}>내 결재함</Link>
                               
                                ) : fg === 'received' || fg === 'receivedRef' ? (
                                    <Link to="/approvals?fg=received&page=0&title=&direction=DESC" className="ApprovalListBtn" style={receivedAppListButton} onClick={() => handleFgChange('received')}>결재 대기함</Link>
                                ) : ''}
                                {fg === 'given' || fg === 'tempGiven' ? (
                                    <Link to="/approvals?fg=tempGiven&page=0&title=&direction=DESC" className="ApprovalListBtn" style={tempAppListButton} onClick={() => handleFgChange('tempGiven')}>임시 저장함</Link>
                                ) : fg === 'received' || fg === 'receivedRef' ? (
                                    <Link to="/approvals?fg=receivedRef&page=0&title=&direction=DESC" className="ApprovalListBtn" style={receivedRefAppListButton} onClick={() => handleFgChange('receivedRef')}>수신 참조함</Link>
                                ) : ''}
                                 
                            </div>
                            <div className="approvalBarRight">
                                <form className="approvalSearch" onSubmit={handleSearchSubmit}>
                                    <div className="approvalSearchLabel">제목</div>
                                    <div className="approvalSearchInput">
                                        <input type="text" value={localTitle} onChange={handleSearchChange}></input>
                                    </div>
                                    <div className="approvalSearchBtn">
                                        <button type="submit" >검색</button>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </nav>
                    <ApprovalListComponent
                        approvals={approvals}
                        fg={fg}
                        handleDeleteClick={handleDeleteClick}
                        handleSortDirectionChange={handleSortDirectionChange}
                        loggedInUserId={memberId}
                    />
                    <Pagination 
                        totalPages={pageInfo.totalPages}
                        currentPage={pageInfo.currentPage}
                        onPageChange={handlePageChange}
                    />
                    <DeleteConfirmModal
                        isOpen={isModalOpen}
                        onConfirm={handleDeleteConfirm}
                        onCancel={handleDeleteCancel}
                    />
                </div>
            </main>

        </>
    )
}

export default ApprovalList;