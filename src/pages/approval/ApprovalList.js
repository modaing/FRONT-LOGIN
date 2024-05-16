import { Switch, Route, Router } from 'react-router-dom';
import ApprovalListComponent from '../../components/approvals/ApprovalListComponent';

function ApprovalList() {

    

    return (
        <>
           
                <main id="main" className="main">
                    <div className="pagetitle">
                        <h1>결재 상신함</h1>
                        <ApprovalListComponent/>
                    </div>
                </main>
            
        </>
    )
}

export default ApprovalList;