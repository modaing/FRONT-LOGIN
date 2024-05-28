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
        birthday: {
            year: '',
            month: '',
            day: ''
        },
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

    /* 구성원 정보 호출 */
    const fetchMemberInfo = async (e) => {
        try {
            const memberInformation = await callGetMemberAPI(memberId);
            console.log('memberInformation:', memberInformation);
            setMemberInfo(memberInformation);
            formatDate(memberInformation.employedDate);
            formatDateInDigits(memberInformation.birthday);
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

    const formatDateInDigits = (dateString) => {
        console.log('dateString:',dateString);
        const year = String(dateString[0]);
        const month = String(dateString[1]).padStart(2, '0');
        const day = String(dateString[2]).padStart(2, '0');
        setOriginalYear(year);
        setOriginalMonth(month);
        setOriginalDay(day);
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
            console.log('transferred history:', transferredHistory);
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

        /* 생년월일 중 입력은 안한 값은 그대로 보내기 위한 logic */
        console.log('year:',member.birthday.year);
        console.log('month:',member.birthday.month);
        console.log('day:',member.birthday.day);
        
        if (!isNaN(member.birthday.year)) {
            member.birthday.year = originalYear;
            console.log('YEAR:', member.birthday.year);
        } 
        if (!isNaN(member.birthday.month)) {
            member.birthday.month = originalMonth;
            console.log('MONTH:', member.birthday.month);
        } 
        if (!isNaN(member.birthday.day)) {
            member.birthday.day = originalDay;
            console.log('DAY:', member.birthday.day);
        }

        const formattedBirthday = `${member.birthday.year}-${(member.birthday.month).padStart(2, '0')}-${(member.birthday.day).padStart(2, '0')}`;

        const changedValues = {
            name: member.name || memberInfo.name,  // Use existing member name as default if available
            address: member.address || memberInfo.address, // Use existing member address as default if available
            email: member.email || memberInfo.email, // Use existing member email as default if available
            memberId: memberId, // Use existing member ID from URL params
            employedDate: member.employedDate || memberInfo.employedDate, // Use existing employed date as default if available
            memberStatus: member.memberStatus || memberInfo.memberStatus, // Use existing member status as default if available
            role: member.role || memberInfo.role, // Use existing member role as default if available
            phoneNo: inputtedPhoneNo || memberInfo.phoneNo, // Use inputted phone number or empty string as default
            departmentDTO: {
                departNo: member.departmentDTO.departNo || memberInfo.departmentDTO.departNo, // Use existing department number as default if available
                departName: member.departmentDTO.departName || memberInfo.departmentDTO.departName, // Use selected department name as default if available
            },
            positionDTO: {
                positionName: member.positionDTO.positionName || memberInfo.positionDTO.positionName, // Use selected position name as default if available
                positionLevel: member.positionDTO.positionLevel || memberInfo.positionDTO.positionLevel, // Use existing position level as default if available
            },
            // birthday: formattedBirthday || memberInfo.birthday,
            birthday: formattedBirthday || memberInfo.birthday,
            // imageUrl: member.imageUrl || memberInfo.imageUrl
            imageUrl: memberInfo.imageUrl
        };

        const formData = new FormData();
        
        /*
         * 이미지를 저장을 하기 위한 logic.
         * 이미지를 올리지 않으면 empty 파일을 보내야 backend에서 받는다.
         * 그렇지 않으면 method 2개 만들어서 파일 없는 formData는 파일을 받지 않는 method으로 보낸다
         */
        if (uploadedImage) {
            formData.append('memberProfilePicture', uploadedImage);
        } else {
            const emptyFile = new File([], 'empty_file');
            formData.append('memberProfilePicture', emptyFile);
        }
        // formData.append('memberDTO', new Blob([JSON.stringify(changedValues)], { type: 'application/json' }));
        
        /* 변경이 되어있는 값들이 존재하는 경우, 멤버 수정할 것 */
        const hasChanges = Object.keys(changedValues).some(key => changedValues[key] !== memberInfo[key]);
        
        if (hasChanges) {
            /* 날짜를 제대로 입력을 했는지 확인하는 용도 */
            const day = parseInt(originalDay, 10);
            const month = parseInt(originalMonth, 10);
            
            if (day > 31 || month > 12 || day < 1 || month < 1) {
                alert('날짜를 제대로 입력하세요');
            } else if (member.email && !member.email.includes("@") && !member.email.includes(".com")) {
                alert('이메일을 제대로 입력해주세요\nhonggildong@gmail.com');
            }

            formData.append('memberDTO', new Blob([JSON.stringify(changedValues)], { type: 'application/json' }));
        } else {
            alert('수정한 정보가 없습니다');
        }
        // console.log('formData:',formData);
        
        try {
            const response = await callUpdateMemberAPI(formData);
            console.log('response:',response);
            if (response === '구성원 정보가 업데이트되었습니다') {
                console.log('response:',response);
                alert('구성원 정보 수정이 완료되었습니다');
                // window.location.reload();
            }
            fetchMemberInfo();
        } catch (error) {
            alert('error:', error);
            console.error('Failed to update member information:', error);
        }

        /* 직급이 변경 되었으면 인사발령내역에 반영할 것 */
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
        } else if (e.target.name === 'year') {
           const changedYear = e.target.value || originalYear;
           setMember(prevMember => ({
            ...prevMember,
            birthday: {
                year: changedYear
            }
           }));
        } else if (e.target.name === 'month') {
            const changedMonth = e.target.value || originalMonth;
            setMember(prevMember => ({
                ...prevMember,
                birthday: {
                    ...prevMember.birthday, // Spread previous state of birthday object
                    month: changedMonth
                }
            }));
        } else if (e.target.name === 'day') {
            const changedDay = e.target.value || originalDay;
           setMember(prevMember => ({
        ...prevMember,
        birthday: {
            ...prevMember.birthday, // Spread previous state of birthday object
            day: changedDay
        }
            }));
        }
        
         else {
            setMember(prevState => ({
                ...prevState,
                [e.target.name]: e.target.value
            }));
        }
        
    }

    /* 휴대폰 번호 형식에 (010-1111-2222) 맞게 변경하는 logic */
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
            <div className='firstPage123'>
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
                    <div className="card columnStyle">
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
                            </div>
                            <div className="alignButton">
                                <button className='changePassword' onClick={(e) => handleResetPassword(memberId, e)}>비밀번호 초기화</button>
                            </div>
                        </div>
                        <div className='content1 contentStyle2 titleStyle'>
                            <div className="pagetitle pageTitleStyle">
                                <h1>기본 정보</h1>
                            </div>
                        </div>
                        <div className='content1 contentStyle3 titleStyle'>
                            <div className='nameStyle'>
                                <label className='name'>이름</label>
                                <input
                                    name="name"
                                    className={`inputStyleForMember ${member.name && member.name !== memberInfo.name ? 'changed' : ''}`}
                                    defaultValue={memberInfo.name}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                            {/* <div className='nameStyle'>
                                <label className='name'>생일</label>
                                <input
                                    className={`inputStyle ${member.birthday && member.birthday !== memberInfo.birthday ? 'changed' : ''}`}
                                    name="birthday"
                                    type='date'
                                    defaultValue={formatDateInCalendar(memberInfo.birthday)}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div> */}
                            <div className="birthdayStyle">
                                <label htmlFor="birthday" className="birthday">생년월일</label>
                                <div className="inputStyleForBirthdayForMember">
                                    <div className='inputWrapper'>
                                        <input
                                            name='year'
                                            type='text'
                                            id="birth-year"
                                            maxLength={4}
                                            pattern='^[0-9]{4}'
                                            required='required'
                                            defaultValue={originalYear}
                                            onKeyUp={(e) => next(e, 4, 'birth-month')}
                                            className={`inputStylesForYear ${member.birthday.year && member.birthday.year !== originalYear ? 'changed' : ''}`}
                                            onChange={(e) => setMember(prevMember => ({ ...prevMember, birthday: { ...prevMember.birthday, year: e.target.value }}))}
                                        />
                                        <span>년</span>
                                        </div>
                                    <div className='inputWrapper'>
                                        <input
                                            name='month'
                                            type='number'
                                            id="birth-month"
                                            maxLength={2}
                                            pattern='^[0-9]{2}'
                                            required='required'
                                            defaultValue={originalMonth}
                                            onKeyUp={(e) => next(e, 2, 'birth-day')}
                                            className={`inputStylesForMonth ${member.birthday.month && member.birthday.month !== originalMonth ? 'changed' : ''}`}
                                            onChange={(e) => setMember(prevMember => ({ ...prevMember, birthday: { ...prevMember.birthday, month: e.target.value }}))}
                                            max="12"
                                        />
                                        <span>월</span>
                                    </div>
                                    <div className='inputWrapper'>
                                        <input
                                            name='day'
                                            type='number'
                                            id="birth-day"
                                            maxLength={2}
                                            pattern='^[0-9]{2}'
                                            required='required'
                                            defaultValue={originalDay}
                                            className={`inputStylesForDays ${member.birthday.day && member.birthday.day !== originalDay ? 'changed' : ''}`}
                                            onChange={(e) => setMember(prevMember => ({ ...prevMember, birthday: { ...prevMember.birthday, day: e.target.value }}))}
                                            max="31"
                                        />
                                        <span>일</span>
                                    </div>
                                </div>
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
                                    // value={inputtedPhoneNo || memberInfo.phoneNo}
                                    // defaultValue={memberInfo.departmentDTO.departNo}
                                    // value={memberInfo.departmentDTO.departNo}
                                    value={inputtedDepartment.departNo || memberInfo.departmentDTO.departNo} // Set value to inputtedDepartment if available, otherwise use memberInfo
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
                                    // defaultValue={memberInfo.positionDTO.positionName}
                                    key={memberInfo.positionDTO.positionName}
                                    // value={memberInfo.positionDTO.positionLevel}
                                    value={inputtedPosition.positionLevel || memberInfo.positionDTO.positionLevel} // Set value to inputtedPosition if available, otherwise use memberInfo
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
                            </div>
                            <div className="addressStyle">
                                <label htmlFor="inputText" className="address">주소</label>
                                <input
                                    type='text'
                                    name='inputtedAddress'
                                    defaultValue={inputtedAddress}
                                    className='inputStyleForMember'
                                    onChange={(e) => handleInputChange(e)}
                                    onClick={handleComplete}
                                    onKeyPress={handleKeyPress}
                                    readOnly
                                />
                                <button className='inputAddressButton' onClick={handleComplete}>주소 검색</button>
                                {popup && <Post company={enroll_company} setcompany={setEnroll_company} onClose={handleCloseModal} onAddData={handleAddData} className="modal-backdrop"/>}
                            </div>
                            <div className="emailStyle">
                                <label htmlFor="inputText" className="email">상세 주소</label>
                                <input
                                    type='text'
                                    name='address'
                                    // defaultValue={memberInfo.address}
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
                                    // defaultValue={memberInfo.phoneNo}
                                    // value={inputtedPhoneNo}
                                    value={inputtedPhoneNo || memberInfo.phoneNo} // Use inputtedPhoneNo if it's not empty, otherwise use memberInfo.phoneNo
                                    pattern="010-\d{4}-\d{4}" // 휴대폰 형식
                                    onChange={handlePhoneNoChange}
                                    placeholder="010-1234-5678"
                                    required="required"
                                />
                            </div>

                            <div className='memberStatusStyle'>
                                <label className='memberStatus'>상태</label>
                                <input
                                    className={`inputStyleForMember ${member.memberStatus && member.memberStatus !== memberInfo.memberStatus ? 'changed' : ''}`}
                                    name="memberStatus"
                                    defaultValue={memberInfo.memberStatus}
                                    onChange={(e) => handleInputChange(e)}
                                />
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
                            <div className="pagetitle pageTitleStyle">
                                <h1>인사 발령 내역</h1>
                            </div>
                            {transferredHistoryInformation.map((history, index) => {
                                const startDate = history.transferredDate.map(d => d.toString().padStart(2, '0')).join('.'); // Format start date
                                const endDate = index === transferredHistoryInformation.length - 1 
                                    ? '현재' 
                                    : transferredHistoryInformation[index + 1].transferredDate.map(d => d.toString().padStart(2, '0')).join('.'); // Format end date
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
                        <button className='notice-cancel-button' onClick={() => window.location.href = '/ManageMember'}>취소</button>
                        <button className='notice-confirm-button' type="submit" form="memberForm">저장</button>
                    </div>
                </div>
            </div>
        </main>
    );
    
}

export default MemberPage;