import ReactPaginate from 'react-paginate';


function Pagination({ pageCount, setPageNumber  }) {
  // setPageNumbe to the actual changed page number for updating the data
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };


  return (
    <>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </>
  );
}


export default Pagination ;
