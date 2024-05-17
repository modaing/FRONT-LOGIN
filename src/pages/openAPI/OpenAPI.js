import React, { useState, useEffect } from 'react';

function OpenAPI() {
    const [boxOfficeList, setBoxOfficeList] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {

                let key = "?key="; // 발급받은 키
                let itemPerPage = "&itemPerPage=20";    
                let targetDt = "&targetDt=20240511"
                const url = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json" 
                            + key
                            + targetDt;

                const response = await fetch(url);
                const data = await response.json();
                setBoxOfficeList(data.boxOfficeResult.weeklyBoxOfficeList);
            } catch (error) {
                console.error('Error fetching box office list:', error);
            }
        };

        fetchData();
    }, []);

    console.log(boxOfficeList)

    return (
        <div id="container">
            {boxOfficeList.map((movie, index) => (
                <div key={index} className="movie">
                    <p>영화 이름: {movie.movieNm}</p>
                    <p>개봉 날짜: {movie.openDt}</p>
                    <p>순위: {movie.rank}</p>
                </div>
            ))}
        </div>
    );
}

export default OpenAPI;
