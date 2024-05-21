export function renderSurveyList(content, handleOpenModal) {
    if (!content) {
        return (
            <tr>
                <td colSpan="6">현재 진행 중인 설문조사 항목이 없습니다.</td>
            </tr>
        );
    }

    return content.map((survey, index) => {
        const { formattedStartDate, formattedEndDate } = formattedLocalDate(survey)
        const buttonClassName = survey.surveyCompleted ? 'surveyComplete' : 'surveyOpen';
        const buttonText = survey.surveyCompleted ? '참여완료' : '참여하기';
        const onClickHandler = survey.surveyCompleted ? null : () => handleOpenModal(); 

        return (
            <tr key={index}>
                <td>{survey.surveyNo}</td>
                <td>{survey.surveyTitle}</td>
                <td>{formattedStartDate}</td>
                <td>{formattedEndDate}</td>
                <td>{survey.name}</td>
                <td>
                    <span className={buttonClassName} onClick={onClickHandler}>
                        {buttonText}
                    </span>
                </td>
            </tr>
        )
    })
}

function formattedLocalDate(survey) {

    //포맷팅 하기 위해서 date 타입으로 변환
    const startDate = new Date(survey.surveyStartDate);
    const endDate = new Date(survey.surveyEndDate);

    // yyyy.MM.dd 형식으로 변환
    const formattedStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
    const formattedEndDate = `${endDate.getFullYear()}-${(endDate.getMonth() + 1).toString().padStart(2, '0')}-${endDate.getDate().toString().padStart(2, '0')}`;


    return { formattedStartDate, formattedEndDate };
}