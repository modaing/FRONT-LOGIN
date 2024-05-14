import { Link, useLocation } from 'react-router-dom';
import '../style.css';
import '../common/common.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'boxicons/css/boxicons.css';
import 'remixicon/fonts/remixicon.css';


function Sidebar() {

    const location = useLocation();

    const underLineStyle = {
        textDecoration: 'none'
    }

    return (
        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
                <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === '/' ? '' : 'nav-link-main-cal collapsed'}`} to="/">
                        <i className="bi bi-grid"></i>
                        <span>Main</span>
                    </Link>
                </li>
                <li className={`nav-item ${location.pathname === '/calendar' ? 'active' : ''}`}>
                    <Link className={`nav-link ${location.pathname === '/calendar' ? '' : 'nav-link-main-cal collapsed'}`} to="/calendar">
                        <i className="bi bi-calendar-check"></i><span>캘린더</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link collapsed" to="/" data-bs-target="#forms-nav" data-bs-toggle="collapse">
                        <i className="bi bi-clock"></i><span>출퇴근</span><i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul id="forms-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                        <li>
                            <Link to="/recordCommute" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>출퇴근 내역</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/recordCorrectionOfCommute" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>출퇴근 정정 내역</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/commuteManage" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>출퇴근 관리</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/commuteCorrectionManage" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>출퇴근 정정 관리</span>
                            </Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item">
                    <Link className="nav-link collapsed" to="/" data-bs-target="#tables-nav" data-bs-toggle="collapse">
                        <i className="bi bi-sunglasses"></i><span>휴가</span><i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul id="tables-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                        <li>
                            <Link to="/myLeave" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>나의 휴가 관리</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/leaveAccrual" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>휴가 발생 관리</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>휴가 신청 처리</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>휴가 보유 내역 조회</span>
                            </Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item">
                    <Link className="nav-link collapsed" to="/" data-bs-target="#charts-nav" data-bs-toggle="collapse">
                        <i className="bi bi-journal-check"></i><span>전자결재</span><i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul id="charts-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>결재 작성하기</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/approvalSendList" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>결재 상신함</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>결재 수신함</span>
                            </Link>
                        </li>
                    </ul>
                </li>
                <li className="nav-item">
                    <Link className="nav-link collapsed" to="/" data-bs-target="#icons-nav" data-bs-toggle="collapse">
                        <i className="ri-organization-chart"></i><span>조직</span><i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul id="icons-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>조직도 조회</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/ManageMember" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>구성원 관리</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>부서 및 직급 관리</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>건의함</span>
                            </Link>
                        </li>
                    </ul>
                </li>

                <li className="nav-item">
                    <Link className="nav-link collapsed" to="/" data-bs-target="#ntc-nav" data-bs-toggle="collapse">
                        <i className="bi-globe2"></i><span>기타</span><i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul id="ntc-nav" className="nav-content collapse " data-bs-parent="#sidebar-nav">
                        <li>
                            <Link to="/insite" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>인사이트</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/Announces" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>공지사항</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>수요 조사</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>건의함</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/receiveNoteList" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>쪽지함</span>
                            </Link>
                        </li>
                    </ul>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;