export function renderLeaveSubmit(content, checkDelete, handleCancel, setSelectedTime, setDetailInfo, handleOpenModal) {
    if (!content) {
        return null;
    }

    const currentDate = new Date();

    if (checkDelete != null && handleCancel != null) {

        return content.map((submit, index) => {
            const { formattedStartDate, formattedEndDate, leaveDaysCalc } = formattedLocalDate(submit);
            const isWithinOneDay = new Date(formattedStartDate) <= new Date(currentDate.getTime() + (1000 * 60 * 60 * 24));
            const buttonText = submit.leaveSubStatus === "대기" && submit.refLeaveSubNo === 0
                ? '신청 삭제'
                : isWithinOneDay
                    ? submit.leaveSubStatus
                    : submit.leaveSubStatus === "승인" && submit.refLeaveSubNo === 0
                        ? '취소 신청'
                        : submit.leaveSubStatus

            const buttonClassName = submit.leaveSubStatus === "대기" && submit.refLeaveSubNo === 0
                ? 'requestDelete'
                : isWithinOneDay
                    ? ''
                    : submit.leaveSubStatus === "승인" && submit.refLeaveSubNo === 0
                        ? 'cancelRequest'
                        : ''

            const onClickHandler = submit.leaveSubStatus === "대기" && submit.refLeaveSubNo === 0
                ? () => checkDelete(submit.leaveSubNo)
                : isWithinOneDay
                    ? null
                    : submit.leaveSubStatus === "승인" && submit.refLeaveSubNo === 0
                        ? () => {
                            setSelectedTime({ start: formattedStartDate, end: formattedEndDate })
                            handleCancel(submit.leaveSubNo)
                        }
                        : null;


            return (
                <tr key={index}>
                    <td>{formattedStartDate}</td>
                    <td>{formattedEndDate}</td>
                    <td>{submit.leaveSubType}</td>
                    <td>{leaveDaysCalc}</td>
                    <td>{submit.leaveSubApplyDate}</td>
                    <td>{submit.approverName || "-"}</td>
                    <td>{submit.leaveSubProcessDate || "-"}</td>
                    <td>
                        <span className={`${buttonClassName}`} onClick={onClickHandler}>
                            {buttonText}
                        </span>
                    </td>
                </tr>
            );
        });
    } else {

        return content.map((submit, index) => {
            const { formattedStartDate, formattedEndDate, leaveDaysCalc } = formattedLocalDate(submit);

            return (
                <tr key={index}>
                    <td>{submit.applicantName}</td>
                    <td>{submit.leaveSubApplicant}</td>
                    <td>{formattedStartDate}</td>
                    <td>{formattedEndDate}</td>
                    <td>{submit.leaveSubType}</td>
                    <td>{leaveDaysCalc}</td>
                    <td>{submit.leaveSubStatus}</td>
                    {submit.leaveSubProcessDate
                        ? <td></td>
                        : <td>
                            <span className="leaveDetail" onClick={() => {
                                setSelectedTime({ start: formattedStartDate, end: formattedEndDate })
                                setDetailInfo({ name: submit.applicantName, memberId: submit.leaveSubApplicant, type: submit.leaveSubType, reason: submit.leaveSubReason })
                                handleOpenModal(submit.leaveSubNo)
                            }}>
                                상세 조회
                            </span>
                        </td>
                    }
                </tr>
            );
        });
    }
}

export function formattedLocalDate(submit) {

    //포맷팅 하기 위해서 date 타입으로 변환
    const startDate = new Date(submit.leaveSubStartDate);
    const endDate = new Date(submit.leaveSubEndDate);

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
                <td className="accrualReason" title={leaveAccrual.leaveAccrualReason}>{leaveAccrual.leaveAccrualReason}</td>
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
                <td>{leaves.specialLeave}</td>
                <td className="consumedDays">{leaves.consumedDays}</td>
                <td className="remainingDays">{leaves.remainingDays}</td>
            </tr>
        );
    });
}
