import { decodeJwt } from "../../utils/tokenUtils";

function RegisterMember() {

    const token = window.localStorage.getItem("accessToken");
    const decodedTokenInfo = decodeJwt(token);
    const profilePic = decodedTokenInfo.imageUrl;
    console.log('구성원 프로필 사진:',profilePic);


    const pageTitleStyle = {
        marginBottom: '20px',
        marginTop: '20px'
    };

    const insertButton = {
        backgroundColor: '#112D4E',
        color: 'white',
        borderRadius: '5px',
        padding: '1% 1.5%', // 패딩을 %로 조정
        cursor: 'pointer',
        marginLeft: '60%', // 왼쪽 여백을 %로 조정
        height: '45px',
        textDecoration: 'none'
    };


    const contentStyle1 = {
        marginLeft: '25px',
        textAlign: 'center',
        margin: '20px'

    };

    const contentStyle2 = {
        marginLeft: '25px'

    };

    const tableStyle = {
        width: '97%',
        borderCollapse: 'collapse',
        textAlign: 'center',
    };

    const tableStyles = {
        tableHeaderCell: {
            cursor: 'pointer',
            fontWeight: 'bold',
            padding: '15px'
        },
        tableCell1: {
            width: '15%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell2: {
            width: '13%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell3: {
            width: '13%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell4: {
            width: '13%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell5: {
            width: '22%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell6: {
            width: '13%',
            textAlign: 'center',
            padding: '10px',
        },
        tableCell7: {
            width: '15%',
            textAlign: 'center',
            padding: '10px',
        },
        evenRow: {
            backgroundColor: '#f9f9f9'
        }
    };

    const red = {
        color: '#AF3131',
        fontWeight: 900
    };

    const blue = {
        color: '#3F72AF',
        fontWeight: 900

    };

    const black = {
        color: '#00000',
        fontWeight: 900
    };

    const date = {
        color: '#00000',
        fontWeight: 800,
        fontSize: '20px',
        margin: '20px'
    };

    const Button = ({ children, onClick }) => {
        return (
            <button onClick={onClick} style={{
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                fontWeight: 900
            }}>
                {children}
            </button>
        );
    };

    const insertCorrection = {
        backgroundColor: '#3F72AF',
        cursor: 'pointer',
        color: '#FFFFFF',
        borderRadius: '4px',
        border: '1px solid #3F72AF',
        '&:hover': {
            cursor: '#112D4E',
        }
    };
    return (
        <main id="main" className="main">
            <div className="pagetitle" style={pageTitleStyle}>
                <h1>구성원 등록</h1>
            </div>
            <div className="col=lg-12">
                <div className="card">
                    <div className="content1" style={contentStyle1}>
                       <img src={profilePic} className="asd"></img>
                       <button>사진 등록</button>
                    </div>
                </div>
            </div>
            
        </main>
    );
}

export default RegisterMember;