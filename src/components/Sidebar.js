import { Link } from 'react-router-dom';
import '../style.css';
import '../common/common.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'boxicons/css/boxicons.css';
import 'remixicon/fonts/remixicon.css';


function Sidebar() {

    const underLineStyle = {
        textDecoration: 'none'
    }

    return (
        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
                <li className="nav-item">
                    <Link className="nav-link" to="/">
                        <i className="bi bi-grid"></i>
                        <span>Main</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link collapsed" to="calendar" data-bs-target="#components-nav" data-bs-toggle="collapse">
                        <i className="bi bi-calendar-check"></i><span>캘린더</span>
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link collapsed" to="/" data-bs-target="#forms-nav" data-bs-toggle="collapse">
                        <i className="bi bi-clock"></i><span>출퇴근</span><i className="bi bi-chevron-down ms-auto"></i>
                    </Link>
                    <ul id="forms-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>출퇴근 관리</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>월 별 근태 관리</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>일 별 근태 관리</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>근태 통계</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>추가</span>
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
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>휴가 신청 내역 조회</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>휴가 등록</span>
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
                            <Link to="/" style={underLineStyle}>
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
                                <i className="bi bi-circle"></i><span>인사이트</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>공지사항</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>설문 조사</span>
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
                                <i className="bi bi-circle"></i><span>설문 조사</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>건의함</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" style={underLineStyle}>
                                <i className="bi bi-circle"></i><span>쪽지함</span>
                            </Link>
                        </li>
                    </ul>
                </li>
                {/* 필요한 만큼 계속해서 추가 */}
            </ul>
        </aside>
    );
}

export default Sidebar;