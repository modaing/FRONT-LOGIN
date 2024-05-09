import '../../css/commute/commute.css';

function CommuteTime() {

    const content1 = {
        marginLeft: '25px',
        textAlign: 'center',
        margin: '20px'

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

    const dateWeek = {
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

    const ProgressBar = ({ progress, style }) => {
        return (
            <div className="progress" style={style}>
                <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>
        );
    };

    const handlePreviousClick = () => {
        // 한주 전으로 이동하는 로직
    };

    const handleNextClick = () => {
        // 한주 후로 이동하는 로직
    };

    return (
        <div>
            <div className="col=lg-12">
                <div className="card">
                    <div className="content1" style={content1}>
                        <Button onClick={handlePreviousClick}>&lt;</Button>
                        <span style={dateWeek}>4월 1째주</span>
                        <Button onClick={handleNextClick}>&gt;</Button>
                        <h6>4월 1일 ~ 4월 7일</h6>
                        <ProgressBar progress={70} style={{ width: '40%', margin: '20px auto' }} />
                        <h6>최대 근로시간 <span className="black" style={black}>52시간</span></h6>
                        <h6>실제 근로시간 <span className="blue" style={blue}>36시간</span></h6>
                        <h6>잔여 근로시간 <span className="red" style={red}>16시간</span></h6>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommuteTime;