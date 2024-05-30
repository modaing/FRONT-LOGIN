import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import Post from './Post';
// import '../../css/common.css'
import '../../css/member/registerMember.css';
import RegisterMemberCSS from './RegistMember.module.css';
import { callRegisterMemberAPI, callGetDepartmentListAPI, callGetPositionListAPI, callShowAllMemberListAPI } from '../../apis/MemberAPICalls';
import { height } from '@mui/system';

function RegisterMember() {
    const navigate = useNavigate();
    const [uploadedImage, setUploadedImage] = useState();
    const [uploadedImageUrl, setUploadedImageUrl] = useState();
    const [departmentInformation, setDepartmentInformation] = useState([]);
    const [positionInformation, setPositionInformation] = useState([]);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [inputtedPhoneNo, setInputtedPhoneNo] = useState('010-');
    const [allMemberInfo, setAllMemberInfo] = useState(null);
    const [memberIdLists, setMemberIdLists] = useState([]);
    const [generatedMemberId, setGeneratedMemberId] = useState();
    const [popup, setPopup] = useState(false);
    const [inputtedAddress, setInputtedAddress] = useState('');
    const [postAddress, setPostAddress] = useState('');
    const [fullAddress, setFullAddress] = useState('');
    const [enroll_company, setEnroll_company] = useState({
        address:'',
    });
    const handleCloseModal = () => {
        setPopup(false);
    };

    const [member, setMember] = useState({
        name: '',
        address: '',
        email: '',
        phoneNo: '',
        memberId: '',
        employedDate: '',
        memberStatus: '',
        // birthday: {
        //     year: '',
        //     month: '',
        //     day: ''
        // },
        birthday: '',
        gender: '',
        departDTO: {
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
    const {name, address, employedDate, phoneNo, memberStatus, birthday, gender, departDTO, positionDTO, role, email, memberId} = member;

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }

    // const next = (e, len, nextId) => {
    //     if (e.target.value.length == len) {
    //         document.getElementById(nextId).focus();
    //     }
    // }

    const handleAddData = (data) => {
        // console.log('data received from Post component:', data.address);
        setInputtedAddress(data.address);
        console.log('address::',data.address);
    }

    /* 부서 리스트 호출 */
    const fetchDepartments = async () => {
        try {
            const departmentList = await callGetDepartmentListAPI();
            setDepartmentInformation(departmentList);
            console.log('departmentList:', departmentList);
        } catch (error) {
            console.error('부서 리스트 불러 오는데 오류 발생:', error); 
        }
    }

    /* 직급 호출 */
    const fetchPositions = async () => {
        try {
            const positionList = await callGetPositionListAPI();
            setPositionInformation(positionList);
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

    /* memberId가 존재하는지 확인할려고 가져온 logic */
    const fetchMemberLists = async () => {
        try {
            const memberLists = await callShowAllMemberListAPI();
            if (Array.isArray(memberLists)) {
                const formattedMembers = memberLists.map(member => ({
                    ...member,
                    employedDate: formatDate(member.employedDate)
                }));
                setAllMemberInfo(formattedMembers);
                // console.log('formatted members:', formattedMembers);
                // console.log('filteredMemberInfo:',filteredMemberInfo);
                const memberIds = memberLists.map(member => member.memberId);
                console.log('memberIds:', memberIds);
                setMemberIdLists(memberIds);
            } else {
                console.error('member list is not an array:', memberLists);
            }
        } catch (error) {
            console.error('구성원 리스트 불러 오는데 오류가 발생했습니다:', error);
        }
    };

    const generateRandomThreeDigits = () => {
        return Math.floor(100 + Math.random() * 900);
    }

    /* 구성원 memberId 앞(6자리)를 자동으로 생성 */
    const generateMemberId = () => {
        const date = new Date();
        const year = String(date.getFullYear()).substring(2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const randomThreeDigits = generateRandomThreeDigits();

        const memberId =`${year}${month}${day}${randomThreeDigits}`;

        setGeneratedMemberId(memberId);
        return memberId;
    }
    
    /* 현재 yyyy-MM-dd format으로 받아오기 */
    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleComplete = (e) => {
        e.preventDefault();
        setPopup(!popup);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'departDTO') {
            const selectedDepartNo = value;
            const selectedDepartName = e.target.options[e.target.selectedIndex].text;

            setMember(prevMember => ({
                ...prevMember,
                departDTO: {
                    departNo: selectedDepartNo,
                    departName: selectedDepartName
                },
                // memberId: generateMemberId(selectedDepartNo),
            }));
        } else if (name === 'positionDTO') {
            const selectedPositionLevel = value;
            const selectedPositionName = e.target.options[e.target.selectedIndex].text;

            setMember(prevMember => ({
                ...prevMember,
                positionDTO: {
                    positionName: selectedPositionName,
                    positionLevel: selectedPositionLevel
                }
            }));
        } else if (name === 'gender') {
            setMember(prevMember => ({
                ...prevMember,
                gender: value
            }));
        } else if (name === 'inputtedAddress') {
            setPostAddress(value);
        } else if (name === 'address') {
            const fullAddress = inputtedAddress + ' ' + value;
            console.log('fullAddress:',fullAddress);
            setFullAddress(fullAddress);
            setMember(prevMember => ({
                ...prevMember,
                [name]: fullAddress
            }))
        
        } else if (name === 'birthday') {
            console.log('inputted birthday:', value);
            setMember(prevMember => ({
                ...prevMember,
                birthday: value
            }));
        } else {
            setMember(prevMember => ({
                ...prevMember,
                [name]: value
            }));
        }
    };

    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0])  {
            const uploadedImage = e.target.files[0];
            console.log(typeof uploadedImage);
            setUploadedImage(uploadedImage);
            const imageUrl = URL.createObjectURL(uploadedImage);
            console.log(typeof imageUrl);
            setImagePreviewUrl(imageUrl);
        }
    };

    const formatDate = (dateArray) => {
        if (Array.isArray(dateArray) && dateArray.length === 3) {
            const [year, month, day] = dateArray;

            const formattedMonth = String(month).padStart(2, '0');
            const formattedDay = String(day).padStart(2, '0');

            return `${year}-${formattedMonth}-${formattedDay}`;
        } else {
            return dateArray;
        }
    }

    const formatDateInCalendar = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // const years = [];
    // for (let i = 1940; i <= new Date().getFullYear(); i++) {
    //     years.push(i);
    // }

    // const months = [
    //     { value: '01', label: '1월' },
    //     { value: '02', label: '2월' },
    //     { value: '03', label: '3월' },
    //     { value: '04', label: '4월' },
    //     { value: '05', label: '5월' },
    //     { value: '06', label: '6월' },
    //     { value: '07', label: '7월' },
    //     { value: '08', label: '8월' },
    //     { value: '09', label: '9월' },
    //     { value: '10', label: '10월' },
    //     { value: '11', label: '11월' },
    //     { value: '12', label: '12월' },
    // ];

    // const days = Array.from({ length: 31 }, (_, i) => i + 1);
    
    // const yearOptions = years.map(year => (
    //     <option key={year} value={year}>{year}년</option>
    // ));

    // const monthOptions = months.map(month => (
    //     <option key={month.value} value={month.value}>{month.label}</option>
    // ));

    // const dayOptions = days.map(day => (
    //     <option key={day} value={day}>{day}일</option>
    // ));

    const today = formatDateInCalendar(new Date());

    const handlePhoneNoChange = (e) => {
        const rawPhoneNumber = e.target.value.replace(/[^\d]/g, ''); // Remove non-numeric characters
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

    const returnPage = () => {
        const userConfirmed = window.confirm('등록 그만하시고 돌아가시겠습니까?');
    
        if (userConfirmed) {
            navigate('/manageMember');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            // Set employedDate to the current date when the component mounts
            setMember((prevMember) => ({ ...prevMember, employedDate: getCurrentDate() }));
    
            // Generate memberId based on departDTO and positionDTO
            const memberIdThatHasBeenGenerated = generateMemberId();
            console.log('memberIdThatHasBeenGenerated:', memberIdThatHasBeenGenerated);

            // Update memberId
            setMember((prevMember) => ({
                ...prevMember,
                memberId: generateMemberId(),
            }));

            // Fetch departments and positions
            await Promise.all([fetchDepartments(), fetchPositions(), fetchMemberLists()]);
    
            // Set the image preview URL when imageUrl changes
            if (uploadedImageUrl) {
                if (typeof uploadedImageUrl === 'string' && uploadedImageUrl.startsWith('data:image')) {
                    // If imageUrl is already a data URL, set it directly as the preview URL
                    setUploadedImageUrl(uploadedImageUrl);
                } else {
                    // Otherwise, read the file as a data URL and set it as the preview URL
                    const reader = new FileReader();
                    reader.onload = () => {
                        setUploadedImageUrl(reader.result);
                    };
                    reader.readAsDataURL(uploadedImageUrl);
                }
            }
        };
    
        fetchData();
    }, []);

    /* 구성원 등록할 때 보내줄 정보들 */
    const registerMember = async (e) => {
        e.preventDefault();

        const cleanedPhoneNo = inputtedPhoneNo.replace(/-/g, '');

        // console.log('휴대폰번호:', cleanedPhoneNo);
        if (cleanedPhoneNo.length !== 11 && !cleanedPhoneNo.startsWith('01')) {
            alert('휴대폰 번호를 올바른 형식으로 입력하세요 (010-1234-5678)');
            return;
        }

        // const { year, month, day } = birthday;
        // const formattedBirthday = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        const formData = new FormData();

        // formData.append('memberDTO', new Blob([JSON.stringify({name: name, address: address, email, email, memberId: memberId, memberStatus: "재직", employedDate: employedDate, password: '0000', role: role, phoneNo: inputtedPhoneNo, departmentDTO: {departNo: departDTO.departNo, departName: departDTO.departName}, positionDTO: {positionName: positionDTO.positionName, positionLevel: positionDTO.positionLevel}})], { type: 'application/json'}));
        formData.append('memberDTO', new Blob([JSON.stringify({name: name, address: address, email: email, birthday: birthday, gender: gender, memberId: memberId, memberStatus: "재직", employedDate: employedDate, password: '0000', role: role, phoneNo: inputtedPhoneNo, departmentDTO: {departNo: departDTO.departNo, departName: departDTO.departName}, positionDTO: {positionName: positionDTO.positionName, positionLevel: positionDTO.positionLevel}})], { type: 'application/json'}));
        formData.append('memberProfilePicture', uploadedImage);

        const memberDTOFile = formData.get('memberDTO');
        
        const memberDTOString = await memberDTOFile.text();
        const memberDTO = JSON.parse(memberDTOString);
        console.log('memberDTO:',memberDTO);

        
        try {
            await callRegisterMemberAPI(formData);

            alert(`memberId: ${memberId}을 등록하는데 성공했습니다`);
            // window.location.reload();
            navigate("/ManageMember");
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };
    
    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>구성원 등록</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">조직</li>
                        <li className="breadcrumb-item">구성원 관리</li>
                        <li className="breadcrumb-item active">구성원 등록</li>
                    </ol>
                </nav>
            </div>
            <div className="col-lg-12">
                <div className={`card ${RegisterMemberCSS.cardFontSize}`}>
                    <h5 className="card-title"></h5>
                    <div className="content">
                        <form onSubmit={(e) => registerMember(e)}>

                            <div className={RegisterMemberCSS.dividePage}>
                                <div className={RegisterMemberCSS.leftSection}>

                                    <div className={RegisterMemberCSS.uploadContainer}>
                                        <img className={RegisterMemberCSS.profilePic} src={imagePreviewUrl}/><br/>
                                        <label className={RegisterMemberCSS.uploadLabel}>
                                        <span className='uploadPictureForRegistration'>사진 등록</span>
                                        <input
                                            accept='.jpg, .jpeg, .png, .gif'
                                            type="file"
                                            // style={{ marginLeft: "20px"}}
                                            className={RegisterMemberCSS}
                                            onChange={handleFileUpload}
                                            required={true}
                                        />
                                        </label>
                                    </div>
                                    <br />
                                    <br />

                                    <div className="nameStyleForRegisteration">
                                        <label htmlFor='name' className="name">이름</label>
                                        <input
                                            type='text'
                                            name='name'
                                            value={name}
                                            className="inputStyles"
                                            onChange={(e) => handleInputChange(e)}
                                            required={true}
                                        />
                                    </div>
                                    <br />

                                    <div className="birthdayStyle" id={RegisterMemberCSS.inputBox}>
                                        <label htmlFor="inputText" className="birthday">생년월일</label>
                                        <input
                                            type='date'
                                            max={today}
                                            name='birthday'
                                            value={birthday}
                                            className="inputStyles"
                                            onChange={(e) => handleInputChange(e)}
                                            required={true}
                                        />
                                    </div>


                                    <br />
                                    <div className="genderStyle">
                                        <label htmlFor="inputText" className="gender">성별</label>
                                        <select
                                            style={{height: '52.22px' }}
                                            type='text'
                                            name='gender'
                                            value={gender}
                                            className="inputStyles"
                                            onChange={(e) => handleInputChange(e)}
                                            required={true}
                                        >
                                            <option value="">성별</option>
                                            <option value="M">남자</option>
                                            <option value="F">여자</option>
                                            {/* <label htmlFor="male">남</label>
                                            <input type="radio" id="male" name="gender" value="male" checked={gender === 'male'} onChange={handleInputChange} />
                                            <label htmlFor="female">여</label>
                                            <input type="radio" id="female" name="gender" value="female" checked={gender === 'female'} onChange={handleInputChange} /> */}
                                        </select>
                                    </div>
                                    <br />
                                    <div className="addressStyleForRegistration">
                                        <label htmlFor="inputText" className="address">주소</label>
                                        {/* <input
                                            type='text'
                                            name='address'
                                            value={address}
                                            className="inputStyles"
                                            onChange={(e) => handleInputChange(e)}
                                        /> */}
                                        <input
                                            type='text'
                                            name='inputtedAddress'
                                            defaultValue={inputtedAddress}
                                            value={inputtedAddress}
                                            className='inputStyles'
                                            onChange={(e) => handleInputChange(e)}
                                            onClick={handleComplete}
                                            required={true}
                                            onKeyPress={handleKeyPress}
                                        />
                                        <button className='inputAddressButton' onClick={handleComplete}>주소 검색</button>
                                        {popup && <Post company={enroll_company} setcompany={setEnroll_company} onClose={handleCloseModal} onAddData={handleAddData}/>}
                                    </div>
                                    <br />
                                    <div className="emailStyleForRegistration">
                                        <label htmlFor="inputText" className="email">상세 주소</label>
                                        <input
                                            type='text'
                                            name='address'
                                            // value={detailedAddress}
                                            defaultValue={address}
                                            className="inputStyles"
                                            onChange={(e) => handleInputChange(e)}
                                            required={true}
                                        />
                                    </div>
                                    <br />
                                    <div className="emailStyleForRegistration">
                                        <label htmlFor="inputText" className="email">이메일</label>
                                        <input
                                            type='text'
                                            name='email'
                                            value={email}
                                            className="inputStyles"
                                            onChange={(e) => handleInputChange(e)}
                                            required={true}
                                        />
                                    </div>
                                    <br />

                                    <div className="phoneNoStyleForRegistration">
                                        <label htmlFor="inputText" className="phoneNo">전화번호</label>
                                        {/* <input type='text' name='phoneNo' value={phoneNo} className={`col-sm-10 ${RegisterMemberCSS.shortInput}`} onChange={(e) => handleInputChange(e)}></input> */}
                                        <input
                                            type='text'
                                            name='phoneNo'
                                            value={inputtedPhoneNo}
                                            className="inputStyles"
                                            pattern="010-\d{4}-\d{4}" // 휴대폰 형식
                                            onChange={handlePhoneNoChange}
                                            placeholder='010-1234-5678'
                                            required={true}
                                        />
                                    </div>
                                    <br />
                                </div>
                            </div>
                            
                            <div className={RegisterMemberCSS.verticalLine}></div>
                            <div className={RegisterMemberCSS.dividePage}>
                                <div className={RegisterMemberCSS.rightSection}>

                                    <div className="memberIdStyle" id={RegisterMemberCSS.inputBox}>
                                        <label htmlFor="inputText" className="memberId">사번</label>
                                        <input
                                            type='text'
                                            name='memberId'
                                            value={generatedMemberId}
                                            className="inputStyles"
                                            readOnly
                                        />
                                    </div>
                                    <br />

                                    <div className="employedDateStyle" id={RegisterMemberCSS.inputBox}>
                                        <label htmlFor="inputText" className="employedDate">입사일</label>
                                        <input
                                            type='date'
                                            max={today}
                                            name='employedDate'
                                            value={employedDate}
                                            className="inputStyles"
                                            onChange={(e) => handleInputChange(e)}
                                            required={true}
                                        />
                                    </div>
                                    <br />

                                    <div className="departStyle">
                                        <label htmlFor="inputText" className="employedDate">부서</label>
                                        <select
                                            name='departDTO'
                                            value={departDTO.departNo}
                                            className="inputStyles"
                                            onChange={(e) => handleInputChange(e)}
                                            required={true}
                                        >
                                            <option value="">부서 선택</option>
                                            {departmentInformation.map((departments) => (
                                                <option key={departments.departNo} value={departments.departNo}>{departments.departName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <br />

                                    <div className="positionStyle" id={RegisterMemberCSS.inputBox}>
                                        <label htmlFor="inputText" className="employedDate">직급</label>
                                        {/* <input type='text' name='departmentName' id='departmentName' required value={departmentName} className={`col-sm-10 ${RegisterMemberCSS.shortInput}`} onChange={(e) => handleInputChange(e)}></input> */}
                                        <select
                                            name='positionDTO'
                                            value={positionDTO.positionLevel}
                                            className="inputStyles"
                                            onChange={(e) => handleInputChange(e)}
                                            required={true}
                                        >
                                            <option value="">직급 선택</option>
                                            {positionInformation.map((positions) => (
                                                <option key={positions.positionName} value={positions.positionLevel}>{positions.positionName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <br />

                                    <div className="memberStatusStyle" id={RegisterMemberCSS.inputBox}>
                                        <label htmlFor="inputText" className="memberStatus">권한</label>
                                        <select
                                            type='text'
                                            name='role'
                                            value={role}
                                            className="inputStyles"
                                            onChange={(e) => handleInputChange(e)}
                                            required={true}
                                        >
                                            <option value="">권한 설정</option>
                                            <option value="ADMIN">관리자</option>
                                            <option value="MEMBER">구성원</option>
                                        </select>
                                    </div>
                            <div className={RegisterMemberCSS.buttonClass}>
                                <button className={RegisterMemberCSS['notice-cancel-button']} type='button' onClick={returnPage}>취소</button>
                                <button className={RegisterMemberCSS['notice-insert-button']}>등록</button>
                            </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
export default RegisterMember;