import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import '../../css/common.css'
import RegisterMemberCSS from './RegistMember.module.css';
import { callRegisterMemberAPI, callGetDepartmentListAPI, callGetPositionListAPI } from '../../apis/MemberAPICalls';

function RegisterMember() {
    const navigate = useNavigate();
    const [uploadedImage, setUploadedImage] = useState();
    const [uploadedImageUrl, setUploadedImageUrl] = useState();
    const [departmentInformation, setDepartmentInformation] = useState([]);
    const [positionInformation, setPositionInformation] = useState([]);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [inputtedPhoneNo, setInputtedPhoneNo] = useState('');
    const [generatedMemberId, setGeneratedMemberId] = useState();
    const [member, setMember] = useState({
        name: '',
        address: '',
        email: '',
        phoneNo: '',
        memberId: '',
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
        imageUrl: ''
    });
    const {name, address, employedDate, phoneNo, memberStatus, departDTO, positionDTO, role, email, memberId, imageUrl} = member;

    /* 부서 리스트 호출 */
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
            console.log('positionInformation:', positionInformation);

            if (Array.isArray(positionList)) {
                setPositionInformation(positionList);
            } else {
                console.error('Position list is not an array:', positionList);
            }
        } catch (error) {
            console.error('직급 리스트 불러 오는데 오류 발생:', error)
        }
    }

    const generateRandomThreeDigits = () => {
        return Math.floor(100 + Math.random() * 900);
    }

    /* 구성원 memberId는 자동으로 생성 */
    const generateMemberId = (departNo) => {
        const date = new Date();
        const year = String(date.getFullYear()).substring(2);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const randomThreeDigits = generateRandomThreeDigits();
        const paddedDepartNo = String(departNo).padStart(2, '0');

        const memberId =`${year}${month}${paddedDepartNo}${randomThreeDigits}`;
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

    useEffect(() => {
        const fetchData = async () => {
            // Set employedDate to the current date when the component mounts
            setMember((prevMember) => ({ ...prevMember, employedDate: getCurrentDate() }));
    
            // Generate memberId based on departDTO and positionDTO
            const generateMemberId = () => {
                const date = new Date();
                const year = String(date.getFullYear()).substring(2);
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const randomThreeDigits = Math.floor(100 + Math.random() * 900);

                const memberId =`${year}${month}${departDTO.departNo}${randomThreeDigits}`;

                return memberId;
            };

            // Update memberId
            setMember((prevMember) => ({
                ...prevMember,
                memberId: generateMemberId(),
            }));

            // Fetch departments and positions
            await Promise.all([fetchDepartments(), fetchPositions()]);
    
            // Set the image preview URL when imageUrl changes
            if (imageUrl) {
                if (typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
                    // If imageUrl is already a data URL, set it directly as the preview URL
                    setUploadedImageUrl(imageUrl);
                } else {
                    // Otherwise, read the file as a data URL and set it as the preview URL
                    const reader = new FileReader();
                    reader.onload = () => {
                        setUploadedImageUrl(reader.result);
                    };
                    reader.readAsDataURL(imageUrl);
                }
            }
        };
    
        fetchData();
    }, []);

    const handleInputChange = async (e) => {
        if (e.target.name === 'departDTO') {
            const selectedDepartNo = e.target.value;
            const selectedDepartName = e.target.options[e.target.selectedIndex].text;
    
            setMember(prevMember => ({
                ...prevMember,
                departDTO: {
                    departNo: selectedDepartNo,
                    departName: selectedDepartName
                },
                memberId: generateMemberId(selectedDepartNo),
            }));
        } else if (e.target.name === 'positionDTO') {
            const [positionName, positionLevel] = e.target.value.split('|');
            const selectedPositionLevel = e.target.value;
            const selectedPositionName = e.target.options[e.target.selectedIndex].text;
    
            setMember(prevMember => ({
                ...prevMember,
                positionDTO: {
                    positionName: selectedPositionName,
                    positionLevel: selectedPositionLevel
                }
            }));
        } else {
            setMember(prevMember => ({
                ...prevMember,
                [e.target.name]: e.target.value
            }));
        }
    }

    
    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0])  {
            const uploadedImage = e.target.files[0];
            setUploadedImage(uploadedImage);
            const imageUrl = URL.createObjectURL(uploadedImage);
            setImagePreviewUrl(imageUrl);
        }
    };
    

    /* 구성원 등록할 때 보내줄 정보들 */
    const registerMember = async (e) => {
        e.preventDefault();

        const cleanedPhoneNo = inputtedPhoneNo.replace(/-/g, '');

        console.log('휴대폰번호:', cleanedPhoneNo);
        if (cleanedPhoneNo.length !== 11) {
            alert('휴대폰 번호를 올바른 형식으로 입력하세요 (010-1234-5678)');
            return;
        }

        const formData = new FormData();

        // formData.append('memberDTO', new Blob([JSON.stringify({name: name, address: address, email, email, memberId: memberId, memberStatus: "재직", employedDate: employedDate, password: '0000', role: role, phoneNo: inputtedPhoneNo, departmentDTO: {departNo: departDTO.departNo, departName: departDTO.departName}, positionDTO: {positionName: positionDTO.positionName, positionLevel: positionDTO.positionLevel}})], { type: 'application/json'}));
        formData.append('memberDTO', new Blob([JSON.stringify({name: name, address: address, email, email, memberId: memberId, memberStatus: "재직", employedDate: employedDate, password: '0000', role: role, phoneNo: inputtedPhoneNo, departmentDTO: {departNo: departDTO.departNo, departName: departDTO.departName}, positionDTO: {positionName: positionDTO.positionName, positionLevel: positionDTO.positionLevel}})], { type: 'application/json'}));
        formData.append('memberProfilePicture', uploadedImage);

        try {
            await callRegisterMemberAPI(formData);

            alert(`memberId: ${memberId}을 등록하는데 성공했습니다`);
            // window.location.reload();
            // navigate("/ManageMember");
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

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
    }
    
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
                                        <span>사진 등록</span>
                                        <input accept='.jpg, .jpeg, .png, .gif' type="file" className={RegisterMemberCSS} onChange={handleFileUpload} />
                                        </label>
                                    </div>
                                    <br />
                                    <br />

                                    <div className="row mb-3">
                                        <label htmlFor='name' className="col-sm-1 col-form-label">이름</label>
                                        <input type='text' name='name' value={name} className={`col-sm-10 ${RegisterMemberCSS.shortInput}`} onChange={(e) => handleInputChange(e)}></input>
                                    </div>
                                    <br />

                                    <div className="row mb-3">
                                        <label htmlFor="inputText" className="col-sm-1 col-form-label">주소</label>
                                        <input type='text' name='address' value={address} className={`col-sm-10 ${RegisterMemberCSS.shortInput}`} onChange={(e) => handleInputChange(e)}></input>
                                    </div>
                                    <br />

                                    <div className="row mb-3">
                                        <label htmlFor="inputText" className="col-sm-1 col-form-label">이메일</label>
                                        <input type='text' name='email' value={email} className={`col-sm-10 ${RegisterMemberCSS.shortInput}`} onChange={(e) => handleInputChange(e)}></input>
                                    </div>
                                    <br />

                                    <div className="row mb-3">
                                        <label htmlFor="inputText" className="col-sm-1 col-form-label">휴대폰 번호</label>
                                        {/* <input type='text' name='phoneNo' value={phoneNo} className={`col-sm-10 ${RegisterMemberCSS.shortInput}`} onChange={(e) => handleInputChange(e)}></input> */}
                                        <input type='text' name='phoneNo' value={inputtedPhoneNo} className={`col-sm-10 ${RegisterMemberCSS.shortInput}`} onChange={handlePhoneNoChange} placeholder='010-1234-5678'></input>
                                    </div>
                                    <br />

                                </div>
                            </div>
                            
                            <div className={RegisterMemberCSS.verticalLine}></div>
                            <div className={RegisterMemberCSS.dividePage}>
                                <div className={RegisterMemberCSS.rightSection}>

                                    <div className="row mb-3" id={RegisterMemberCSS.inputBox}>
                                        <label htmlFor="inputText" className="col-sm-1 col-form-label">사번</label>
                                        <input type='text' name='memberId' value={memberId} className={`col-sm-10 ${RegisterMemberCSS.shortInput}`} readOnly></input>
                                    </div>
                                    <br />

                                    <div className="row mb-3" id={RegisterMemberCSS.inputBox}>
                                        <label htmlFor="inputText" className="col-sm-1 col-form-label">입사일</label>
                                        <input type='date' name='employedDate' value={employedDate} className={`col-sm-10 ${RegisterMemberCSS.shortInput}`} onChange={(e) => handleInputChange(e)}></input>
                                    </div>
                                    <br />

                                    <div className="row mb-3" id={RegisterMemberCSS.inputBox}>
                                        <label htmlFor="inputText" className="col-sm-1 col-form-label">부서</label>
                                        <select name='departDTO' value={departDTO.departNo} className={`col-sm-10 ${RegisterMemberCSS.shortInput}`} onChange={(e) => handleInputChange(e)}>
                                            <option value="">부서 선택</option>
                                            {departmentInformation.map((departments) => (
                                                <option key={departments.departNo} value={departments.departNo}>{departments.departName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <br />

                                    <div className="row mb-3" id={RegisterMemberCSS.inputBox}>
                                        <label htmlFor="inputText" className="col-sm-1 col-form-label">직급</label>
                                        {/* <input type='text' name='departmentName' id='departmentName' required value={departmentName} className={`col-sm-10 ${RegisterMemberCSS.shortInput}`} onChange={(e) => handleInputChange(e)}></input> */}
                                        <select name='positionDTO' value={positionDTO.positionLevel} className={`col-sm-10 ${RegisterMemberCSS.shortInput}`} onChange={(e) => handleInputChange(e)}>
                                            <option value="">직급 선택</option>
                                            {positionInformation.map((positions) => (
                                                <option key={positions.positionName} value={positions.positionLevel}>{positions.positionName}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <br />

                                    <div className="row mb-3" id={RegisterMemberCSS.inputBox}>
                                        <label htmlFor="inputText" className="col-sm-1 col-form-label">퍼미션</label>
                                        <select type='text' name='role' value={role} className={`col-sm-10 ${RegisterMemberCSS.shortInput}`} onChange={(e) => handleInputChange(e)}>
                                            <option value="">권한 설정</option>
                                            <option value="ADMIN">관리자</option>
                                            <option value="MEMBER">구성원</option>
                                        </select>
                                    </div>
                            <div className={RegisterMemberCSS.buttonClass}>
                                <button className={RegisterMemberCSS['notice-cancel-button']} type='button' onClick={() => navigate('/manageMember')}>취소하기</button>
                                <button className={RegisterMemberCSS['notice-insert-button']}>등록하기</button>
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