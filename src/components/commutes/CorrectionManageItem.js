import { useState } from "react";
import { useDispatch } from "react-redux";
import CorrectionUpdateModal from "./CorrectionUpdateModal";
import { callUpdateCorrectionAPI } from "../../apis/CommuteAPICalls";

function CorrectionManageItem({ correction, commute, member, depart, tableStyles, evenRow, date }) {

    console.log('정정 관리 ', correction);
    console.log('출퇴근 ', commute);
    console.log('정정 신청자 ', member);
    console.log('부서 ', depart);

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


    return (
        <>
            <tr style={evenRow ? tableStyles.evenRow : {}} onClick={() => handleOpenModal()}>
                <td style={tableStyles.tableCell1} scope="row">
                    {commute.map((item, index) => (formatWorkingDate(item.workingDate)))}
                    {/* {formatWorkingDate(currentCommute?.workingDate)} */}
                    {/* {formatWorkingDate(commute?.workingDate)} */}
                </td>
                <td style={tableStyles.tableCell2} scope="row">
                    {member.map((item, index) => (item.name))}
                    {/* {currentMember?.name} */}
                    {/* {member?.name} */}
                </td>
                <td style={tableStyles.tableCell3} scope="row">
                    {depart.map((item, index) => (item.departName))}
                    {/* {currentDepart?.departName} */}
                    {/* {depart?.departName} */}
                </td>
                <td style={tableStyles.tableCell4}>
                    {/* {correction && correction.map((item, index) => (item.reasonForCorr))} */}
                    {/* {correction?.reasonForCorr} */}
                    {correction && correction.reasonForCorr}
                </td>
                <td style={tableStyles.tableCell5}>
                    {/* {correction && correction.map((item, index) => (item.corrStatus))} */}
                    {/* {correction?.corrStatus} */}
                    {correction && correction[0].corrStatus}
                </td>
            </tr>
            {/* <CorrectionUpdateModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSave={handleSaveModal}
                correction={correction[0]}
                commute={commute}
                member={member}
                depart={depart}
            /> */}
        </>
    );
};

export default CorrectionManageItem;