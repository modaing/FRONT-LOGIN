import { useDispatch, useSelector } from "react-redux";
import { SET_PAGENUMBER } from "../../modules/CommuteModule";
import CorrectionDetailModal from "./CorrectionDetailModal";
import { useEffect, useState } from "react";
import { callSelectCommuteDetailAPI } from "../../apis/CommuteAPICalls";
import zIndex from "@mui/material/styles/zIndex";

function CorrectionItem({ correction, tableStyles, evenRow }) {

    const [showModal, setShowModal] = useState(false);

    /* 근무 일자 형식 변경 */
    const formatWorkingDate = (workingDate) => {
        const date = new Date(workingDate);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    /* 정정 상세 조회 핸들러 */
    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <tr style={evenRow ? tableStyles.evenRow : {}} onClick={() => handleOpenModal()}>
                <td style={tableStyles.tableCell1} scope="row">
                {(formatWorkingDate(correction.workingDate))}
                </td>
                <td style={tableStyles.tableCell2}>{correction?.reqStartWork}</td>
                <td style={tableStyles.tableCell3}>{correction?.reqEndWork}</td>
                <td style={tableStyles.tableCell4}>{formatWorkingDate(correction.corrRegistrationDate)}</td>
                <td style={tableStyles.tableCell5}>{correction.corrStatus}</td>
            </tr>
            <CorrectionDetailModal isOpen={showModal} onClose={handleCloseModal} correction={correction} />
        </>
    );
};

export default CorrectionItem;