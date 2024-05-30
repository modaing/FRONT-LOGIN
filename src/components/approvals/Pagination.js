import React, { useCallback } from 'react';
// import styles from '../../css/approval/ApprovalListComponent.module.css'
import styles from '../../css/approval/Pagination.module.css';

function Pagination({ totalPages, currentPage, onPageChange }) {

    console.log(`현재 페이지 : ${currentPage}`);
    console.log(`총 페이지 : ${totalPages}`);

    const handleClick = useCallback((pageNumber, event) => {

        if (event) {
            event.stopPropagation();
        }

        onPageChange(pageNumber);
    }, [onPageChange]);

    const buttonStyle = () => {
        return { marginLeft: '0px' };
    }

    const getPaginationRange = () => {
        const totalPageNumbers = 10;
        const halfPageNumbers = Math.floor(totalPageNumbers / 2);

        let start = currentPage - halfPageNumbers;
        let end = currentPage + halfPageNumbers;

        if (start < 0) {
            start = 0;
            end = totalPageNumbers;
        }

        if (end > totalPages) {
            start = totalPages - totalPageNumbers;
            end = totalPages;
        }

        start = Math.max(start, 0);
        end = Math.min(end, totalPages);

        return Array.from({ length: end - start }, (_, i) => i + start);
    };

    const paginationRange = getPaginationRange();


    return (
        // <div className='pagination approvalPage'>

        //     <button
        //         className='page-link'
        //         disabled={currentPage === 0}
        //         onClick={(event) => handleClick(currentPage - 1, event)}
        //     >
        //         ◀
        //     </button>
        //     <div className="pagination">
        //         {Array.from({ length: totalPages }, (_, index) => (
        //             <button
        //                 key={index}
        //                 className={`"approvalButton" ${index === currentPage ? 'activePage' : ''}`}
        //                 disabled={index === currentPage}
        //                 onClick={(event) => handleClick(index, event)}
        //             >
        //                 {index + 1}
        //             </button>
        //         ))}
        //     </div>
        //     <button
        //         className='page-link'
        //         disabled={currentPage === totalPages - 1}
        //         onClick={(event) => handleClick(currentPage + 1, event)}
        //         style={buttonStyle()}
        //     >
        //         ▶
        //     </button>



        // </div>
        <nav>
            <ul className='pagination'>
            <li className={`page-item ${currentPage === 0 && 'disabled'}`}>
                  <button className='page-link' onClick={(event) => handleClick(currentPage - 1, event)} disabled={currentPage === 0} >◀</button>
                </li>
                {paginationRange.length === 0 ? (
                    <li className='page-item'>
                        <button className='page-link' disabled>1</button>
                    </li>
                ) :  (
                    paginationRange.map(page => (
                        <li key={page} className={`page-item ${currentPage === page && 'active'}`}>
                            <button className='page-link' onClick={(event) => handleClick(page, event)}>
                                {page + 1}
                            </button>
                        </li>
                    ))
            )}
                <li className={`page-item ${currentPage === totalPages - 1 && 'disabled'}`}>
                    <button className='page-link' onClick={(event) => handleClick(currentPage + 1, event)} disabled={currentPage === totalPages - 1}>▶</button>
                </li>

            </ul>
        </nav>
    )
};

export default Pagination;