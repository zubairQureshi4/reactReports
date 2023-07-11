import axios from "axios";
import { useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import FormToGetParameters from "./FormToGetParameters";
import { Button } from "react-bootstrap";
import "./Styles/report.css";
import Pagination from "../DoorSupervisorRegistered/Pagination";
import ReactToPrint from "react-to-print";
import BTAlert from "../../Components/Alert";

function ProspectReport() {
  // Show table or Input paramteter form
  const [showTable, setShowTable] = useState(false);
  const [show, setShow] = useState(false);
  // Show loading state
  const [loading, setLoading] = useState(false);
  // Set Array of data from response.data
  const [data, setData] = useState([]);
  const [dataLen, setDataLen] = useState(0);
  // Pagination
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 20;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(data.length / usersPerPage);
  // Pagination end
  const [endDate, setEndDate] = useState(new Date().toJSON().slice(0, 10));
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 7);
  const [startDate, setStartDate] = useState(currentDate.toJSON().slice(0, 10));
  // for parameters
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedCourse, setselectedCourse] = useState([]);
  // API Call to get Data inside the componenet
  const fetchData = async () => {
    if (selectedValues.length != 0 && selectedCourse.length != 0) {
      setShowTable(true);
      try {
        setLoading(true);
        const values = selectedValues.map(({ value }) => value);
        const courseVal = selectedCourse.map(({ value }) => value);
        const response = await axios.post(
          "http://localhost:3000/Prospect/all",
          {
            startDate: startDate,
            endDate: endDate,
            course: courseVal,
            salesAgent: values,
          }
        );
        setData(response.data);
        setLoading(false);
        setDataLen(response.data.length);
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowTable(false);
      setShow(true);
    }
  };
// API Call End

// Calling API Function onSubmit of Form
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };
  let componentRef = useRef();

// Return JSX Code
  return (
    <>
    {showTable ?
    <div>
    <ReactToPrint
            trigger={() => <Button className="m-2">Print this page</Button>}
            content={() => componentRef}
          />
      <Button
        className="m-2"
        onClick={() => {
          setShowTable(false);
        }}
      >
        Open Parameters
      </Button>
    </div> 
    : null}
      {!showTable ? (
        <div className="form_div container">
        {show ? <div className="mt-3"><BTAlert show={show} setShow={setShow}/></div> : null}
          <FormToGetParameters
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setSelectedValues={setSelectedValues}
            handleSubmit={handleSubmit}
            selectedValues={selectedValues}
            startDate={startDate}
            endDate={endDate}
            setShowTable={setShowTable}
            selectedCourse = {selectedCourse}
            setselectedCourse ={setselectedCourse}
          />
        </div>
      ) : (
        <div>
          {!loading ? (
            <div>
            <div ref={(el) => (componentRef = el)}>
                <h4 className="text-center" style={{ color: "#0171c3" }}>
                Course-wise Prospective Trainees Report
                </h4>
                <h4 className="text-center" style={{ color: "#0171c3" }}>
                  Total Records : {dataLen}
                </h4>
              <Table
                striped
                bordered
                hover
                responsive
                className="my-table container mt-5"
              >
                <thead>
                  <tr>
                    <th>Enquiry ID</th>
                    <th>Enquiry Date</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Cource/ Training</th>
                    <th>Sales Agent</th>
                    <th>Follow Up Remarks</th>
                  </tr>
                </thead>
                {data ? (
                  <tbody>
                    {data
                      .slice(pagesVisited, pagesVisited + usersPerPage)
                      .map((item, index) => (
                        <tr key={index}>
                          <td>{item.EnquiryID}</td>
                          <td>{item.DateOfEnquiry}</td>
                          <td>{item.Name}</td>
                          <td>{item.Contact}</td>
                          <td>{item.Email}</td>
                          <td>{item.CourseTraining}</td>
                          <td>{item.SalesAgent}</td>
                          <td>{item.FollowUp}</td>
                        </tr>
                      ))}
                  </tbody>
                ) : null}
              </Table>
                </div>
              <Pagination setPageNumber={setPageNumber} pageCount={pageCount} />
            </div>
          ) : (
            <h1>Loading...</h1>
          )}
        </div>
      )}
    </>
  );
}

export default ProspectReport;
