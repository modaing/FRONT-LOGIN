import { decodeJwt } from "../../utils/tokenUtils";
import manageMemberCSS from './ManageMember.module.css';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { callChangePasswordAPI, callGetMemberAPI, callGetTransferredHistory, callUpdateMemberAPI, callGetDepartmentListAPI, callGetPositionListAPI } from "../../apis/MemberAPICalls";
import { callDepartmentDetailListAPI } from "../../apis/DepartmentAPICalls";
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
    const [department, setDepartment] = useState(null);
    const [departmentNumber, setDepartmentNumber] = useState('');
    const [filteredDepartInfo, setFilteredDepartInfo] = useState('');
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [inputtedPhoneNo, setInputtedPhoneNo] = useState('');
    const [name, setName] =useState('');
    const [positionName, setPositionName] = useState('');
    const [departName, setDepartName] = useState('');
    const [employedDate, setEmployedDate] = useState('');
    const [memberStatus, setMemberStatus] = useState('');
    const [role, setRole] = useState('');
    const [departmentInformation, setDepartmentInformation] = useState([]);
    const [positionInformation, setPositionInformation] = useState([]);
    const [positionDTO, setPositionDTO] = useState(null);
    const [departDTO, setDepartDTO] = useState(null);
    const [uploadedImage, setUploadedImage] = useState();
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [member, setMember] = useState({
        name: '',
        address: '',
        email: '',
        phoneNo: '',
        memberId: memberId,
        employedDate: '',
        memberStatus: '',
        departDTO: {
            departNo: '',
            departName: '',
        },
        positionDTO: {
            positionName: '',
            positionLevel: ''
        },
        role: '',
        // imageUrl: ''
    });

    const fetchMemberInfo = async (e) => {
        try {
            const memberInformation = await callGetMemberAPI(memberId);
            // console.log('response:', memberInformation);
            setMemberInfo(memberInformation);
            // console.log('memberInfo:', memberInfo);
            formatDate(memberInformation.employedDate);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch member:', error);
        }
    }

    const fetchDepartNameByDepartNo = async () => {
        try {
            const getDepartmentList = await callDepartmentDetailListAPI();
            if (Array.isArray(getDepartmentList)) {
                const departmentInfo = getDepartmentList.map(department => ({
                    ...department
                }));
                // setDepartment(departmentInfo);
                setFilteredDepartInfo(departmentInfo);
            } else {
                console.error ('department details is not an array:', getDepartmentList);
            }
        } catch (error) {
            console.error('부서 리스트를 불러 오는데 오류가 발생했습니다:', error);
        }
    }

    const profilePic = () => {
        const image = memberInfo.imageUrl;
        const imageUrl = `/img/${image}`;
        if (imagePreviewUrl) {
            return imagePreviewUrl
        } else {
            return imageUrl;
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric'};
        const formattedDate = date.toLocaleDateString('ko-KR', options);
        setFormattedEmployedDate(formattedDate);
        // console.log('Formatted date:', formattedEmployedDate);
    }

    const formatDateInCalendar = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    
    const today = formatDateInCalendar(new Date());

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
    
    const handleResetPassword = async (memberId) => {
        const confirmed = window.confirm("비밀번호를 초기화 하시겠습니끼?");

        if (confirmed){
            const response = await callChangePasswordAPI(memberId);
            // console.log('response:',response);
            if (response == "Password reset successfully") {
                alert('비밀번호를 초기화했습니다');
                window.location.reload();
            }
        }
    }

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

    const handleUpdateMember = async (e) => {
        e.preventDefault();
        /* 아무른 정보를 입력을 하지 않았으면  */
        // if (!member.name || !member.address || !member.email || !member.phoneNo || !member.memberStatus || !member.role || !member.employedDate || !member.departDTO.departNo || !member.positionDTO.positionName) {
        //     alert('수정한 정보가 없습니다');
        //     return;
        // }
        // console.log(uploadedImage);
        // console.log('member:',member);
    
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
                departNo: member.departDTO.departNo || memberInfo.departmentDTO.departNo, // Use existing department number as default if available
                departName: member.departDTO.departName || memberInfo.departmentDTO.departName, // Use selected department name as default if available
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

        if (hasChanges) {
            formData.append('memberDTO', new Blob([JSON.stringify(changedValues)], { type: 'application/json' }));
        } else {
            alert('수정한 정보가 없습니다');
        }
        console.log('formData:',formData);
        
        try {
            const response = await callUpdateMemberAPI(formData);
            console.log('response:',response);
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

    const fetchDepartments = async () => {
        try {
            const departmentList = await callGetDepartmentListAPI();
            setDepartmentInformation(departmentList);
            setDepartDTO(departmentList[0].departDTO);
        } catch (error) {
            console.error('부서 리스트 불러 오는데 오류 발생:', error); 
        }
    }

    /* 직급 호출 */
    const fetchPositions = async () => {
        try {
            const positionList = await callGetPositionListAPI();
            setPositionInformation(positionList);
            setPositionDTO(positionList[0].positionDTO);
            // console.log('positionInformation:', positionInformation);

            if (Array.isArray(positionList)) {
                setPositionInformation(positionList);
            } else {
                console.error('Position list is not an array:', positionList);
            }
        } catch (error) {
            console.error('직급 리스트 불러 오는데 오류 발생:', error)
        }
    }

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
        <main id="main" className="main main2Pages">
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
                                {/* <img src={profilePic()} className='profilePic' alt="Profile" /> */}
                                <div className="uploadContainer">
                                    <img className="profilePic" src={profilePic()} /><br/>
                                    <label className="uploadLabel" htmlFor="fileInput">사진 등록</label>
                                    <input
                                        id="fileInput"
                                        className="uploadLabel1"
                                        accept=".jpg, .jpeg, .png, .gif"
                                        type="file"
                                        onChange={(e) => handleFileUpload(e)}
                                        placeholder="사진 등록"
                                    />
                                </div>
                                {/* <div className='nameBox'>{memberInfo.name}</div> */}
                            </div>
                            {/* <h1>hi</h1> */}
                            <div className="alignButton">
                                <button className='changePassword' onClick={handleResetPassword}>비밀번호 초기화</button>
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
                                    className='inputStyle'
                                    defaultValue={memberInfo.name}
                                    onChange={(e) => setMember(prevState => ({
                                        ...prevState,
                                        name: e.target.value
                                    }))}
                                />
                            </div>
                            <div className='memberIdStyle'>
                                <label className='memberId'>사번</label>
                                <input
                                    className='inputStyleConfirmed'
                                    value={memberInfo.memberId}
                                    readOnly
                                />
                            </div>
                            <div className="positionStyle">
                                <label className='memberId'>부서</label>
                                {/* <input type='text' name='departmentName' id='departmentName' required value={departmentName} className={`col-sm-10 ${RegisterMemberCSS.shortInput}`} onChange={(e) => handleInputChange(e)}></input> */}
                                <select
                                    name='positionDTO'
                                    defaultValue={memberInfo.departmentDTO.departName}
                                    className="inputStyle"
                                    onChange={(e) => setMember(prevState => ({
                                        ...prevState,
                                        departDTO: {
                                            departNo: e.target.value,
                                            departName: e.target.options[e.target.selectedIndex].text
                                        }
                                    }))}
                                >
                                    <option disabled value="">부서 선택</option>
                                    {departmentInformation.map((department) => (
                                        <option key={department.departName} value={department.departNo}>{department.departName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="positionStyle">
                                <label className='position'>직급</label>
                                {/* <input type='text' name='departmentName' id='departmentName' required value={departmentName} className={`col-sm-10 ${RegisterMemberCSS.shortInput}`} onChange={(e) => handleInputChange(e)}></input> */}
                                <select
                                    name='positionDTO'
                                    defaultValue={memberInfo.positionDTO.positionName}
                                    className="inputStyle"
                                    onChange={(e) => setMember(prevState => ({
                                        ...prevState,
                                        positionDTO: {
                                            positionName: e.target.value,
                                            positionLevel: e.target.value
                                        }
                                    }))}
                                >
                                    <option disabled value="">직급 선택</option>
                                    {positionInformation.map((position) => (
                                        <option key={position.positionName} value={position.positionLevel}>{position.positionName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='employedDateStyle'>
                                <label className='memberId'>입사일</label>
                                <input
                                    type="date"
                                    className='inputStyle'
                                    defaultValue={formatDateInCalendar(memberInfo.employedDate)}
                                    max={today}
                                    onChange={(e) => setMember(prevState => ({
                                        ...prevState,
                                        employedDate: e.target.value
                                    }))}
                                />
                            </div>
                            <div className='emailStyle'>
                                <label className='email'>이메일</label>
                                <input
                                    className='inputStyle'
                                    defaultValue={memberInfo.email}
                                    onChange={(e) => setMember(prevState => ({
                                        ...prevState,
                                        email: e.target.value
                                    }))}
                                />
                            </div>
                            <div className='addressStyle'>
                                <label className='address'>주소</label>
                                <input
                                    className='inputStyle'
                                    defaultValue={memberInfo.address}
                                    onChange={(e) => setMember(prevState => ({
                                        ...prevState,
                                        address: e.target.value
                                    }))}
                                />
                            </div>
                            <div className='phoneNoStyle'>
                                <label className='phoneNo'>휴대폰 번호</label>
                                <input
                                    type="tel"
                                    className='inputStyle'
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
                                    className='inputStyle'
                                    defaultValue={memberInfo.memberStatus}
                                    onChange={(e) => setMember(prevState => ({
                                        ...prevState,
                                        memberStatus: e.target.value
                                    }))}
                                />
                            </div>
                            <div className="memberStatusStyle">
                                <label htmlFor="inputText" className="memberStatus">퍼미션</label>
                                <select
                                    name='role'
                                    defaultValue={memberInfo.role}
                                    className="inputStyle"
                                    onChange={(e) => setMember(prevState => ({
                                        ...prevState,
                                        role: e.target.value
                                    }))}
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
                    {/* <div className="col-lg-6 columnStyle"> */}
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
                                            <span id="departName" className='departNameStyle'>{history.newDepartName}</span> {/* Render department name */}
                                            <br /><br />
                                            <span className='positionNameStyle'>{history.newPositionName}</span>
                                            <br /><br />
                                            <hr />
                                            <br />
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="buttonClass">
                            <button className="notice-cancel-button" type='button' onClick={() => navigate('/manageMember')}>취소</button>
                            <button className="notice-confirm-button" onClick={handleUpdateMember}>저장</button>
                        </div>
                    {/* </div> */}
                </div>
                {/* <button></button> */}
            </div>
        </main>
    );
}

export default MemberPage;