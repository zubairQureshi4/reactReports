/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import MultiSelectDropdown from "./MultiSelectDropdown";

const FormToGetParameters = ({
  setStartDate,
  setEndDate,
  setSelectedValues,
  handleSubmit,
  startDate,
  endDate,
  selectedValues,
  selectedUser,
  setSelectedUser,
  selectedFunction,
  setSelectedFunction,
}) => {
  // Sales Agent And Cource
  const [params, setParams] = useState([]);
  // Getting all parameters
  const getSalesAgent = async () => {
    try {
      const response = await axios.get("http://localhost:3000/audit/schema");
      // Assuming gotCourses contains the data from the provided API
      setParams(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSalesAgent();
  }, []);

  // Return HTML Code
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="Databases">
        <Form.Label>Select Databases</Form.Label>
        <MultiSelectDropdown
          agent={params.databases}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
        />
      </Form.Group>

      <Form.Group controlId="Users">
        <Form.Label>Select Users</Form.Label>
        <MultiSelectDropdown
          agent={params.users}
          selectedValues={selectedUser}
          setSelectedValues={setSelectedUser}
        />
      </Form.Group>

      <Form.Group controlId="functions">
        <Form.Label>Select functions</Form.Label>
        <MultiSelectDropdown
          agent={params.functionList}
          selectedValues={selectedFunction}
          setSelectedValues={setSelectedFunction}
        />
      </Form.Group>

      <Form.Group controlId="startDate">
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          type="date"
          value={startDate}
          defaultValue={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="endDate">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          defaultValue={endDate}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default FormToGetParameters;
