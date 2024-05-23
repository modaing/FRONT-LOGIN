import { useDispatch, useSelector } from "react-redux";
import { GET_MEMBER } from "../../modules/MemberModule";
import React, { useEffect } from "react";
import { getMemberAPI } from "../../apis/ApprovalAPI";
import styles from  "../../css/approval/UserInfoComponent.module.css";

const UserInfoComponent = ({ memberId, yearFormNo }) => {

    const dispatch = useDispatch();
    
    // const memberInfo = decodeJwt(token);
    // const [memberInformation, setMemberInformation] = useState('');

    // const fetchMemberInfo = async () => {
    //     try {
    //       const memberInformation = await callGetMemberAPI(memberInfo.memberId);
    //       setMemberInformation(memberInformation);
    //       formatDate(memberInformation.employedDate);
    //       console.log('구성원 정보:', memberInformation);
    //     } catch (error) {
    //       console.error('Failed in bringing member information:', error);
    //     }
    // };

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
                        <th style={{border : '1px solid black'}}>결재번호</th>
                        <td style={{border : '1px solid black'}}>{yearFormNo}</td>
                        <th style={{border : '1px solid black'}}>작성일자</th>
                        <td style={{border : '1px solid black'}}>{new Date().toLocaleDateString()}</td>
                        <th style={{border : '1px solid black'}}>기안부서</th>
                        <td style={{border : '1px solid black'}}>{member.departName}</td>
                    </tr>
                    <tr className={styles.tableTr}>
                        <th style={{border : '1px solid black'}}>사번</th>
                        <td style={{border : '1px solid black'}}>{member.memberId}</td>
                        <th style={{border : '1px solid black'}}>기안자</th>
                        <td style={{border : '1px solid black'}}>{member.name}</td>
                        <th style={{border : '1px solid black'}}>직위</th>
                        <td style={{border : '1px solid black'}}>{member.positionName}</td>
                    </tr>
                </tbody>
            </table>
        </>
    ); 
}

export default UserInfoComponent;