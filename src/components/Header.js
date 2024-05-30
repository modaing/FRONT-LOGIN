import { Link, useNavigate } from 'react-router-dom'; // react-router-dom에서 Link 가져오기
import 'bootstrap-icons/font/bootstrap-icons.css';
import { decodeJwt } from '../utils/tokenUtils';
import { useDispatch, useSelector } from 'react-redux';
import { callLogoutAPI, callGetProfilePictureAPI } from '../apis/MemberAPICalls';
import { useEffect, useLayoutEffect, useState } from 'react';
import { callDeleteNoticeListAPI, callSelectNoticeListAPI } from '../apis/NoticeAPICalls';
import moment from 'moment/moment';
import dayjs from 'dayjs';

function Header() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = window.localStorage.getItem("accessToken");
    const memberInfo = decodeJwt(token);
    const image = memberInfo.imageUrl;
    const imageUrl = `/img/${image}`;

    console.log(imageUrl)

    const memberId = decodeJwt(token).memberId;
    const result = useSelector(state => state.noticeReducer);
    console.log('result', result);
    const noticeList = result?.noticeList?.response?.data?.results?.result || [];
    const [unreadNoticeCount, setUnreadNoticeCount] = useState(0);
    const [noticeCount, setNoticeCount] = useState(0);
    // const [noticeList, setNoticeList] = useState([]);

    if (token) {
        try {
            const decodedTokenInfo = decodeJwt(token);

        } catch (error) {
            console.log('Error decoding JWT token:', error);
        }
    }

    const onClickLogoutHandler = (event) => {
        event.preventDefault();
        dispatch(callLogoutAPI())
            .then(() => {
                window.localStorage.removeItem("accessToken");
                console.log('구성원 로그아웃');
                // alert('로그아웃 합니다');
                /* 토큰 정보 없앴는지 확인용 */
                console.log("token 정보:", window.localStorage.getItem("accessToken"));
                navigate("/login", { replace: true });
            })
            .catch(error => {
                console.error("Error during logout:", error);
            });
    };

    useEffect(() => {
        dispatch(callSelectNoticeListAPI(memberId));
    }, [dispatch, memberId]);

    useEffect(() => {
        const newNoticeAddedListener = () => {
            dispatch(callSelectNoticeListAPI(memberId)).then((response) => {
                setUnreadNoticeCount(response.filter((notice) => !notice.isRead).length);
                setNoticeCount(response.length);
            });
        };
    
        window.addEventListener('newNoticeAdded', newNoticeAddedListener);
    
        return () => {
            window.removeEventListener('newNoticeAdded', newNoticeAddedListener);
        };
    }, [dispatch, memberId]);

    const handleDeleteNotices = () => {
        dispatch(callDeleteNoticeListAPI(memberId));
        setUnreadNoticeCount(0);
        dispatch(callSelectNoticeListAPI(memberId));
    };

    const parseDate = (dateData) => {
        if (Array.isArray(dateData)) {
            return dayjs(new Date(dateData[0], dateData[1] - 1, dateData[2], dateData[3], dateData[4])).format('YYYY-MM-DD hh:mm');
        } else {
            return dayjs(dateData).format('YYYY-MM-DD hh:mm');
        }
    };

    return (
        <header id="header" className="header fixed-top d-flex align-items-center" >
            <div className="d-flex align-items-center justify-content-between">
                {/* 홈으로 이동하는 링크 */}
                <Link to="/" className="logo d-flex align-items-center">
                    <img src="img/logo.png" alt="" />
                </Link>
                <i class="bi bi-list toggle-sidebar-btn"></i>
            </div>
            <nav className="header-nav ms-auto">
                <ul className="d-flex align-items-center">
                    <li className="nav-item dropdown">
                        {/* 메시지 메뉴를 토글하는 링크 */}
                        <Link to="/chatRoomList" className="nav-link nav-icon">
                            <i className="bi bi-chat-right-dots"></i>
                            <span className="badge bg-primary badge-number"></span>
                        </Link>
                    </li>
                    <li className="nav-item dropdown">
                        {/* 알림 메뉴를 토글하는 링크 */}
                        <Link to="#" className="nav-link nav-icon" data-bs-toggle="dropdown">
                            <i className="bi bi-bell"></i>
                            <span className="badge badge-number" style={{ backgroundColor: '#FA6060' }}>{unreadNoticeCount?.toString().padStart(1, '0')}</span>
                        </Link>
                        {/* 알림 메뉴 */}
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications" style={{ width: '300px', height: '480px' }}>
                            <div >
                                <li className="dropdown-header" style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0px' }}>
                                    <span style={{ marginLeft: '50px', fontSize: '15px' }}>새로운 알림</span>
                                    {/* <Link to="#"><span style={{ border: '2px solid #FA6060', color: '#000000', backgroundColor: '#ffffff', borderRadius: '5px', padding: '3px' }} onClick={handleDeleteNotices}>삭제</span></Link> */}
                                    <Link to="#" onclick={handleDeleteNotices}><i class="bi bi-trash-fill"></i></Link>
                                </li>
                            </div>
                            <hr />
                            {/* 알림 목록 */}
                            {noticeList && noticeList.slice(0, 4).map((notice, index) => (
                                <li key={index} className="notification-item">
                                    <i className="bi bi-exclamation-circle text-warning"></i>
                                    <div>
                                        <h4>{notice.noticeType}</h4>
                                        <p>{notice.noticeContent}</p>
                                        <p>{parseDate(notice.noticeDateTime)}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                    </li>
                    <li className="nav-item dropdown">
                        {/* 쪽지 메뉴를 토글하는 링크 */}
                        <Link to="/receiveNoteList" className="nav-link nav-icon" >
                            <i className="bi bi-envelope"></i>
                            <span className="badge bg-success badge-number"></span>
                        </Link>

                    </li>
                    <li className="nav-item dropdown pe-3">
                        {/* 프로필 메뉴를 토글하는 링크 */}
                        <Link to="#" className="nav-link nav-profile d-flex align-items-center pe-0" data-bs-toggle="dropdown">
                            <img src={imageUrl} alt="Profile" className="rounded-circle" />
                            <span className="d-none d-md-block dropdown-toggle ps-2">{memberInfo.name} </span>
                        </Link>
                        {/* 프로필 메뉴 */}
                        <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                            <li className="dropdown-header">
                                <h6>{memberInfo.name}</h6>
                                <span>{memberInfo.positionName}</span>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            {/* 프로필 메뉴 항목 */}
                            <li>
                                <Link to="myProfile" className="dropdown-item d-flex align-items-center">
                                    <i className="bi bi-person"></i>
                                    <span>My Profile</span>
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            {/* 프로필 메뉴 항목 */}
                            <li>
                                <Link to="users-profile.html" className="dropdown-item d-flex align-items-center">
                                    <i className="bi bi-gear"></i>
                                    <span>Account Settings</span>
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            {/* 프로필 메뉴 항목 */}
                            <li>
                                <Link to="#" className="dropdown-item d-flex align-items-center">
                                    <i className="bi bi-question-circle"></i>
                                    <span>Need Help?</span>
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            {/* 프로필 메뉴 항목 */}
                            <li>
                                <button to="#" className="dropdown-item d-flex align-items-center" onClick={onClickLogoutHandler}>
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>Sign Out</span>
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;