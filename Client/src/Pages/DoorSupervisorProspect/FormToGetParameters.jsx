/* eslint-disable react/prop-types */
import  { useEffect, useState } from "react";
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
  setselectedCourse,
  selectedCourse
}) => { 
// Sales Agent And Cource
const [agent, setAgent] = useState([]);
const [gotAgent, setgotAgent] = useState([]);
const [gotCourses, setGotCourses] = useState([]);
console.log(agent);
// Every Time Course Changes this useEffect changes the filter on Sales Agent
useEffect(() => {
  const uniqueAgents = [];
  const filteredAgents = gotAgent.filter((agent) => {
    if (agent.value === "ALL") {
      return true;
    }
    if (selectedCourse.some((course) => course.label === agent.course)) {
      if (!uniqueAgents.some((a) => a.value === agent.value)) {
        uniqueAgents.push(agent);
        return true;
      }
      return false;
    }
    return false;
  });
  if (!filteredAgents.some((agent) => agent.value === "ALL")) {
    filteredAgents.push({ value: "ALL", label: "ALL", course: "ALL" });
  }
  setAgent(filteredAgents);
}, [selectedCourse]);

// Getting all sales agent for parameters
const getSalesAgent = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/registered/salesagent"
    );
    // Assuming gotCourses contains the data from the provided API
    setgotAgent(response.data);
  } catch (error) {
    console.log(error);
  }
};

// Getting all Cources for parameters
const getCourses = async () => {
  await axios
    .get("http://localhost:3000/registered/courses")
    .then((res) => setGotCourses(res.data))
    .catch((err) => console.log(err));
};
useEffect(() => {
  getSalesAgent();
  getCourses();
}, []);
 

  // Return HTML Code
  return (
    <Form onSubmit={handleSubmit}>
    <h1 className="text-center mt-3" style={{color: '#0171c3'}}>Course-wise Prospective Trainees Report</h1>
      <Form.Group controlId="startDate">
        <Form.Label>Enter Start Date</Form.Label>
        <Form.Control
          type="date"
          value={startDate}
          defaultValue={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="endDate">
        <Form.Label>Enter End Date</Form.Label>
        <Form.Control
          type="date"
          defaultValue={endDate}
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="course">
        <Form.Label>Courses</Form.Label>
        <MultiSelectDropdown
          agent={gotCourses}
          selectedValues={selectedCourse}
          setSelectedValues={setselectedCourse}
        />
      </Form.Group>

      <Form.Group controlId="salesAgent">
        <Form.Label>Sales Agent</Form.Label>
        <MultiSelectDropdown
          agent={agent}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        Submit
      </Button>
    </Form>
  );
};

export default FormToGetParameters;
