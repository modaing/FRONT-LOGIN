import { useDispatch, useSelector } from "react-redux";
import { SET_PAGENUMBER } from "../../modules/CommuteModule";

function CorrectionItem({ findWorkingDate, correction, tableStyles, evenRow, date }) {

    // console.log('[CorrectionItem] correction : ', correction);
    // console.log('[CorrectionItem] correction.corrNo : ', correction.corrNo);
    // console.log('[CorrectionItem] date : ', date);

    /* 정정 대상 일자 찾기 */
    
    /* 근무 일자 형식 변경 */
    const formatWorkingDate = (workingDate) => {
        const date = new Date(workingDate);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    return (
        <>
            <tr style={evenRow ? tableStyles.evenRow : {}}>
                <td style={tableStyles.tableCell1} scope="row">{formatWorkingDate(findWorkingDate(correction.commuteNo))}</td>
                <td style={tableStyles.tableCell2}>{correction.reqStartWork}</td>
                <td style={tableStyles.tableCell3}>{correction.reqEndWork}</td>
                <td style={tableStyles.tableCell4}>{formatWorkingDate(correction.corrRegistrationDate)}</td>
                <td style={tableStyles.tableCell5}>{correction.corrStatus}</td>
            </tr>
        </>
    );
};

export default CorrectionItem;