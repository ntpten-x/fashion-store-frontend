import PropTypes from "prop-types";
import { PaginationWrapper, PageButton } from "./PaginationStyled";

export default function Paginaiontion({ page, totalPages, getPageNumbers, onPageChange }) {
    if (totalPages <= 1) return null;

    const pageNumbers = getPageNumbers();

    return (
        <PaginationWrapper>
            <PageButton
                disabled={page === 1}
                onClick={() => onPageChange(Math.max(1, page - 1))}
                aria-label="Previous Page"
            >
                ◀
            </PageButton>

            {pageNumbers.map((num, idx) => (
                num === '...' ? (
                    <span key={`ellipsis-${idx}`} style={{ color: 'var(--text-muted)', padding: '0 8px', fontFamily: '"Fredoka", sans-serif' }}>
                        ...
                    </span>
                ) : (
                    <PageButton
                        key={`page-${num}`}
                        $active={page === num}
                        onClick={() => onPageChange(num)}
                        aria-label={`Page ${num}`}
                    >
                        {num}
                    </PageButton>
                )
            ))}

            <PageButton
                disabled={page === totalPages}
                onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                aria-label="Next Page"
            >
                ▶
            </PageButton>
        </PaginationWrapper>
    );
}

Paginaiontion.propTypes = {
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    getPageNumbers: PropTypes.func.isRequired,
    onPageChange: PropTypes.func.isRequired,
};
