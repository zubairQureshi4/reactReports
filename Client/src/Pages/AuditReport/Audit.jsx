import axios from "axios";
import { useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import FormToGetParameters from "./FormToGetParameters";
import { Button } from "react-bootstrap";
import "./Styles/report.css";
import Pagination from "../DoorSupervisorRegistered/Pagination";
import ReactToPrint from "react-to-print";
import Spinner from "react-bootstrap/Spinner";
import BTAlert from "../../Components/Alert";

function Audit() {
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
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState([]);
  // API Call to get Data inside the componenet
  const fetchData = async () => {
    if (selectedValues.length != 0 && selectedUser.length != 0 && selectedFunction.length != 0) {
      setShowTable(true);
      try {
        setLoading(true);
        const database = selectedValues.map(({ value }) => value);
        const user = selectedUser.map(({ value }) => value);
        const functionList = selectedFunction.map(({ value }) => value);
        const response = await axios.post(
          "http://localhost:3000/audit/getAudit",
          {
            startDate,
            endDate,
            database,
            user,
            functionList,
          }
        );
        setData(response.data);
        console.log(response.data);
        setDataLen(response.data.length);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowTable(false);
      setShow(true)
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
      {showTable ? (
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
      ) : null}
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
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            selectedFunction={selectedFunction}
            setSelectedFunction={setSelectedFunction}
          />
        </div>
      ) : (
        <div>
          {!loading ? (
            <div>
              <div ref={(el) => (componentRef = el)}>
                <h4 className="text-center" style={{ color: "#0171c3" }}>
                  Audit Report
                </h4>
                <h4 className="text-center" style={{ color: "#0171c3" }}>
                  Total Records : {dataLen}
                </h4>
                <Table
                  striped
                  bordered
                  hover
                  responsive
                  className="my-table container"
                >
                  <thead>
                    <tr>
                      <th>Database</th>
                      <th>Description</th>
                      <th>Document</th>
                      <th>Folder</th>
                      <th>Function</th>
                      <th>Function Date</th>
                      <th>Function Time</th>
                      <th>User</th>
                    </tr>
                  </thead>
                  {data ? (
                    <tbody>
                      {data
                        .slice(pagesVisited, pagesVisited + usersPerPage)
                        .map((item, index) => (
                          <tr key={index}>
                            <td>
                              {item.Database === null
                                ? "System Functions"
                                : item.Database}
                            </td>
                            <td>{item.Description}</td>
                            <td>
                              {item.Document === null
                                ? "No Docuemnt"
                                : item.Document}
                            </td>
                            <td>
                              {item.Folder === null ? "No Folder" : item.Folder}
                            </td>
                            <td>{item.Function}</td>
                            <td>{item.FunctionDate}</td>
                            <td>{item.FunctionTime.slice(0, 8)}</td>
                            <td>{item.username}</td>
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

export default Audit;
