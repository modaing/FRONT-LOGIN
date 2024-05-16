import React from 'react';
import styles from '../../css/approval/ApprovalListComponent.module.css'

function Pagination({ totalPages, currentPage, onPageChange, fg, title, direction }) {
    

    const handleClick = (pageNumber) => {

        window.location.href= `/approvals?fg=${fg}&page=${pageNumber}&title=${title}&direction=${direction}`;

        onPageChange(pageNumber);
    };

    return (
        <div className='pagination approvalPage'>
            
            <button
                className='page-link'
                disabled={currentPage === 0}
                onClick={() => handleClick(currentPage - 1)}
            >
                {'<<'}
            </button>
            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`${styles.pageButton} ${index === currentPage ? styles.activePage : ''}`}
                        disabled={index === currentPage}
                        onClick={() => onPageChange(index)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <button
                className='page-link'
                disabled={currentPage === totalPages - 1}
                onClick={() => handleClick(currentPage + 1)}
            >
                {'>>'}
            </button>

            {/* <nav>
                <ul className='pagination'>
                   
                    <li className='page-item'>
                        <button
                            className='page-link'
                            onClick={() => onPageChange(currentPage -1)}
                            disabled={currentPage === 1}
                            >
                                이전
                        </button>
                    </li>

                   
                    {pageNumbers.map((number) => (
                        <li
                            key={number}
                            className={`page-item ${number === currentPage ? 'active' : ''}`}
                        >
                            <button
                                className='page-link'
                                onClick={() => onPageChange(number)}
                            >
                                {number}
                            </button>
                        </li>
                    ))}

                    
                    <li className='page-item'>
                        <button
                            className='page-link'
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            다음
                        </button>
                    </li>
                </ul>
            </nav> */}

        </div>
    )
};

export default Pagination;