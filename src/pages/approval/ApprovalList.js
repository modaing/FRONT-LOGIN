import { Link, Route, Router } from 'react-router-dom';
import ApprovalListComponent from '../../components/approvals/ApprovalListComponent';
import '../../css/approval/approval.css';
import Pagination from '../../components/approvals/Pagination';
import { useState } from 'react';

function ApprovalList() {

    const sendAppListButton = {
        height: '40px',
        width: '120px',
        backgroundColor: '#112D4E',
        color: 'white',
        borderRadius: '5px',
        padding: '1% 1.5%',
        cursor: 'pointer',
        textDecoration: 'none',
        marginRight: '20px',
        verticalAlign: 'middle',
        textAlign: 'center',
        display: 'inline-block',
        paddingTop: '7px'
    };

    const tempAppListButton = {
        height: '40px',
        width: '120px',
        backgroundColor: 'white',
        color: '#112D4E',
        borderRadius: '5px',
        border: '1px solid #D5D5D5',
        padding: '1% 1.5%',
        cursor: 'pointer',
        textDecoration: 'none',
        verticalAlign: 'middle',
        textAlign: 'center',
        display: 'inline-block',
        paddingTop: '7px'

    }

    const [pageInfo, setPageInfo] = useState({ totalPages: 0, currentPage : 0 });
    
    const handlePageChange = (newPage) =>{
        setPageInfo({ ...pageInfo, currentPage: newPage });
    };


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
                                <Link to="/ApprovalList" className="ApprovalListBtn" style={sendAppListButton}>내 결재함</Link>
                                <Link to="/tempApprovalList" className="ApprovalListBtn" style={tempAppListButton}>임시 저장함</Link>
                            </div>
                            <div className="approvalBarRight">
                                <div className="approvalSearch">
                                    <div className="approvalSearchLabel">제목</div>
                                    <div className="approvalSearchInput">
                                        <input type="text"></input>
                                    </div>
                                    <div className="approvalSearchBtn">
                                        <button type="submit">검색</button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <ApprovalListComponent pageInfo={pageInfo} setPageInfo={setPageInfo}/>
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