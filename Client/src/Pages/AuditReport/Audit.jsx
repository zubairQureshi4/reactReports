import axios from "axios";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import FormToGetParameters from "./FormToGetParameters";
import { Button } from "react-bootstrap";
import "./Styles/report.css";
import Pagination from "../DoorSupervisorRegistered/Pagination";

function Audit() {
  // Show table or Input paramteter form
  const [showTable, setShowTable] = useState(false);
  // Show loading state
  const [loading, setLoading] = useState(false);
  // Set Array of data from response.data
  const [data, setData] = useState([]);
  // Pagination
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 10;
  const pagesVisited = pageNumber * usersPerPage;
  const pageCount = Math.ceil(data.length / usersPerPage);
  // Pagination end
  const [startDate, setStartDate] = useState(new Date().toJSON().slice(0, 10));
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 7);
  const [endDate, setEndDate] = useState(currentDate.toJSON().slice(0, 10));
  // for parameters
  const [selectedValues, setSelectedValues] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState([]);
  // API Call to get Data inside the componenet
  const fetchData = async () => {
    if (selectedValues.length != 0 ) {
      setShowTable(true);
      try {
        setLoading(true);
        const database = selectedValues.map(({ value }) => value);
        const user = selectedUser.map(({ value }) => value);
        const functionList = selectedFunction.map(({ value }) => value);
        const response = await axios.post(
          "http://localhost:3000/audit/getAudit",
          {
            startDate: startDate,
            endDate: endDate,
            database: database,
            user: user,
            functionList, functionList
          }
        );
        setData(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      setShowTable(false);
      alert("Enter data");
    }
  };
// API Call End

// Calling API Function onSubmit of Form
  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };
// Return JSX Code
  return (
    <>
      <Button
        className="m-2"
        onClick={() => {
          setShowTable(false);
        }}
      >
        Open Parameters
      </Button>
      {!showTable ? (
        <div className="form_div container">
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
                        </tr>
                      ))}
                  </tbody>
                ) : null}
              </Table>
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

export default Audit;
