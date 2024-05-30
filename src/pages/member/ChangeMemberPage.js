import { useNavigate, Link, useParams } from 'react-router-dom';
import { callChangePasswordAPI, callGetMemberAPI, callGetTransferredHistory, callUpdateMemberAPI, callGetDepartmentListAPI, callGetPositionListAPI } from "../../apis/MemberAPICalls";
import { callDepartmentDetailListAPI } from "../../apis/DepartmentAPICalls";
import React, { useEffect, useState, useMemo, useRef } from "react";
import Post from './Post';
import { useSelector, useDispatch } from "react-redux";
import '../../css/member/memberPage.css';

function ChangeMemberPage() {
    
    const { memberId } = useParams();
    const [memberInfo, setMemberInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formattedEmployedDate, setFormattedEmployedDate] = useState('');
    const [emailError, setEmailError] = useState('');
    const [transferredHistoryInformation, setTransferredHistoryInformation] = useState([]);
    const [popup, setPopup] = useState(false);
    const [inputtedAddress, setInputtedAddress] = useState('');
    const [postAddress, setPostAddress] = useState('');
    const [fullAddress, setFullAddress] = useState('');
    const [formattedBirthday, setFormattedBirthday] = useState('');
    const navigate = useNavigate();
    const [originalYear, setOriginalYear] = useState('');
    const [originalMonth, setOriginalMonth] = useState('');
    const [originalDay, setOriginalDay] = useState('');
    const [inputtedPhoneNo, setInputtedPhoneNo] = useState('');
    const [departmentInformation, setDepartmentInformation] = useState([]);
    const [positionInformation, setPositionInformation] = useState([]);
    const [uploadedImage, setUploadedImage] = useState();
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [inputtedPosition, setInputtedPosition] = useState({
        positionName: '',
        positionName: ''
    });
    const [inputtedDepartment, setInputtedDepartment] = useState({
        departNo: '',
        departName: ''
    });

    const [member, setMember] = useState({
        name: '',
        address: '',
        email: '',
        phoneNo: '',
        memberId: memberId,
        employedDate: '',
        memberStatus: '',
        birthday: '',
        // birthday: {
        //     year: '',
        //     month: '',
        //     day: ''
        // },
        gender: '',
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

    const [enroll_company, setEnroll_company] = useState({
        address:'',
    });

    const handleAddData = (data) => {
        // console.log('data received from Post component:', data.address);
        setInputtedAddress(data.address);
        console.log('address::',data.address);
    }

    const handleCloseModal = () => {
        setPopup(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }

    const handleComplete = (e) => {
        e.preventDefault();
        setPopup(!popup);
    }

    const next = (e, len, nextId) => {
        if (e.target.value.length == len) {
            document.getElementById(nextId).focus();
        }
    }

    const validateEmail = (email) => {
        // Updated regex pattern to ensure email ends with .com
        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
        return emailRegex.test(email);
    };
    

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
    // const handleUpdateMember = async (e) => {
    //     e.preventDefault();

    //     const changedValues = {
    //         name: member.name || memberInfo.name,  // Use existing member name as default if available
    //         address: member.address || memberInfo.address, // Use existing member address as default if available
    //         email: member.email || memberInfo.email, // Use existing member email as default if available
    //         memberId: memberId, // Use existing member ID from URL params
    //         employedDate: member.employedDate || memberInfo.employedDate, // Use existing employed date as default if available
    //         memberStatus: member.memberStatus || memberInfo.memberStatus, // Use existing member status as default if available
    //         role: member.role || memberInfo.role, // Use existing member role as default if available
    //         phoneNo: inputtedPhoneNo || memberInfo.phoneNo, // Use inputted phone number or empty string as default
    //         departmentDTO: {
    //             departNo: member.departmentDTO.departNo || memberInfo.departmentDTO.departNo, // Use existing department number as default if available
    //             departName: member.departmentDTO.departName || memberInfo.departmentDTO.departName, // Use selected department name as default if available
    //         },
    //         positionDTO: {
    //             positionName: member.positionDTO.positionName || memberInfo.positionDTO.positionName, // Use selected position name as default if available
    //             positionLevel: member.positionDTO.positionLevel || memberInfo.positionDTO.positionLevel, // Use existing position level as default if available
    //         },
    //         // birthday: formattedBirthday || memberInfo.birthday,
    //         birthday: member.birthday || memberInfo.birthday,
    //         // imageUrl: member.imageUrl || memberInfo.imageUrl
    //         imageUrl: memberInfo.imageUrl
    //     };

    //     const formData = new FormData();
        
    //     if (uploadedImage) {
    //         formData.append('memberProfilePicture', uploadedImage);
    //     } else {
    //         const emptyFile = new File([], 'empty_file');
    //         formData.append('memberProfilePicture', emptyFile);
    //     }
    //     // formData.append('memberDTO', new Blob([JSON.stringify(changedValues)], { type: 'application/json' }));
        
    //     const hasChanges = Object.keys(changedValues).some(key => changedValues[key] !== memberInfo[key]);
        
    //     if (hasChanges) {
    //         formData.append('memberDTO', new Blob([JSON.stringify(changedValues)], { type: 'application/json' }));
    //     }

    //     if (!hasChanges) {
    //         alert('수정한 정보가 없습니다');
    //         return;
    //     }
    //     console.log('formData:',formData);
        
    //     try {
    //         const response = await callUpdateMemberAPI(formData);
    //         console.log('response:',response);
    //         if (response === '구성원 정보가 업데이트되었습니다') {
    //             alert('구성원 정보를 성공적으로 업데이트했습니다');
    //             navigate(-1);
    //         }
    //         fetchMemberInfo();
    //     } catch (error) {
    //         console.error('Failed to update member information:', error);
    //     }

    //     const updatedTransferredHistory = transferredHistoryInformation.map(history => ({
    //         ...history,
    //         newPositionName: member.positionDTO.positionName // Update newPositionName for each transferred history item
    //     }));
    
    //     // Set the updated transferred history information state
    //     setTransferredHistoryInformation(updatedTransferredHistory);
    // }

    const handleUpdateMember = async (e) => {
        e.preventDefault();
    
        const changedValues = {
            name: member.name || memberInfo.name,  
            address: member.address || memberInfo.address, 
            email: member.email || memberInfo.email, 
            memberId: memberId, 
            employedDate: member.employedDate || memberInfo.employedDate, 
            memberStatus: member.memberStatus || memberInfo.memberStatus, 
            role: member.role || memberInfo.role, 
            phoneNo: inputtedPhoneNo || memberInfo.phoneNo, 
            departmentDTO: {
                departNo: member.departmentDTO.departNo || memberInfo.departmentDTO.departNo, 
                departName: member.departmentDTO.departName || memberInfo.departmentDTO.departName, 
            },
            positionDTO: {
                positionName: member.positionDTO.positionName || memberInfo.positionDTO.positionName, 
                positionLevel: member.positionDTO.positionLevel || memberInfo.positionDTO.positionLevel, 
            },
            birthday: member.birthday || memberInfo.birthday,
            imageUrl: memberInfo.imageUrl
        };
    
        const formData = new FormData();
    
        if (uploadedImage) {
            formData.append('memberProfilePicture', uploadedImage);
        } else {
            const emptyFile = new File([], 'empty_file');
            formData.append('memberProfilePicture', emptyFile);
        }
    
        // Check if any changes were made
        // const hasChanges = Object.keys(changedValues).some(key => {
        //     if (key === 'departmentDTO' || key === 'positionDTO') {
        //         return JSON.stringify(changedValues[key]) !== JSON.stringify(memberInfo[key]);
        //     }
        //     return changedValues[key] !== memberInfo[key];
        // });

        const hasChanges = Object.keys(changedValues).some(key => {
            if (key === 'departmentDTO' || key === 'positionDTO') {
                const changed = JSON.stringify(changedValues[key]) !== JSON.stringify(memberInfo[key]);
                console.log(`Comparing ${key}:`, changedValues[key], memberInfo[key], changed);
                return changed;
            }
            const changed = changedValues[key] !== memberInfo[key];
            console.log(`Comparing ${key}:`, changedValues[key], memberInfo[key], changed);
            return changed;
        });
        
    
        if (!hasChanges) {
            alert('수정한 정보가 없습니다');
            return;
        }

        if (e.target.name === 'memberStatus' && e.target.value === '퇴직') {
            alert('해당 구성원의 정보는 3년뒤에 자동으로 삭제가 됩니다');
        }
    
        try {
            formData.append('memberDTO', new Blob([JSON.stringify(changedValues)], { type: 'application/json' }));
            console.log('formData:', formData);
    
            const response = await callUpdateMemberAPI(formData);
            console.log('response:', response);
    
            if (response === '구성원 정보가 업데이트되었습니다') {
                alert('구성원 정보를 성공적으로 업데이트했습니다');
                navigate(-1);
            }
            fetchMemberInfo();
        } catch (error) {
            console.error('Failed to update member information:', error);
        }
    
        const updatedTransferredHistory = transferredHistoryInformation.map(history => ({
            ...history,
            newPositionName: member.positionDTO.positionName 
        }));
    
        setTransferredHistoryInformation(updatedTransferredHistory);
    };
    

    const onClickCancel = () => {
        const userConfirmed = window.confirm('정보 수정을 그만하시고 돌아가시겠습니까?');
        if (userConfirmed) {
            navigate(-1);
        } else {
            return;
        }
    }

    /* 변경된 내용 반영 */
    const handleInputChange = async (e) => {

        if (e.target.name === 'departmentDTO') {
            const selectedDepartNo = e.target.value;
            const selectedDepartName = e.target.options[e.target.selectedIndex].text;
            setInputtedDepartment({
                departNo: selectedDepartNo,
                departName: selectedDepartName
            })

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
            setInputtedPosition({
                positionLevel: selectedPositionLevel,
                positionName: selectedPositionName
            });

            setMember(prevState => ({
                ...prevState,
                positionDTO: {
                    positionName: selectedPositionName,
                    positionLevel: selectedPositionLevel
                }
            }));
        } else if (e.target.name === 'inputtedAddress') {
            setPostAddress(e.target.value);
        } else if (e.target.name === 'address') {
            const fullAddress = inputtedAddress + ' ' + e.target.value;
            console.log('fullAddress:',fullAddress);
            setFullAddress(fullAddress);
            setMember(prevMember => ({
                ...prevMember,
                address: fullAddress
            }))
        } 
         else {
            setMember(prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            }));
        }
        
    }

    const formatPhoneNumber = (phoneNo) => {
        const input = phoneNo.replace(/[^\d]/g, ''); // Remove non-numeric characters
        if (input.startsWith("010")) {
            if (input.length <= 3) {
                return input;
            } else if (input.length <= 7) {
                return `010-${input.substring(3, 7)}`;
            } else {
                return `010-${input.substring(3, 7)}-${input.substring(7, 11)}`;
            }
        } else {
            return `010-${input}`;
        }
    };    

    const handlePhoneNoChange = (e) => {
        let rawPhoneNumber = e.target.value.replace(/[^\d]/g, ''); // Remove non-numeric characters
        
        if (rawPhoneNumber.length > 11) {
            rawPhoneNumber = rawPhoneNumber.substring(0, 11);
        }
        
        let formattedPhoneNumber = '';

        if (!rawPhoneNumber.startsWith('01')) {
            formattedPhoneNumber = '01';
        } else {
            if (rawPhoneNumber.length <= 3) {
                formattedPhoneNumber = rawPhoneNumber;
            } else if (rawPhoneNumber.length <= 7) {
                formattedPhoneNumber = `${rawPhoneNumber.substring(0, 3)}-${rawPhoneNumber.substring(3)}`;
            } else {
                formattedPhoneNumber = `${rawPhoneNumber.substring(0, 3)}-${rawPhoneNumber.substring(3, 7)}-${rawPhoneNumber.substring(7, 11)}`;
            }
        }

        setInputtedPhoneNo(formattedPhoneNumber);
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
            <div className='firstPage123 columnStyle1'>
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
                <form id="memberForm" onSubmit={handleUpdateMember}>
                    <div className="card columnStyle1">
                        <div className="content1 contentStyle1">
                            <div className='imageBox'>
                                <div className="uploadContainer">
                                    <img className="profilePic" src={profilePic()} /><br/>
                                    <label className="uploadButton">
                                        사진 등록
                                        <input
                                            className="uploadInput"
                                            accept=".jpg, .jpeg, .png, .gif"
                                            type="file"
                                            onChange={(e) => handleFileUpload(e)}
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="alignButton">
                                <button className='resetPasswordButton' onClick={(e) => handleResetPassword(memberId, e)}>비밀번호 초기화</button>
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
                                    className={`inputStyleForMember ${member.name && member.name !== memberInfo.name ? 'changed' : ''}`}
                                    defaultValue={memberInfo.name}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            <div className='nameStyle'>
                                <label className='name'>생년월일</label>
                                <input
                                    className={`inputStyleForMember ${member.birthday && member.birthday !== memberInfo.birthday ? 'changed' : ''}`}
                                    name="birthday"
                                    type='date'
                                    defaultValue={formatDateInCalendar(memberInfo.birthday)}
                                    onChange={(e) => handleInputChange(e)}
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
                                <select
                                    className={`inputStyleForMember ${inputtedDepartment.departName && inputtedDepartment.departName !== memberInfo.departmentDTO.departName ? 'changed' : ''}`}
                                    name='departmentDTO'
                                    key={memberInfo.departmentDTO.departName}
                                    value={inputtedDepartment.departNo || memberInfo.departmentDTO.departNo}
                                    onChange={(e) => handleInputChange(e)}
                                >
                                    <option value="default" disabled>
                                        부서를 입력하세요
                                    </option>
                                    {departmentInformation.map((department) => (
                                        <option
                                            key={department.departName}
                                            value={department.departNo}
                                        >
                                            {department.departName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="positionStyle">
                                <label className='position'>직급</label>
                                <select
                                    className={`inputStyleForMember ${member.positionDTO.positionName && member.positionDTO.positionName !== memberInfo.positionDTO.positionName ? 'changed' : ''}`}
                                    name='positionDTO'
                                    key={memberInfo.positionDTO.positionName}
                                    value={inputtedPosition.positionLevel || memberInfo.positionDTO.positionLevel}
                                    onChange={(e) => handleInputChange(e)}
                                >
                                    <option
                                        value="default"
                                        disabled
                                    >
                                        직급 선택
                                    </option>
                                    {positionInformation.map((position) => (
                                        <option key={position.positionName} value={position.positionLevel}>
                                            {position.positionName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='employedDateStyle'>
                                <label className='email'>입사일</label>
                                <input
                                    className={`inputStyleForMember ${member.employedDate && member.employedDate !== memberInfo.employedDate ? 'changed' : ''}`}
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
                                    className={`inputStyleForMember ${member.email && member.email !== memberInfo.email ? 'changed' : ''}`}
                                    name="email"
                                    defaultValue={memberInfo.email}
                                    onChange={(e) => handleInputChange(e)}
                                />
                                {emailError && <span className="error">{emailError}</span>}
                            </div>
                            <div className="addressStyle">
                                <label htmlFor="inputText" className="address">주소</label>
                                <input
                                    type='text'
                                    name='inputtedAddress'
                                    defaultValue={inputtedAddress}
                                    className={`inputStyleForMember ${member.address && member.address !== memberInfo.address ? 'changed': ''}`}
                                    onChange={(e) => handleInputChange(e)}
                                    onClick={handleComplete}
                                    onKeyPress={handleKeyPress}
                                    readOnly
                                />
                                <button className='inputAddressButton1' onClick={handleComplete}>주소 검색</button>
                                {popup && <Post company={enroll_company} setcompany={setEnroll_company} onClose={handleCloseModal} onAddData={handleAddData} className="modal-backdrop"/>}
                            </div>
                            <div className="emailStyle">
                                <label htmlFor="inputText" className="email">전체 주소</label>
                                <input
                                    type='text'
                                    name='address'
                                    defaultValue={inputtedAddress !== '' ? '' : memberInfo.address}
                                    className={`inputStyleForMember ${member.address && member.address !== memberInfo.address ? 'changed' : ''}`}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            <div className='phoneNoStyle'>
                                <label className='phoneNo'>전화번호</label>
                                <input
                                    className={`inputStyleForMember ${inputtedPhoneNo && inputtedPhoneNo !== memberInfo.phoneNo ? 'changed' : ''}`}
                                    type="text"
                                    name="phoneNo"
                                    value={inputtedPhoneNo || memberInfo.phoneNo}
                                    pattern="010-\d{4}-\d{4}"
                                    onChange={handlePhoneNoChange}
                                    placeholder="010-1234-5678"
                                    required="required"
                                />
                            </div>
    
                            <div className='memberStatusStyle'>
                                <label className='memberStatus'>상태</label>
                                <select
                                    className={`inputStyleForMember ${member.memberStatus && member.memberStatus !== memberInfo.memberStatus ? 'changed' : ''}`}
                                    name="memberStatus"
                                    defaultValue={memberInfo.memberStatus}
                                    onChange={(e) => handleInputChange(e)}
                                >
                                    <option value="재직">재직</option>
                                    <option value="퇴직">퇴직</option>
                                    <option value="육아">육아</option>
                                </select>
                            </div>
                            <div className="memberStatusStyle">
                                <label htmlFor="inputText" className="memberStatus">권한</label>
                                <select
                                    className={`inputStyleForMember ${member.role && member.role !== memberInfo.role ? 'changed' : ''}`}
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
                        <button className='notice-cancel-button1' onClick={onClickCancel}>취소</button>
                        <button className='notice-confirm-button1' type="submit" form="memberForm">저장</button>
                    </div>
                </div>
            </div>
        </main>
    );
    
    
}

export default ChangeMemberPage;