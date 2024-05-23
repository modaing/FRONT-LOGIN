import { useDispatch, useSelector } from "react-redux";
import { GET_MEMBER } from "../../modules/MemberModule";
import React, { useEffect } from "react";
import { getMemberAPI } from "../../apis/ApprovalAPI";
import styles from  "../../css/approval/UserInfoComponent.module.css";

const UserInfoComponent = ({ memberId, yearFormNo }) => {

    const dispatch = useDispatch();


    const trStyle = {
        border : '1px solid black' ,
        padding: '8px',
        textAlign: 'center'
    }

    const member =  useSelector((state) => state.memberReducer.data) || {};


    useEffect(() => {
        const fetchMemberInfo = async () => {
            const data = await getMemberAPI(memberId);
            
            console.log("Fetchedm member data : ", data); // 콘솔에 객체를 출력
            dispatch({ type: GET_MEMBER, payload: data });
        };

        fetchMemberInfo();
    }, [dispatch, memberId]);

    console.log("Redux member state: ", member); 

    if(!member.memberId || !member){
        return <div>기안자 정보 불러오는 중...</div>
    }

    return(
        <>
            <table className={styles.table}>
                <tbody>
                    <tr className={styles.tableTr}>
                        <th style={trStyle}>결재번호</th>
                        <td style={trStyle}>{yearFormNo}</td>
                        <th style={trStyle}>작성일자</th>
                        <td style={trStyle}>{new Date().toLocaleDateString()}</td>
                        <th style={trStyle}>기안부서</th>
                        <td style={trStyle}>{member.departName}</td>
                    </tr>
                    <tr className={styles.tableTr}>
                        <th style={trStyle}>사번</th>
                        <td style={trStyle}>{member.memberId}</td>
                        <th style={trStyle}>기안자</th>
                        <td style={trStyle}>{member.name}</td>
                        <th style={trStyle}>직위</th>
                        <td style={trStyle}>{member.positionName}</td>
                    </tr>
                </tbody>
            </table>
        </>
    ); 
}

export default React.memo(UserInfoComponent);