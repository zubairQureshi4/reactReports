import axios from "axios";
import { useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import FormToGetParameters from "./FormToGetParameters";
import { Button, Spinner } from "react-bootstrap";
import "./Styles/report.css";
import Pagination from "./Pagination";
import ReactToPrint from "react-to-print";
import BTAlert from "../../Components/Alert";

function RegisteredReport() {
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
  const usersPerPage = 2/0;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(data.length / usersPerPage);
  // Pagination end
  const [endDate, setEndDate] = useState(new Date().toJSON().slice(0, 10));
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 7);
  const [startDate, setStartDate] = useState(currentDate.toJSON().slice(0, 10));
  // for parameters
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [batch, setBatch] = useState([]);
  // API Call to get Data inside the componenet
  const fetchData = async () => {
    if (selectedCourse.length != 0 && batch.length != 0)  {
      setShowTable(true);
      try {
        setLoading(true);
        const courseVal = selectedCourse.map(({ value }) => value);
        const batchVal = batch.map(({value}) => value) 
        const response = await axios.post(
          "http://localhost:3000/registered/all",
          {
            startDate: startDate,
            endDate: endDate,
            course: courseVal,
            batch: batchVal
          }
        );
        setData(response.data);
        setDataLen(response.data.length);
        setLoading(false);
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
            selectedCourse={selectedCourse}
            setSelectedCourse={setSelectedCourse}
            startDate={startDate}
            endDate={endDate}
            setShowTable={setShowTable}
            batch={batch}
            setBatch={setBatch}
          />
        </div>
      ) : (
        <div>
          {!loading ? (
            <div>
            <div ref={(el) => (componentRef = el)}>
                <h4 className="text-center" style={{ color: "#0171c3" }}>
                  Registered Report
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
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Course</th>
                    <th>Email</th>
                    <th>Sales Agent</th>
                    <th>Follow Up</th>
                    <th>Date of Entry</th>
                    <th>Batch</th>
                  </tr>
                </thead>
                {data ? (
                  <tbody>
                    {data
                      .slice(pagesVisited, pagesVisited + usersPerPage)
                      .map((item, index) => (
                        <tr key={index}>
                          <td>{item.Name}</td>
                          <td>{item.Contact}</td>
                          <td>{item.Course}</td>
                          <td>{item.Email}</td>
                          <td>{item["Sales Agent"]}</td>
                          <td>{item["Follow Up"]}</td>
                          <td>{item["Date of Entry"]}</td>
                          <td>{item.Batch}</td>
                        </tr>
                      ))}
                  </tbody>
                ) : null}
              </Table>
                </div>
              <Pagination setPageNumber={setPageNumber} pageCount={pageCount} />
            </div>
          ) : (
            <div
              className="spinner-container"
              style={{
                width: "100%",
                height: "80vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spinner animation="border" variant="primary" style={{height: '55px', width: '55px'}}/>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default RegisteredReport;
