


import React, { useEffect, useState } from 'react';
import '../../css/member/profile.css';
import { decodeJwt } from '../../utils/tokenUtils';
import { callGetMemberAPI, callGetTransferredHistory, callResetPasswordAPI } from '../../apis/MemberAPICalls';
import ChangePasswordModal from './ChangePasswordModal';
function MyProfile() {
    const token = window.localStorage.getItem("accessToken");
    const memberInfo = decodeJwt(token);
    console.log('memberInfo details:', memberInfo);
    const image = memberInfo.imageUrl;
    const imageUrl = `/img/${image}`;
    const [memberInformation, setMemberInformation] = useState('');
    const [formattedEmployedDate, setFormattedEmployedDate] = useState('');
    const [transferredHistoryInformation, setTransferredHistoryInformation] = useState('');
    const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);

    console.log('transferredHistory:', transferredHistoryInformation);

    const fetchMemberInfo = async () => {
        try {
          const memberInformation = await callGetMemberAPI(memberInfo.memberId);
          setMemberInformation(memberInformation);
          formatDate(memberInformation.employedDate);
          console.log('구성원 정보:', memberInformation);
        } catch (error) {
          console.error('Failed in bringing member information:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric'};
        const formattedDate = date.toLocaleDateString('ko-KR', options);
        setFormattedEmployedDate(formattedDate);
        console.log('Formatted date:', formattedEmployedDate);
    }

    const fetchTransferredHistory = async() => {
        try {
            const transferredHistory = await callGetTransferredHistory(memberInfo.memberId);
            setTransferredHistoryInformation(transferredHistory);
        } catch (error) {
            console.error('Failed in bringing transferred history:', error);
        }
    }

    const handleResetPassword = async () => {
        const response = await callResetPasswordAPI();
        console.log('response:',response);
        if (response) {
            alert('비밀번호 초기화에 성공했습니다');
        } else {
            alert('비밀번호 초기화 하는데 실패했습니다');
        }
    }

    useEffect(() => {
        fetchMemberInfo();
        fetchTransferredHistory();
    }, []);

    const handleChangePassword = () => {
        setChangePasswordModalVisible(true);
    }



    const handleCloseModal = () => {
        setChangePasswordModalVisible(false);
    }

    return (
        <main id="main" className="main main2Pages">
            <div className='firstPage'>
                <div className="pagetitle pageTitleStyle" >
                    <h1>회원 정보</h1>
                </div>
                <div className="row rowStyle">
                    <div className="col-lg-6 columnStyle">
                        <div className="card cardOuterLine">
                            <div className="content1 contentStyle1">
                                <div className='imageBox'>
                                    <img src={imageUrl} className='profilePic' alt="Profile" />
                                    <div className='nameBox'>{memberInfo.name}</div>
                                </div>
                                {/* <h1>hi</h1> */}
                                <button className='changePassword' onClick={handleChangePassword}>비밀번호 변경</button>
                            </div>
                            <div className='content1 contentStyle2 titleStyle'>
                                <div className="pagetitle pageTitleStyle" >
                                    <h1>기본 정보</h1>
                                </div>
                            </div>
                            <div className='content1 contentStyle3 titleStyle'>
                            <div className='memberIdStyle'>
                                <label className='memberId'>사번</label>
                                <input className='inputStyle' value={memberInformation.memberId} />
                            </div>
                            <div className='emailStyle'>
                                <label className='email'>이메일</label>
                                <input className='inputStyle' value={memberInformation.email} />
                            </div>
                            <div className='addressStyle'>
                                <label className='memberId'>주소</label>
                                <input className='inputStyle' value={memberInformation.address} />
                            </div>
                            <div className='phoneNoStyle'>
                                <label className='memberId'>휴대폰 번호</label>
                                <input className='inputStyle' value={memberInformation.phoneNo} />
                            </div>
                            <div className='employedDateStyle'>
                                <label className='memberId'>입사일</label>
                                <input type='date' className='inputStyle' value={formattedEmployedDate} />
                            </div>
                            <div className='departStyle'>
                                <label className='memberId'>부서</label>
                                <input className='inputStyle' value={memberInfo.departName} />
                            </div>
                            <div className='positionStyle'>
                                <label className='position'>직급</label>
                                <input className='inputStyle' value={memberInfo.positionName} />
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='secondPage'>
                <div className="pagetitle pageTitleStyle" >
                    <h1>인사 정보</h1>
                </div>
                <div className="row rowStyle">
                    <div className="col-lg-6 columnStyle">
                        <div className="card cardOuterLine">
                            <div className='content1 contentStyle3 titleStyle'>
                                <div className="pagetitle pageTitleStyle" >
                                    <h1>인사 발령 정보</h1>
                                </div>
                                <div className='memberIdStyle'>
                                    <label className='memberId'>사번</label>
                                    <input className='inputStyle' value={memberInformation.memberId} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ChangePasswordModal visible={changePasswordModalVisible} onClose={handleCloseModal} />
        </main>
    );
}

export default MyProfile;