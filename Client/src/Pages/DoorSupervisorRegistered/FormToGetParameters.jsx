/* eslint-disable react/prop-types */
import  { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import MultiSelectDropdown from "./MultiSelectDropdown";

const FormToGetParameters = ({
  setStartDate,
  setEndDate,
  setSelectedCourse,
  setSelectedValues,
  handleSubmit,
  startDate,
  endDate,
  selectedCourse,
  selectedValues,
  batch,
  setBatch
}) => {
  // Sales Agent And Cource
  const [agent, setAgent] = useState([]);
  const [gotAgent, setgotAgent] = useState([]);
  const [gotCourses, setGotCourses] = useState([]);
  const [gotBatch, setGotBatch] = useState([]);
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

   // Getting all Batch for parameters
   const getBatch = async () => {
    await axios
      .get("http://localhost:3000/registered/batch")
      .then((res) => setGotBatch(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getSalesAgent();
    getCourses();
    getBatch();
  }, []);

  // Return HTML Code
  return (
    <Form onSubmit={handleSubmit}>
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

      <Form.Group controlId="1">
        <Form.Label>Courses</Form.Label>
        <MultiSelectDropdown
          agent={gotCourses}
          selectedValues={selectedCourse}
          setSelectedValues={setSelectedCourse}
        />
      </Form.Group>

      <Form.Group controlId="2">
        <Form.Label>Sales Agent</Form.Label>
        <MultiSelectDropdown
          agent={agent}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
        />
      </Form.Group>
      <Form.Group controlId="3">
        <Form.Label>Batch</Form.Label>
        <MultiSelectDropdown
          agent={gotBatch}
          selectedValues={batch}
          setSelectedValues={setBatch}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default FormToGetParameters;
