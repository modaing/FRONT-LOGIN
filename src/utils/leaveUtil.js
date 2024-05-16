export function renderLeaveSubmit(content, handleDelete, handleCancleInsert) {
    if (!content) {
        return null; 
    }

    return content.map((leaveSubmit, index) => {
        const { formattedStartDate, formattedEndDate, leaveDaysCalc } = formattedLocalDate(leaveSubmit);
        const buttonClassName = leaveSubmit.leaveSubProcessDate ? 'cancelRequest' : 'requestDelete';
        const onClickHandler = leaveSubmit.leaveSubProcessDate ? () => handleDelete(id) : () => handleCancleInsert(id);
        const buttonText = leaveSubmit.leaveSubProcessDate ? '취소 신청' : '신청 삭제';
        const id = leaveSubmit.leaveSubNo;

        return (
            <tr key={index}>
                <td>{formattedStartDate}</td>
                <td>{formattedEndDate}</td>
                <td>{leaveSubmit.leaveSubType}</td>
                <td>{leaveDaysCalc}</td>
                <td>{leaveSubmit.leaveSubApplyDate}</td>
                <td>{leaveSubmit.leaveSubApprover || "-"}</td>
                <td>{leaveSubmit.leaveSubProcessDate || "-"}</td>
                <td>
                     <span className={`${buttonClassName}`} onClick={onClickHandler}>
                    {buttonText}
                    </span>
                </td>
            </tr>
        );
    });
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