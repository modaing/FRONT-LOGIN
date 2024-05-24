import { useNavigate, Link, useParams } from 'react-router-dom';
import { callGetMemberAPI, callGetTransferredHistory, callUpdateMemberAPI } from "../../apis/MemberAPICalls";
import { callGetDepartmentByDepartNoAPI } from "../../apis/DepartmentAPICalls";
import React, { useEffect, useState, useMemo, useRef } from "react";
import ChangePasswordModal from './ChangePasswordModal';
import { useSelector, useDispatch } from "react-redux";
import { decodeJwt } from '../../utils/tokenUtils';
import '../../css/member/profile.css';

function MyProfile() {
    
    const { memberId } = useParams();
    const [memberInfo, setMemberInfo] = useState(null);
    const [memberInformation, setMemberInformation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formattedEmployedDate, setFormattedEmployedDate] = useState('');
    const [formattedBirthday, setFormattedBirthday] = useState('');
    const [transferredHistoryInformation, setTransferredHistoryInformation] = useState([]);
    const [departmentName, setDepartmentNames] = useState(null);
    const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
    const token = window.localStorage.getItem("accessToken");
    const memberInfos = decodeJwt(token);
    const image = memberInfos.imageUrl;
    const imageUrl = `/img/${image}`;
    const navigate = useNavigate();

    const fetchMemberInfo = async (e) => {
        try {
            const memberInformation = await callGetMemberAPI(memberInfos.memberId);
            // console.log('response:', memberInformation);
            setMemberInfo(memberInformation);
            formatDate(memberInformation.employedDate);
            formatBirthDate(memberInformation.birthday);
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

    const formatBirthDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric'};
        const formattedDate = date.toLocaleDateString('ko-KR', options);
        setFormattedBirthday(formattedDate);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric'};
        const formattedDate = date.toLocaleDateString('ko-KR', options);
        setFormattedEmployedDate(formattedDate);
        // console.log('Formatted date:', formattedEmployedDate);
    }

    const handleChangePassword = () => {
        setChangePasswordModalVisible(true);
    }

    const handleCloseModal = () => {
        setChangePasswordModalVisible(false);
    }

    const fetchTransferredHistory = async() => {
        try {
            const transferredHistory = await callGetTransferredHistory(memberInfos.memberId);
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
        <main id="main" className="main2Pages12">
            <div className='firstPage'>
                <div className="pagetitle">
                    <h1>마이 프로필</h1>
                    <nav>
                        <ol className="breadcrumb">
                            {/* <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item">조직</li>
                            <li className="breadcrumb-item">구성원 관리</li> */}
                            {/* <li className="breadcrumb-item active">{memberInfo.name}</li> */}
                        </ol>
                    </nav>
                </div>
                <div className="rowStyle card columnStyle">
                    <div className="content1 contentStyle1">
                        <div className='imageBox'>
                            <img src={imageUrl} className='profilePic' alt="Profile" />
                            <div className='nameBox '>{memberInfo.name}</div>
                        </div>
                        <div className='topRightContainer'>
                            <button className='changePassword' onClick={handleChangePassword}>비밀번호 변경</button>
                        </div>
                        {/* <h1>hi</h1> */}
                    </div>
                    <div className='content1 contentStyle2 titleStyle'>
                        <div className="pagetitle pageTitleStyle" >
                            <h1>기본 정보</h1>
                        </div>
                    </div>
                    <div className='content1 contentStyle3 titleStyle'>
                    <div className='memberIdStyle'>
                        <label className='memberId'>사번</label>
                        <input className='inputStyle' value={memberInfo.memberId} />
                    </div>
                    <div className='memberIdStyle'>
                        <label className='memberId'>생일</label>
                        <input className='inputStyle' value={formattedBirthday} />
                    </div>
                    <div className='emailStyle'>
                        <label className='email'>이메일</label>
                        <input className='inputStyle' value={memberInfo.email} />
                    </div>
                    <div className='addressStyle'>
                        <label className='memberId'>주소</label>
                        <input className='inputStyle' value={memberInfo.address} />
                    </div>
                    <div className='phoneNoStyle'>
                        <label className='memberId'>휴대폰 번호</label>
                        <input className='inputStyle' value={memberInfo.phoneNo} />
                    </div>
                    <div className='employedDateStyle'>
                        <label className='memberId'>입사일</label>
                        <input className='inputStyle' value={formattedEmployedDate} />
                    </div>
                    <div className='departStyle'>
                        <label className='memberId'>부서</label>
                        <input className='inputStyle' value={memberInfo.departmentDTO.departName} />
                    </div>
                    <div className='positionStyle'>
                        <label className='position'>직급</label>
                        <input className='inputStyle' value={memberInfo.positionDTO.positionName} />
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
                            {/* <li className="breadcrumb-item"><a href="/">Home</a></li>
                            <li className="breadcrumb-item">조직</li>
                            <li className="breadcrumb-item">구성원 관리</li>
                            <li className="breadcrumb-item active">{memberInfo.name}'s 프로필</li> */}
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
                                    <br />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* </form> */}
            <ChangePasswordModal visible={changePasswordModalVisible} onClose={handleCloseModal} />
        </main>
    );
}

export default MyProfile;