export function renderLeaveSubmit(content, handleDelete, handleCancle, setSelectedTime, setDetailInfo, handleOpenModal) {
    if (!content) {
        return null;
    }
    if (handleDelete != null && handleCancle != null) {

        return content.map((leaveSubmit, index) => {
            const { formattedStartDate, formattedEndDate, leaveDaysCalc } = formattedLocalDate(leaveSubmit);
            const buttonClassName = leaveSubmit.leaveSubProcessDate ? 'cancelRequest' : 'requestDelete';
            const onClickHandler = leaveSubmit.leaveSubProcessDate ? () => {
                setSelectedTime({ start: formattedStartDate, end: formattedEndDate })
                handleCancle(id)
            } : () => handleDelete(id);
            const buttonText = leaveSubmit.leaveSubProcessDate ? '취소 신청' : '신청 삭제';
            const id = leaveSubmit.leaveSubNo;

            return (
                <tr key={index}>
                    <td>{formattedStartDate}</td>
                    <td>{formattedEndDate}</td>
                    <td>{leaveSubmit.leaveSubType}</td>
                    <td>{leaveDaysCalc}</td>
                    <td>{leaveSubmit.leaveSubApplyDate}</td>
                    <td>{leaveSubmit.approverName || "-"}</td>
                    <td>{leaveSubmit.leaveSubProcessDate || "-"}</td>
                    <td>
                        <span className={`${buttonClassName}`} onClick={onClickHandler}>
                            {buttonText}
                        </span>
                    </td>
                </tr>
            );
        });
    } else {

        return content.map((leaveSubmit, index) => {
            const { formattedStartDate, formattedEndDate, leaveDaysCalc } = formattedLocalDate(leaveSubmit);
            const id = leaveSubmit.leaveSubNo;

            return (
                <tr key={index}>
                    <td>{leaveSubmit.applicantName}</td>
                    <td>{leaveSubmit.leaveSubApplicant}</td>
                    <td>{formattedStartDate}</td>
                    <td>{formattedEndDate}</td>
                    <td>{leaveSubmit.leaveSubType}</td>
                    <td>{leaveDaysCalc}</td>
                    <td>{leaveSubmit.leaveSubStatus}</td>
                    {leaveSubmit.leaveSubProcessDate ?
                        <td></td>
                        : <td>
                            <span className="leaveDetail" onClick={() => {
                                setSelectedTime({ start: formattedStartDate, end: formattedEndDate })
                                setDetailInfo({ name: leaveSubmit.applicantName, memberId: leaveSubmit.leaveSubApplicant, type: leaveSubmit.leaveSubType, reason: leaveSubmit.leaveSubReason })
                                handleOpenModal(id)
                            }}>
                                상세
                            </span>
                        </td>
                    }
                </tr>
            );
        });
    }
}

function formattedLocalDate(leaveSubmit) {

    //포맷팅 하기 위해서 date 타입으로 변환
    const startDate = new Date(leaveSubmit.leaveSubStartDate);
    const endDate = new Date(leaveSubmit.leaveSubEndDate);

    // yyyy.MM.dd 형식으로 변환
    const formattedStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
    const formattedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;

    // 휴가 일수 계산
    const differenceInTime = endDate.getTime() - startDate.getTime();
    const leaveDaysCalc = differenceInTime / (1000 * 3600 * 24) + 1;

    return { formattedStartDate, formattedEndDate, leaveDaysCalc };
}

export function renderLeaveAccrual(content) {
    if (!content) {
        return null;
    }

    return content.map((leaveAccrual, index) => {

        return (
            <tr key={index}>
                <td>{leaveAccrual.recipientName}</td>
                <td>{leaveAccrual.recipientId}</td>
                <td>{leaveAccrual.accrualDate}</td>
                <td>{leaveAccrual.leaveAccrualDays}</td>
                <td>{leaveAccrual.leaveAccrualReason}</td>
            </tr>
        );
    });
}

export function renderLeaves(content) {
    if (!content) {
        return null;
    }
    return content.map((leaves, index) => {

        return (
            <tr key={index}>
                <td>{leaves.name}</td>
                <td>{leaves.memberId}</td>
                <td>{leaves.annualLeave}</td>
                <td>{leaves.vacationLeave}</td>
                <td>{leaves.familyEventLeave}</td>
                <td>{leaves.specialLeave}</td>
                <td className="consumedDays">{leaves.consumedDays}</td>
                <td className="remainingDays">{leaves.remainingDays}</td>
            </tr>
        );
    });
}