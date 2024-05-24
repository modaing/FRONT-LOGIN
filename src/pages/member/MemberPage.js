import { useNavigate, Link, useParams } from 'react-router-dom';
import { callChangePasswordAPI, callGetMemberAPI, callGetTransferredHistory, callUpdateMemberAPI, callGetDepartmentListAPI, callGetPositionListAPI } from "../../apis/MemberAPICalls";
import { callDepartmentDetailListAPI } from "../../apis/DepartmentAPICalls";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import '../../css/member/memberPage.css';

function MemberPage() {
    
    const { memberId } = useParams();
    const [memberInfo, setMemberInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formattedEmployedDate, setFormattedEmployedDate] = useState('');
    const [transferredHistoryInformation, setTransferredHistoryInformation] = useState([]);
    const [filteredDepartInfo, setFilteredDepartInfo] = useState('');
    const navigate = useNavigate();
    const [inputtedPhoneNo, setInputtedPhoneNo] = useState('');
    const [departmentInformation, setDepartmentInformation] = useState([]);
    const [positionInformation, setPositionInformation] = useState([]);
    const [uploadedImage, setUploadedImage] = useState();
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [inputChangedd, setInputChangedd] = useState(false);

    const [member, setMember] = useState({
        name: '',
        address: '',
        email: '',
        phoneNo: '',
        memberId: memberId,
        employedDate: '',
        memberStatus: '',
        departmentDTO: {
            departNo: '',
            departName: '',
        },
        positionDTO: {
            positionName: '',
            positionLevel: ''
        },
        role: '',
        imageUrl: ''
    });

    /* 구성원 정보 호출 */
    const fetchMemberInfo = async (e) => {
        try {
            const memberInformation = await callGetMemberAPI(memberId);
            // console.log('response:', memberInformation);
            setMemberInfo(memberInformation);
            console.log('memberInformation:',memberInformation);
            console.log(`memberInfo's departName:`, memberInfo.departmentDTO.departName);
            console.log(`member's positionName:`, memberInfo.positionDTO.positionName);
            formatDate(memberInformation.employedDate);
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
        return `${year}-${month}-${day}`;
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

    /* 이미지 upload */
    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0])  {
            const uploadedImage = e.target.files[0];
            setUploadedImage(uploadedImage);
            const imageUrl = URL.createObjectURL(uploadedImage);
            setImagePreviewUrl(imageUrl);
            setMember(prevState => ({
                ...prevState,
                imageUrl: uploadedImage // Update imageUrl to the generated URL
            }));
        }
    };    

    /* 구성원 정보 수정 */
    const handleUpdateMember = async (e) => {
        e.preventDefault();

        const changedValues = {
            name: member.name || memberInfo.name,  // Use existing member name as default if available
            address: member.address || memberInfo.address, // Use existing member address as default if available
            email: member.email || memberInfo.email, // Use existing member email as default if available
            memberId: memberId, // Use existing member ID from URL params
            employedDate: member.employedDate || memberInfo.employedDate, // Use existing employed date as default if available
            memberStatus: member.memberStatus || memberInfo.memberStatus, // Use existing member status as default if available
            role: member.role || memberInfo.role, // Use existing member role as default if available
            phoneNo: member.phoneNo || memberInfo.phoneNo, // Use inputted phone number or empty string as default
            departmentDTO: {
                departNo: member.departmentDTO.departNo || memberInfo.departmentDTO.departNo, // Use existing department number as default if available
                departName: member.departmentDTO.departName || memberInfo.departmentDTO.departName, // Use selected department name as default if available
            },
            positionDTO: {
                positionName: member.positionDTO.positionName || memberInfo.positionDTO.positionName, // Use selected position name as default if available
                positionLevel: member.positionDTO.positionLevel || memberInfo.positionDTO.positionLevel, // Use existing position level as default if available
            },
            // imageUrl: member.imageUrl || memberInfo.imageUrl
            imageUrl: memberInfo.imageUrl
        };

        const formData = new FormData();
        
        if (uploadedImage) {
            formData.append('memberProfilePicture', uploadedImage);
        } else {
            const emptyFile = new File([], 'empty_file');
            formData.append('memberProfilePicture', emptyFile);
        }
        // formData.append('memberDTO', new Blob([JSON.stringify(changedValues)], { type: 'application/json' }));
        
        const hasChanges = Object.keys(changedValues).some(key => changedValues[key] !== memberInfo[key]);

        if (!hasChanges) {
            alert('수정한 정보가 없습니다');
            return;
        }

        if (hasChanges) {
            formData.append('memberDTO', new Blob([JSON.stringify(changedValues)], { type: 'application/json' }));
        } else {
            alert('수정한 정보가 없습니다');
        }
        console.log('formData:',formData);
        
        try {
            const response = await callUpdateMemberAPI(formData);
            console.log('response:',response);
            if (response === '구성원 정보가 업데이트되었습니다') {
                window.location.reload();
            }
            fetchMemberInfo();
        } catch (error) {
            console.error('Failed to update member information:', error);
        }

        const updatedTransferredHistory = transferredHistoryInformation.map(history => ({
            ...history,
            newPositionName: member.positionDTO.positionName // Update newPositionName for each transferred history item
        }));
    
        // Set the updated transferred history information state
        setTransferredHistoryInformation(updatedTransferredHistory);
    }

    /* 변경된 내용 반영 */
    const handleInputChange = async (e) => {
        if (e.target.name === 'departmentDTO') {
            const selectedDepartNo = e.target.value;
            const selectedDepartName = e.target.options[e.target.selectedIndex].text;

            setMember(prevState => ({
                ...prevState,
                departmentDTO: {
                    departNo: selectedDepartNo,
                    departName: selectedDepartName
                }
            }));
        } else if (e.target.name === 'positionDTO') {
            const selectedPositionLevel = e.target.value;
            const selectedPositionName = e.target.options[e.target.selectedIndex].text;

            setMember(prevState => ({
                ...prevState,
                positionDTO: {
                    positionName: selectedPositionName,
                    positionLevel: selectedPositionLevel
                }
            }));
        } else {
            setMember(prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            }));
        }
    }

    /* 휴대폰 번호 */
    const handlePhoneNoChange = (e) => {
        const rawPhoneNumber = e.target.value.replace(/[^\d]/g, ''); // Remove non-numeric characters
        let formattedPhoneNumber = '';

        // Format the phone number according to the Korean format
        if (rawPhoneNumber.length < 4) {
            formattedPhoneNumber = rawPhoneNumber;
        } else if (rawPhoneNumber.length < 7) {
            formattedPhoneNumber = `${rawPhoneNumber.substring(0, 3)}-${rawPhoneNumber.substring(3)}`;
        } else if (rawPhoneNumber.length < 11) {
            formattedPhoneNumber = `${rawPhoneNumber.substring(0, 3)}-${rawPhoneNumber.substring(3, 6)}-${rawPhoneNumber.substring(6)}`;
        } else {
            formattedPhoneNumber = `${rawPhoneNumber.substring(0, 3)}-${rawPhoneNumber.substring(3, 7)}-${rawPhoneNumber.substring(7, 11)}`;
        }
            
        setInputtedPhoneNo(formattedPhoneNumber);
        setMember(prevState => ({
            ...prevState,
            phoneNo: formattedPhoneNumber
        }));
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
        <main id="main" className="main2Pages">
            <div className='firstPage'>
                <div className="pagetitle">
                    <h1>구성원 관리</h1>
                    <nav>
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item">조직</li>
                            <li className="breadcrumb-item"><a href="/ManageMember">구성원 관리</a></li>
                            <li className="breadcrumb-item active">{memberInfo.name}'s 프로필</li>
                        </ol>
                    </nav>
                </div>
                <form id="memberForm" onSubmit={handleUpdateMember} className="main2Pages">
                {/* <form id="memberForm" className="main2Pages"> */}
                    <div className="rowStyle card columnStyle">
                        <div className="content1 contentStyle1">
                            <div className='imageBox'>
                                <div className="uploadContainer">
                                    <img className="profilePic" src={profilePic()} /><br/>
                                    <label className="uploadButton">
                                        <span>사진 등록
                                        <input
                                            className="uploadInput"
                                            accept=".jpg, .jpeg, .png, .gif"
                                            type="file"
                                            onChange={(e) => handleFileUpload(e)}
                                        />
                                        </span>
                                    </label>
                                </div>
                                {/* <div className='nameBox'>{memberInfo.name}</div> */}
                            </div>
                            {/* <h1>hi</h1> */}
                            <div className="alignButton">
                                <button className='changePassword' onClick={(e) => handleResetPassword(memberId,e)}>비밀번호 초기화</button>
                            </div>
                        </div>
                        <div className='content1 contentStyle2 titleStyle'>
                            <div className="pagetitle pageTitleStyle" >
                                <h1>기본 정보</h1>
                            </div>
                        </div>
                        <div className='content1 contentStyle3 titleStyle'>
                            <div className='nameStyle'>
                                <label className='name'>이름</label>
                                {/* <input
                                    className='inputStyle'
                                    defaultValue={memberInfo.name}
                                    onChange={(e) => setName(e.target.value)}
                                /> */}
                                <input
                                    name="name"
                                    className={`inputStyle ${member.name && member.name !== memberInfo.name ? 'changed' : ''}`}
                                    defaultValue={memberInfo.name}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            <div className='memberIdStyle'>
                                <label className='memberId'>사번</label>
                                <input
                                    name="memberId"
                                    className='inputStyle confirmed'
                                    value={memberInfo.memberId}
                                    readOnly
                                />
                            </div>
                            <div className="departStyle">
                                <label className='memberId'>부서</label>
                                <select
                                    className={`inputStyle ${member.departmentDTO.departName && member.departmentDTO.departName !== memberInfo.departmentDTO.departName ? 'changed' : ''}`}
                                    name='departmentDTO'
                                    defaultValue={memberInfo.departmentDTO.departName} // Set default value based on departName
                                    onChange={(e) => handleInputChange(e)}
                                >
                                    {departmentInformation.map((department) => (
                                        <option key={department.departName} value={department.departNo}>{department.departName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="positionStyle">
                                <label className='position'>직급</label>
                                <select
                                    className={`inputStyle ${member.positionDTO.positionName && member.positionDTO.positionName !== memberInfo.positionDTO.positionName ? 'changed' : ''}`}
                                    name='positionDTO'
                                    defaultValue={memberInfo.positionDTO.positionName}
                                    onChange={(e) => handleInputChange(e)}
                                >
                                    {positionInformation.map((position) => (
                                        <option key={position.positionName} value={position.positionLevel}>{position.positionName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='employedDateStyle'>
                                <label className='email'>입사일</label>
                                <input
                                    className={`inputStyle ${member.employedDate && member.employedDate !== memberInfo.employedDate ? 'changed' : ''}`}
                                    name="employedDate"
                                    type="date"
                                    defaultValue={formatDateInCalendar(memberInfo.employedDate)}
                                    max={today}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            <div className='emailStyle'>
                                <label className='email'>이메일</label>
                                <input
                                    className={`inputStyle ${member.email && member.email !== memberInfo.email ? 'changed' : ''}`}
                                    name="email"
                                    defaultValue={memberInfo.email}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            <div className='addressStyle'>
                                <label className='address'>주소</label>
                                <input
                                    className={`inputStyle ${member.address && member.address !== memberInfo.address ? 'changed' : ''}`}
                                    name="address"
                                    defaultValue={memberInfo.address}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            <div className='phoneNoStyle'>
                                <label className='phoneNo'>휴대폰 번호</label>
                                <input
                                    className={`inputStyle ${member.phoneNo && member.phoneNo !== memberInfo.phoneNo ? 'changed' : ''}`}
                                    name="phoneNo"
                                    type="tel"
                                    defaultValue={memberInfo.phoneNo}
                                    // value={inputtedPhoneNo}
                                    onChange={(e) => handlePhoneNoChange(e)}
                                    placeholder="010-1234-5678"
                                    maxLength={11}
                                />
                            </div>
                            <div className='memberStatusStyle'>
                                <label className='memberStatus'>상태</label>
                                <input
                                    className={`inputStyle ${member.memberStatus && member.memberStatus !== memberInfo.memberStatus ? 'changed' : ''}`}
                                    name="memberStatus"
                                    defaultValue={memberInfo.memberStatus}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            <div className="memberStatusStyle">
                                <label htmlFor="inputText" className="memberStatus">권한</label>
                                <select
                                    className={`inputStyle ${member.role && member.role !== memberInfo.role ? 'changed' : ''}`}
                                    name='role'
                                    defaultValue={memberInfo.role}
                                    onChange={(e) => handleInputChange(e)}
                                >
                                    <option value="ADMIN">관리자</option>
                                    <option value="MEMBER">구성원</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
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
                <div className="rowStyle columnStyle1">
                    <div className="card cardOuterLine2">
                        <div className='content1 contentStyle3 titleStyle'>
                            <div className="pagetitle pageTitleStyle" >
                                <h1>인사 발령 내역</h1>
                            </div>
                            {/* Mapping through transferredHistoryInformation to display new_position_name and transferred_date */}
                            {transferredHistoryInformation.map((history, index) => {
                                const startDate = history.transferredDate.map(d => d.toString().padStart(2, '0')).join('.'); // Format start date
                                const endDate = index === transferredHistoryInformation.length - 1 ? '현재' : history.transferredDate.map(d => d.toString().padStart(2, '0')).join('.'); // Format end date or mark as '현재'
                                const dateRange = `${startDate} ~ ${endDate}`; // Combine start and end dates
                                return (
                                    <div key={index} className='transferredHistory'>
                                        <div className="transferredDateStyleOuter">
                                            <span className='transferredDateStyle'>{dateRange}</span>
                                        </div>
                                        <div className="departNameStyleOuter">
                                            <div className="departNameDiv">부서명 : </div>
                                            <span className='departNameStyle'>{history.newDepartName}</span>
                                        </div>
                                        <div className="positionNameStyleOuter">
                                            <div className="positionNameDiv">직급명 :</div>
                                            <span className='positionNameStyle'>{history.newPositionName}</span>
                                        </div>
                                        <hr className="divider"/>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="buttonClass">
                        <button className="notice-cancel-button" type='button' onClick={() => navigate('/manageMember')}>취소</button>
                        <button className="notice-confirm-button" onClick={handleUpdateMember}>저장</button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default MemberPage;