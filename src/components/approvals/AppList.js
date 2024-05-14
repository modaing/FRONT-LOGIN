import { useNavigate } from "react-router-dom";

function AppList({ data }){
    const column = ['기안 일시', '양식', '제목', '상태'];
    const navigate = useNavigate();

    const onClickHandler = (approvalNo) => {
        navigate(`/approvals/${approvalNo}`, {replace:false})
    }

    return(
        <>
            <table className="approvalTable">
                <thead>
                    <tr>
                        {column.map((item) => (
                            <th scope='col' key={item.index}>{item}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(data) && data.map((item) => (
                        <tr key={item.index} onClick={() => onClickHandler(item.approvalNo)}>
                            <td>{item.approvalDate}</td>
                            <td>{item.formName}</td>
                            <td>{item.approvalTitle}</td>
                            <td>{item.approvalStatus}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default AppList;