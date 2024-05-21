import { useDispatch, useSelector } from "react-redux";
import { callGetMemberAPI } from "../../apis/MemberAPICalls";
import { GET_MEMBER } from "../../modules/MemberModule";
import React, { useEffect } from "react";

const UserInfoComponent = ({ memberId }) => {

    const dispatch = useDispatch();
    const memberInfo = useSelector(state => state.member);
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

    useEffect(() => {
        const fetchMemberInfo = async () => {
            const data = await callGetMemberAPI(memberId);
            
            
            console.log("내 member 정보 : ", data); // 콘솔에 객체를 출력
            dispatch({ type: GET_MEMBER, payload: data });
        };

        fetchMemberInfo();
    }, [dispatch, memberId]);


    if(!memberInfo){
        console.log("memberInfo가 없습니다.");
        return <div>잘못된 사원 정보입니다.</div>
    }

    console.log("Redux에 저장된 memberInfo : " + memberInfo);

    return(
        <>
            <table>
                <tbody>
                    <tr>
                        <th>결재번호</th>
                        <td></td>
                        <th>작성일자</th>
                        <td>${new Date().toLocaleDateString}</td>
                        <th>기안부서</th>
                        <td>${memberInfo.departmentDTO?.departName}</td>
                    </tr>
                    <tr>
                        <th>사번</th>
                        <td>${memberInfo.memberId}</td>
                        <th>기안자</th>
                        <td>${memberInfo.name}</td>
                        <th>직위</th>
                        <td>${memberInfo.positionDTO?.positionName}</td>
                    </tr>
                </tbody>
            </table>
        </>
    ); 
}

export default UserInfoComponent;