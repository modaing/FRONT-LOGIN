import { Link, Route, Router } from 'react-router-dom';
import ApprovalListComponent from '../../components/approvals/ApprovalListComponent';
import '../../css/approval/approval.css';
import Pagination from '../../components/approvals/Pagination';
import { useState } from 'react';

function ApprovalList() {

    const [fg, setFg] = useState('given');
    const [title, setTitle] = useState('');
    const [pageInfo, setPageInfo] = useState({ totalPages: 0, currentPage : 0 });

    const handlePageChange = (newPage) =>{
        setPageInfo({ ...pageInfo, currentPage: newPage });
    };

    const handleFgChange = (newFg) => { 
        setFg(newFg);
        setPageInfo({ totalPages: 0, currentPage : 0 });    //페이지 정보를 초기화 
    }

    const handleSearchChange = (e) => {
        setTitle(e.target.value);           //입력된 검색어로 title 상태 업데이트
    };

    const handleSearchSubmit = (e) =>{
        e.preventDefault();
        setPageInfo({ totalPages: 0, currentPage : 0 });        //페이지 정보 초기화
    }

    const sendAppListButton = {
        backgroundColor: fg === 'given' ? '#112D4E' : 'white',
        color: fg === 'given' ? 'white' : '#112D4E',
        border: fg === 'given' ? 'none' : '1px solid #D5D5D5'
    };

    const tempAppListButton = {
        backgroundColor: fg === 'tempGiven' ? '#112D4E' : 'white',
        color: fg === 'tempGiven' ? 'white' : '#112D4E',
        border: fg === 'tempGiven' ? 'none' : '1px solid #D5D5D5'
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
                                <Link to="/approvals" className="ApprovalListBtn" style={sendAppListButton} onClick={() => handleFgChange('given')}>내 결재함</Link>
                                <Link to="/approvals" className="ApprovalListBtn" style={tempAppListButton} onClick={() => handleFgChange('tempGiven')}>임시 저장함</Link>
                            </div>
                            <div className="approvalBarRight">
                                <div className="approvalSearch">
                                    <div className="approvalSearchLabel">제목</div>
                                    <div className="approvalSearchInput">
                                        <input type="text" value={title} onChange={handleSearchChange}></input>
                                    </div>
                                    <div className="approvalSearchBtn">
                                        <button type="submit" onClick={handleSearchSubmit}>검색</button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <ApprovalListComponent pageInfo={pageInfo} setPageInfo={setPageInfo} fg={fg} title={title} />
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