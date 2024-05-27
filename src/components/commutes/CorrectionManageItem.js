import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CorrectionUpdateModal from "./CorrectionUpdateModal";
import { callUpdateCorrectionAPI } from "../../apis/CommuteAPICalls";

function CorrectionManageItem({ correction, tableStyles, evenRow, date, handleCorrectionUpdateCompleted }) {

    const [showModal, setShowModal] = useState(false);
    // const currentCommute = commute?.[0] || {};
    // const currentMember = member?.[0] || {};
    // const currentDepart = depart?.[0] || {};

    const dispatch = useDispatch();

    /* 근무 일자 형식 변경 */
    const formatWorkingDate = (workingDate) => {
        const date = new Date(workingDate);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    /* 정정 상세 조회 및 처리 핸들러 */
    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveModal = ({ corrStatus, reasonForRejection, corrProcessingDate }) => {
        console.log('corrNo ', correction.corrNo);
        const updateCorrection = {
            corrNo: correction.corrNo,
            corrStatus: corrStatus,
            reasonForRejection: reasonForRejection,
            corrProcessingDate: corrProcessingDate
        };
        dispatch(callUpdateCorrectionAPI(updateCorrection));
        console.log('정정 처리 성공~!!!!!');
    };
    
    useEffect(() => {
    }, [correction, correction.corrStatus])


    return (
        <>
            <tr style={evenRow ? tableStyles.evenRow : {}} onClick={() => handleOpenModal()}>
                <td style={tableStyles.tableCell1} scope="row">
                    {correction && formatWorkingDate(correction?.workingDate)}
                </td>
                <td style={tableStyles.tableCell2} scope="row">
                    {correction?.name}
                </td>
                <td style={tableStyles.tableCell3} scope="row">
                    {correction?.departName}
                </td>
                <td style={tableStyles.tableCell4}>
                    {correction && correction?.reasonForCorr}
                </td>
                <td style={tableStyles.tableCell5}>
                    {correction && correction?.corrStatus}
                </td>
            </tr>
            <CorrectionUpdateModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSave={handleSaveModal}
                correction={correction}
                handleCorrectionUpdateCompleted={handleCorrectionUpdateCompleted}
            />
        </>
    );
};

export default CorrectionManageItem;