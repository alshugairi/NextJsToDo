"use client";
import ReactPaginate from "react-paginate";
import {useSelector} from "react-redux";

export default function ReactPagination({ handlePageClick, type}) {

  const { pagination } = useSelector((state) => state[type]);

  const onChange = (nextValue) => {};

  return (
      pagination &&
      <>
        <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={pagination?.last_page}
            previousLabel="<"
            renderOnZeroPageCount={null}
            containerClassName="pagination"
            activeClassName="selected"
            disabledClassName="disabled"
        />
      </>
  );
}
