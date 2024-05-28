import React from 'react';
import styles from '../../css/approval/ApproversInfo.module.css';
import { border } from '@mui/system';


const formatDate = (dateTimeString) => {
    if (!dateTimeString) {
        return '';
    }
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const ApproversInfo = ({ approvers }) => {
    const maxApprovers = 6;
    const filledApprover = [...approvers];

    while (filledApprover.length < maxApprovers) {
        filledApprover.push({ positionName: '', departName: '', name: '', approverDate: '' });
    }

    return (
        <>
            <table className={styles.ApproverTable}>
                <thead>
                    <tr >
                        <th style={{fontWeight: "bold", fontSize: "18px" }}>직급</th>
                        {filledApprover.map((approver, index) => (
                            <th key={index} >
                                {approver.departName}
                                <div>
                                    <span style={{ fontWeight: 'bold', fontSize:'18px'}}>{approver.name}</span> {approver.positionName}
                                </div>

                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr style={{fontWeight: "bold", fontSize: "18px" }}>
                        <td>승인일자</td>
                        {filledApprover.map((approver, index) => (
                            <td key={index} >
                                {formatDate(approver.approverDate)}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </>
    );
}

export default ApproversInfo;