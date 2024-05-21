import { decodeJwt } from "../../utils/tokenUtils";
import manageMemberCSS from './ManageMember.module.css';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { callGetMemberAPI, callGetTransferredHistory, callResetPasswordAPI, callUpdateMemberAPI } from "../../apis/MemberAPICalls";
import { callGetDepartmentByDepartNoAPI } from "../../apis/DepartmentAPICalls";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import '../../css/member/setMember.css';

function MemberPage() {
    
    const { memberId } = useParams();
    const [memberInfo, setMemberInfo] = useState(null);
    const [memberInformation, setMemberInformation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formattedEmployedDate, setFormattedEmployedDate] = useState('');
    const [transferredHistoryInformation, setTransferredHistoryInformation] = useState([]);
    const [departmentName, setDepartmentNames] = useState(null);
    const navigate = useNavigate();

    const fetchMemberInfo = async (e) => {
        try {
            const memberInformation = await callGetMemberAPI(memberId);
            // console.log('response:', memberInformation);
            setMemberInfo(memberInformation);
            formatDate(memberInformation.employedDate);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch member:', error);
        }
    }

    const fetchDepartNameByDepartNo = async (departNo) => {
        console.log('departNo:',departNo);
        try {
            const getDepartName = await callGetDepartmentByDepartNoAPI(departNo);
            console.log('getDepartName:',getDepartName);
            return getDepartName.departName;
        } catch (error) {
            console.error('부서이름을 불러오는데 오류가 발생했습니다:', error);
        }
    };

    const profilePic = () => {
        const image = memberInfo.imageUrl;
        const imageUrl = `/img/${image}`;
        return imageUrl;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric'};
        const formattedDate = date.toLocaleDateString('ko-KR', options);
        setFormattedEmployedDate(formattedDate);
        // console.log('Formatted date:', formattedEmployedDate);
    }

    const fetchTransferredHistory = async() => {
        try {
            const transferredHistory = await callGetTransferredHistory(memberId);
            if (Array.isArray(transferredHistory)) {
                const formattedTransferredHistory = transferredHistory.map(formattedHistory => ({
                    ...formattedHistory
                }));
                setTransferredHistoryInformation(formattedTransferredHistory);
                console.log('transferred history:', formattedTransferredHistory);
            } else {
                console.error('transferred history is not an array', transferredHistory);
            }
        } catch (error) {
            console.error('Failed in bringing transferred history:', error);
        }
    }

    const handleResetPassword = async () => {
        const confirmed = window.confirm("비밀번호를 초기화 하시겠습니끼?");

        if (confirmed){
            const response = await callResetPasswordAPI();
            console.log('response:', response);
            if (response.reason === 'token이 존재하지 않습니다') {
                console.log('token error');
            } else {
                console.log('비밀번호 초기화에 성공했습니다');
            }
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMemberInformation(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await callUpdateMemberAPI(memberInformation);

            fetchMemberInfo();
            console.log('Member information updated successfully');
        } catch (error) {
            console.error('Failed to update member information:', error);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            fetchMemberInfo();
            fetchTransferredHistory();
            fetchDepartNameByDepartNo();
        };

        fetchData();
    }, []);

    // if (loading) {
    if (!memberInfo) {
        return <div>Loading...</div>;
    }
    
    return (
        <main id="main" className="main main2Pages">
            {/* <form onSubmit={handleSubmit}> */}
                <div className='firstPage'>
                <div className="pagetitle">
                    <h1>구성원 관리</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item">조직</li>
                            <li className="breadcrumb-item">구성원 관리</li>
                            <li className="breadcrumb-item active">{memberInfo.name}'s 프로필</li>
                        </ol>
                    </nav>
                </div>
                    <div className="row rowStyle">
                        <div className="col-lg-6 columnStyle">
                            <div className="card cardOuterLine">
                                <div className="content1 contentStyle1">
                                    <div className='imageBox'>
                                        <img src={profilePic()} className='profilePic' alt="Profile" />
                                        <div className='nameBox'>{memberInfo.name}</div>
                                    </div>
                                    {/* <h1>hi</h1> */}
                                    <button className='changePassword' onClick={handleResetPassword}>비밀번호 초기화</button>
                                </div>
                                <div className='content1 contentStyle2 titleStyle'>
                                    <div className="pagetitle pageTitleStyle" >
                                        <h1>기본 정보</h1>
                                    </div>
                                </div>
                                <div className='content1 contentStyle3 titleStyle'>
                                    <div className='nameStyle'>
                                        <label className='name'>이름</label>
                                        <input className='inputStyle' value={memberInfo.name} onChange={handleInputChange}/>
                                    </div>
                                    <div className='memberIdStyle'>
                                        <label className='memberId'>사번</label>
                                        <input className='inputStyleConfirmed' value={memberInfo.memberId} readOnly/>
                                    </div>
                                    <div className='departStyle'>
                                        <label className='memberId'>부서</label>
                                        <input className='inputStyle' value={memberInfo.departmentDTO.departName} onChange={handleInputChange}/>
                                    </div>
                                    <div className='positionStyle'>
                                        <label className='position'>직급</label>
                                        <input className='inputStyle' value={memberInfo.positionDTO.positionName} onChange={handleInputChange}/>
                                    </div>
                                    <div className='employedDateStyle'>
                                        <label className='memberId'>입사일</label>
                                        <input className='inputStyle' value={formattedEmployedDate} onChange={handleInputChange}/>
                                    </div>
                                    <div className='emailStyle'>
                                        <label className='email'>이메일</label>
                                        <input className='inputStyle' value={memberInfo.email} onChange={handleInputChange}/>
                                    </div>
                                    <div className='addressStyle'>
                                        <label className='address'>주소</label>
                                        <input className='inputStyle' value={memberInfo.address} onChange={handleInputChange}/>
                                    </div>
                                    <div className='phoneNoStyle'>
                                        <label className='phoneNo'>휴대폰 번호</label>
                                        <input className='inputStyle' value={memberInfo.phoneNo} onChange={handleInputChange}/>
                                    </div>
                                    <div className='memberStatusStyle'>
                                        <label className='memberStatus'>상태</label>
                                        <input className='inputStyle' value={memberInfo.memberStatus} onChange={handleInputChange}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='secondPage'>
                    {/* <div className="pagetitle pageTitleStyle" >
                        <h1>인사 정보</h1>
                    </div> */}
                    <div className="pagetitle">
                        <h1>인사 정보</h1>
                        <nav>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="/">Home</a></li>
                                <li className="breadcrumb-item">조직</li>
                                <li className="breadcrumb-item">구성원 관리</li>
                                <li className="breadcrumb-item active">{memberInfo.name}'s 프로필</li>
                            </ol>
                        </nav>
                    </div>
                    <div className="row rowStyle">
                        <div className="col-lg-6 columnStyle">
                            <div className="card cardOuterLine2">
                                <div className='content1 contentStyle3 titleStyle'>
                                    <div className="pagetitle pageTitleStyle" >
                                        <h1>인사 발령 내역</h1>
                                    </div>
                                    {/* Mapping through transferredHistoryInformation to display new_position_name and transferred_date */}
                                    {transferredHistoryInformation.map((history, index) => (
                                        <div key={index} className='transferredHistory'>
                                            {/* <span className='transferredDate'>{history.transferredDate.join('.')}</span> */}
                                            <span className='transferredDateStyle'>
                                                {index === transferredHistoryInformation.length - 1 
                                                    ? `${history.transferredDate.join('.')} ~`
                                                    : history.transferredDate.join('.')}
                                            </span>
                                            <br/><br />
                                            <span id="departName" className='departNameStyle'>{history.newDepartNo}</span> {/* Render department name */}
                                            <br /><br />
                                            <span className='positionNameStyle'>{history.newPositionName}</span>
                                            <br />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="buttonClass">
                                <button className="notice-cancel-button" type='button' onClick={() => navigate('/manageMember')}>취소하기</button>
                                <button className="notice-cancel-button">저장</button>
                            </div>
                        </div>
                    </div>
                    {/* <button></button> */}
                </div>
            {/* </form> */}
        </main>
    );
}

export default MemberPage;