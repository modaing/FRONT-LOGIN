import { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useDispatch, useSelector } from 'react-redux';
import { callLeaveMemberSelectAPI } from '../../apis/InsiteAPICalls';

function LeaveInsite() {
    const dispatch = useDispatch();
    const [chart, setChart] = useState(false);
    const leaveCountsData = useSelector(state => state.insiteReducer.leaveMember);

    console.log(leaveCountsData)

    useEffect(() => {
        dispatch(callLeaveMemberSelectAPI());
    }, [dispatch]);

    useEffect(() => {
        if (leaveCountsData && leaveCountsData.length > 0) {
            const labels = leaveCountsData.map(item => item[0]); // 휴가 유형
            const data = leaveCountsData.map(item => item[1]); // 휴가 일수

            // Chart.js 그래프 생성
            const existingDoughnutChart = Chart.getChart('doughnutChart');
            if (existingDoughnutChart) {
                existingDoughnutChart.destroy();
            }

            const doughnutChart = new Chart(document.querySelector('#doughnutChart'), {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '휴가 일수',
                        data: data,
                        backgroundColor: ['rgb(100, 99, 132)', 'rgb(200, 162, 235)', 'rgb(100, 99, 200)'],
                        hoverOffset: 4
                    }]
                }
            });
            setChart(true);
        }
    }, [leaveCountsData]);

    const pageTitleStyle = {
        marginBottom: '20px',
        marginTop: '20px'
    };

    const cardTitleStyle = {
        marginLeft: '20px',
        fontWeight: 'bold'
    };

    const cardSubTitleStyle = {
        marginLeft: '20px',
        fontSize: '25px',
        marginTop: '-30px',
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false // 차트가 지정한 크기로 고정되도록 설정
    };

    const chartStyle = {
        maxHeight: '600px',
        marginBottom: '20px'
    }

    const chartStyles = {
        maxHeight: '220px',
        marginBottom: '20px'
    }

    const cardStyle = {
        marginTop: '-20px'
    }

    return (
        <div className="col-lg-12">
            <div className="card">
                <h5 className="card-title" style={cardTitleStyle}>금일 휴가자</h5>
                <h5 className="card-title" style={cardSubTitleStyle}>sub-title</h5>
                {leaveCountsData && leaveCountsData.length > 0 ? (
                    <canvas id="doughnutChart" options="options" style={chartStyles}></canvas>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    )

}

export default LeaveInsite;
