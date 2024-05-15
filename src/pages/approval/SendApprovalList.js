import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from 'axios';
import { decodeJwt } from "../../utils/tokenUtils";
import '../../css/approval/approval.css';
import { Link } from 'react-router-dom';
import { callAppListAPI } from "../../apis/ApprovalAPICalls";
import { ApprovalAPICalls } from "../../apis/ApprovalAPICalls";
import AppList from "../../components/approvals/AppList";


/* function ApprovalList({ approvals }){
    return(
        <div>
            <h2>결재 상신 목록</h2>
            <ul>
                {approvals.map(approval => (
                    <li key={approval.approvalNo}>
                        <strong>{approval.approvalTitle}</strong> - {approval.approvalStatus}
                    </li>
                ))}
            </ul>
        </div>
    );
} */

function SendApprovalList() {

 /*    const sendAppListButton = {
        height: '40px',
        width: '120px',
        backgroundColor: '#112D4E',
        color: 'white',
        borderRadius: '5px',
        padding: '1% 1.5%',
        cursor: 'pointer',
        textDecoration: 'none',
        marginRight: '20px',
        verticalAlign: 'middle',
        textAlign: 'center',
       display: 'inline-block',
       paddingTop : '7px'
    };

    const tempAppListButton = {
        height: '40px',
        width: '120px',
        backgroundColor: 'white',
        color: '#112D4E',
        borderRadius: '5px',
        border: '1px solid #D5D5D5',
        padding: '1% 1.5%',
        cursor: 'pointer',
        textDecoration: 'none',
        verticalAlign: 'middle',
        textAlign: 'center',
       display: 'inline-block',
       paddingTop : '7px'

    }

    const decodedToken = decodeJwt(window.localStorage.getItem('accessToken'));
    console.log('[SendApprovalList] decodedToken : ', decodedToken);
    const memberId = decodedToken.memberId;
    console.log('[SendApprovalList] memberId : ' + memberId);

    // const { approvalDTOPage } = useSelector(state => state.approvalReducer);
    

    const [fg, setFg] = useState('given');                  //fg를 state로 관리 초기값 given
    
    const [title, setTitle] = useState("");                 //title 관리 초기값 ""
    const [direction, setDirection] = useState('DESC');     //정렬 초기값 DESC

    const [currentPage, setCurrentPage] = useState(1);      //현재 페이지 초기값 1

    const dispatch = useDispatch();

    const apps = useSelector(state => state);
    const appList = apps.data?.content; //Page<ApprovalDTO>에서 실제 데이터 리스트 추출

    console.log(appList);

    if(!appList){
        console.log('appList 없음');
    }

    console.log('apps', apps);

    let statusList = [];

    useEffect(() => {
        dispatch(
            callAppListAPI({
                fg: fg,
                title: title,
                direction: direction,
                pageNo: currentPage
            })
        )
    }, [currentPage, fg, direction])

    const onChangeHandler = (e) =>{
        setTitle(e.target.value);
    }   //검색어 */

    
/* 
    let callSelectAPI = (currentPage) => {
        dispatch(ApprovalAPICalls(fg, title, direction, currentPage));
    }

    useEffect(() => {
        callSelectAPI(currentPage)
    }, [fg, title, direction, currentPage]); */

    /* useEffect(() => {
        axios.get('http://localhost:8080/approvals',{
            headers:{
                'Authorization' : `Bearer ${token}`,
                'MemberId':memberId
            }
        })
        .then(response => {
            setApprovals(response.data);
        })
        .catch(error =>{
            console.error('에러 발생 : ', error);
        });
    }, []); */



    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>결재 상신함</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/">Home</a></li>
                        <li className="breadcrumb-item">전자결재</li>
                        <li className="breadcrumb-item active">결재 상신 내역</li>
                    </ol>
                    <div className="approvalBar">
                        <div className="approvalBarLeft">
                           {/*  <Link to="/sendApprovalList" className="ApprovalListBtn" style={sendAppListButton}>내 결재함</Link>
                            <Link to="/tempApprovalList" className="ApprovalListBtn" style={tempAppListButton}>임시 저장함</Link> */}
                        </div>
                        <div className="approvalBarRight">
                            <div className="approvalSearch">
                                <div className="approvalSearchLabel">제목</div>
                                <div className="approvalSearchInput">
                                    <input type="text"></input>
                                </div>
                                <div className="approvalSearchBtn">
                                    <button type="submit">검색</button>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
           {/*  <div className="approvalListBody">
                <AppList data={appList}/>
            </div> */}
        </main>
    );
}

export default SendApprovalList;