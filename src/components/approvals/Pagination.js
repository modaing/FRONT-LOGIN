import React from 'react';
import styles from '../../css/approval/ApprovalListComponent.module.css'

function Pagination({ totalPages, currentPage, onPageChange, fg, title, direction }) {
    

    const handleClick = (pageNumber) => {

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
                        onClick={() => handleClick(index)}
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

            

        </div>
    )
};

export default Pagination;