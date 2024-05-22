import { useDispatch, useSelector } from "react-redux";
import { GET_MEMBER } from "../../modules/MemberModule";
import React, { useEffect } from "react";
import { getMemberAPI } from "../../apis/ApprovalAPI";
import userInfocss from "../../css/approval/UserInfoComponent.module.css";

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
            <table className="userInfocss.table">
                <tbody>
                    <tr>
                        <th>결재번호</th>
                        <td>{yearFormNo}</td>
                        <th>작성일자</th>
                        <td>{new Date().toLocaleDateString()}</td>
                        <th>기안부서</th>
                        <td>{member.departName}</td>
                    </tr>
                    <tr>
                        <th>사번</th>
                        <td>{member.memberId}</td>
                        <th>기안자</th>
                        <td>{member.name}</td>
                        <th>직위</th>
                        <td>{member.positionName}</td>
                    </tr>
                </tbody>
            </table>
        </>
    ); 
}

export default UserInfoComponent;