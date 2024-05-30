import { useNavigate, Link, useParams } from 'react-router-dom';
import { callChangePasswordAPI, callGetMemberAPI, callGetTransferredHistory, callUpdateMemberAPI, callGetDepartmentListAPI, callGetPositionListAPI } from "../../apis/MemberAPICalls";
import { callDepartmentDetailListAPI } from "../../apis/DepartmentAPICalls";
import React, { useEffect, useState, useMemo, useRef } from "react";
import Post from './Post';
import { useSelector, useDispatch } from "react-redux";
import '../../css/member/memberPage.css';

function MemberPage() {
    
    const { memberId } = useParams();
    const [memberInfo, setMemberInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formattedEmployedDate, setFormattedEmployedDate] = useState('');
    const [transferredHistoryInformation, setTransferredHistoryInformation] = useState([]);
    const navigate = useNavigate();
    const [departmentInformation, setDepartmentInformation] = useState([]);
    const [positionInformation, setPositionInformation] = useState([]);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);


    const LinkToEditPage = () => {
        const currentUrl = window.location.pathname;
        navigate(`${currentUrl}/edit`);
    }

    /* 구성원 정보 호출 */
    const fetchMemberInfo = async (e) => {
        try {
            const memberInformation = await callGetMemberAPI(memberId);
            formatDate(memberInformation.birthday);
            console.log('memberInformation:', memberInformation);
            setMemberInfo(memberInformation);
            formatDate(memberInformation.employedDate);
            // formatDateInDigits(memberInformation.birthday);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch member:', error);
        }
    }

    /* 부서 호출 */
    const fetchDepartments = async () => {
        try {
            const departmentList = await callGetDepartmentListAPI();
            setDepartmentInformation(departmentList);
            console.log('departmentList:', departmentList);
            console.log('인사팀', departmentInformation[0]);
        } catch (error) {
            console.error('부서 리스트 불러 오는데 오류 발생:', error); 
        }
    }

    /* 직급 호출 */
    const fetchPositions = async () => {
        try {
            const positionList = await callGetPositionListAPI();
            setPositionInformation(positionList);

            if (Array.isArray(positionList)) {
                setPositionInformation(positionList);
            } else {
                console.error('Position list is not an array:', positionList);
            }
        } catch (error) {
            console.error('직급 리스트 불러 오는데 오류 발생:', error)
        }
    }

    /* 부서명 호출 */
    const fetchDepartNameByDepartNo = async () => {
        try {
            const getDepartmentList = await callDepartmentDetailListAPI();
            if (Array.isArray(getDepartmentList)) {
                const departmentInfo = getDepartmentList.map(department => ({
                    ...department
                }));
                // setDepartment(departmentInfo);
                // setFilteredDepartInfo(departmentInfo);
            } else {
                console.error ('department details is not an array:', getDepartmentList);
            }
        } catch (error) {
            console.error('부서 리스트를 불러 오는데 오류가 발생했습니다:', error);
        }
    }

    /* 프로필 이미지 */
    const profilePic = () => {
        const image = memberInfo.imageUrl;
        const imageUrl = `/img/${image}`;
        if (imagePreviewUrl) {
            return imagePreviewUrl
        } else {
            return imageUrl;
        }
    }

    /* 날짜 포맷 */
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric'};
        const formattedDate = date.toLocaleDateString('ko-KR', options);
        setFormattedEmployedDate(formattedDate);
        // console.log('Formatted date:', formattedEmployedDate);
    }

    /* 캘린더에 날짜 포맷 */
    const formatDateInCalendar = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}년 ${month}월 ${day}일`;
    };
    
    const today = formatDateInCalendar(new Date());

    /* 인사 발령 내역 호출 */
    const fetchTransferredHistory = async() => {
        try {
            const transferredHistory = await callGetTransferredHistory(memberId);
            if (Array.isArray(transferredHistory)) {
                const formattedTransferredHistory = transferredHistory.map(formattedHistory => ({
                    ...formattedHistory
                }));
                setTransferredHistoryInformation(formattedTransferredHistory);
            } else {
                console.error('transferred history is not an array', transferredHistory);
            }
        } catch (error) {
            console.error('Failed in bringing transferred history:', error);
        }
    }
    
    /* 비밀번호 초기화 */
    const handleResetPassword = async (memberId, e) => {
        e.preventDefault();

        const confirmed = window.confirm("비밀번호를 초기화 하시겠습니끼?");

        if (confirmed){
            try {
                const response = await callChangePasswordAPI(memberId);
                // console.log('response:',response);
                if (response == "Password reset successfully") {
                    alert('비밀번호를 초기화했습니다');
                    window.location.reload();
                }
            } catch (error) {
                console.error('Failed to reset password:', error);
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchMemberInfo();
            await fetchTransferredHistory();
            await fetchDepartNameByDepartNo();
            await fetchDepartments();
            await fetchPositions();
        };

        fetchData();
    }, []);

    // if (loading) {
    if (!memberInfo) {
        return <div>Loading...</div>;
    }
    
    return (
        <main id="main" className="main2Pages123">
            <div className='firstPage123 columStyle1'>
                <div className="pagetitle">
                    <h1>구성원 관리</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item">조직</li>
                            <li className="breadcrumb-item"><a href="/ManageMember">구성원 관리</a></li>
                            <li className="breadcrumb-item active">{memberInfo.name}님의 프로필</li>
                        </ol>
                    </nav>
                </div>
                <form id="memberForm">
                    <div className="card columnStyle1">
                        <div className="content1 contentStyle1">
                            <div className='imageBox'>
                                <div className="uploadContainer">
                                    <img className="profilePic" src={profilePic()} /><br/>
                                </div>
                            </div>
                        </div>
                        <div className='content1 contentStyle2 titleStyle'>
                            <div className="pagetitle pageTitleStyle">
                                <h1>기본 정보</h1>
                            </div>
                        </div>
                        <div className='content1 titleStyle'>
                            <div className='nameStyle'>
                                <label className='name'>이름</label>
                                <input
                                    name="name"
                                    className="inputStyleForMember"
                                    value={memberInfo.name}
                                    readOnly
                                />
                            </div>
                            <div className='nameStyle'>
                                <label className='name'>생년월일</label>
                                <input
                                    className="inputStyleForMember"
                                    name="birthday"
                                    type='text'
                                    value={formatDateInCalendar(memberInfo.birthday)}
                                    readOnly
                                />
                            </div>
                            <div className='memberIdStyle'>
                                <label className='memberId'>사번</label>
                                <input
                                    name="memberId"
                                    className='inputStyleForMember confirmed'
                                    value={memberInfo.memberId}
                                    readOnly
                                />
                            </div>
                            <div className="departStyle">
                                <label className='memberId'>부서</label>
                                <input
                                    className="inputStyleForMember"
                                    name='departmentDTO'
                                    value={memberInfo.departmentDTO.departName} // Set value to inputtedDepartment if available, otherwise use memberInfo
                                    readOnly
                                >
                                </input>
                            </div>
                            <div className="positionStyle">
                                <label className='position'>직급</label>
                                <input
                                    className="inputStyleForMember"
                                    name='positionDTO'
                                    value={memberInfo.positionDTO.positionName}
                                    readOnly
                                >
                                </input>
                            </div>
                            <div className='employedDateStyle'>
                                <label className='email'>입사일</label>
                                <input
                                    className="inputStyleForMember"
                                    name="employedDate"
                                    type="text"
                                    value={formatDateInCalendar(memberInfo.employedDate)}
                                    // max={today}
                                    // onChange={(e) => handleInputChange(e)}
                                    readOnly
                                />
                            </div>
                            <div className='emailStyle'>
                                <label className='email'>이메일</label>
                                <input
                                    className="inputStyleForMember"
                                    name="email"
                                    value={memberInfo.email}
                                />
                            </div>
                            <div className="addressStyle">
                                <label htmlFor="inputText" className="address">주소</label>
                                <input
                                    type='text'
                                    name='inputtedAddress'
                                    value={memberInfo.address}
                                    className='inputStyleForMember'
                                    readOnly
                                />
                            </div>
                            <div className='phoneNoStyle'>
                                <label className='phoneNo'>전화번호</label>
                                <input
                                    className="inputStyleForMember"
                                    type="text"
                                    name="phoneNo"
                                    value={memberInfo.phoneNo}
                                    readOnly
                                />
                            </div>

                            <div className='memberStatusStyle'>
                                <label className='memberStatus'>상태</label>
                                <input
                                    className="inputStyleForMember"
                                    name="memberStatus"
                                    value={memberInfo.memberStatus}
                                    readOnly
                                />
                            </div>
                            <div className="memberStatusStyle">
                                <label htmlFor="inputText" className="memberStatus">권한</label>
                                <input
                                    className="inputStyleForMember"
                                    name='role'
                                    defaultValue={memberInfo.role}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
    
            <div className='secondPage123'>
                <div className="pagetitle">
                    <h1 style={{ marginBottom: '20px'}}>인사 정보</h1>
                </div>
                <div className="rowStyle columnStyle1">
                    <div className="card cardOuterLine2">
                        <div className='content1 contentStyle3 titleStyle'>
                            <div className="pagetitle pageTitleStyle">
                                <h1>인사 발령 내역</h1>
                            </div>
                            {transferredHistoryInformation.map((history, index) => {
                                const startDate = history.transferredDate.map(d => d.toString().padStart(2, '0')).join('.'); // Format start date
                                const endDate = index === transferredHistoryInformation.length - 1 ? '현재' : history.transferredDate.map(d => d.toString().padStart(2, '0')).join('.');
                                return (
                                    <div key={index} className='contentStyle23'>
                                        <div className="departNameStyleOuter">
                                            <div className="departNameDiv">
                                                <label className="departNameStyle">{history.newDepartName}</label>
                                            </div>
                                            <div className="positionNameDiv">
                                                <label className="positionNameStyle">{history.newPositionName}</label>
                                            </div>
                                        </div>
                                        <div className='transferredHistoryStyle'>
                                            <label className='transferredDateStyle'>{startDate} ~ {endDate}</label>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className='buttonClass'>
                        <button className='notice-cancel-button1' onClick={() => window.location.href = '/ManageMember'}>취소</button>
                        <button className='notice-confirm-button1' type="submit" form="memberForm" onClick={LinkToEditPage}>수정</button>
                    </div>
                </div>
            </div>
        </main>
    );
    
}

export default MemberPage;