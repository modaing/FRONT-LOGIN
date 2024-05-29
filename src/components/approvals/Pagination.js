import React, { useCallback } from 'react';
import styles from '../../css/approval/ApprovalListComponent.module.css'

function Pagination({ totalPages, currentPage, onPageChange }) {
    
    console.log(`현재 페이지 : ${currentPage}`);
    console.log(`총 페이지 : ${totalPages}`);

    const handleClick = useCallback((pageNumber, event) => {

        if(event){
            event.stopPropagation();
        }
        
        onPageChange(pageNumber);
    }, [onPageChange]);

    const buttonStyle = () => {
        return {marginLeft : '0px'};
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

        return Array.from({ length: end - start }, (_, i) => i + start);
    };

    const paginationRange = getPaginationRange();


    return (
        <div className='pagination approvalPage'>
            
            <button
                className='page-link'
                disabled={currentPage === 0}
                onClick={(event) => handleClick(currentPage - 1, event)}
            >
                {'<<'}
            </button>
            <div className={styles.pagination}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`${styles.approvalButton} ${index === currentPage ? styles.activePage : ''}`}
                        disabled={index === currentPage}
                        onClick={(event) => handleClick(index, event)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <button
                className='page-link'
                disabled={currentPage === totalPages - 1}
                onClick={(event) => handleClick(currentPage + 1, event)}
                style={buttonStyle()}
            >
                {'>>'}
            </button>

            

        </div>
    )
};

export default Pagination;