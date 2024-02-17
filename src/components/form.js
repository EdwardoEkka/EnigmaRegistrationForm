import React, { useState } from "react";

import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { toast, Toaster } from "react-hot-toast";
import AWS from "aws-sdk";
import "./form.css";
import logo from "../components/images/EnigmaLogo.png";
import Matrix from "./Matrix";

const AWS_ACCESS_KEY_ID = "AKIAXYKJT7OCKNTDZC6G";
const AWS_SECRET_ACCESS_KEY = "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";
const AWS_REGION = "ap-south-1";
// const MAIL_API = process.env.MAIL_API;

AWS.config.update({
  region: AWS_REGION,
  credentials: new AWS.Credentials({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  }),
});

const docClient = new AWS.DynamoDB.DocumentClient();

const Form = () => {
  const [responseData, setResponseData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    regd: "",
    branch: "",
    section: "",
    email: "",
    contact: "",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    regd: "",
    branch: "",
    section: "",
    email: "",
    contact: "",
  });

  const branchOptions = [
    "Chemical Engineering",
    "Civil Engineering",
    "Computer Science and Engineering",
    "Electrical Engineering",
    "Electrical and Electronics Engineering",
    "Electonics and Telecommunication Engineering",
    "Information Technology",
    "Mechanical Engineering",
    "Metallurgy and materials Engineering",
    "Production Engineering",
  ];
  const sectionOptions = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
  ];

  const handleInputChange = (event, key) => {
    const { value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [key]: "",
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (const key in formData) {
      const value = formData[key];

      if (typeof value === "string" && value.trim() === "") {
        errors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
        isValid = false;
      }

      if (key === "email" && !emailRegex.test(value.trim())) {
        errors.email = "Invalid email format";
        isValid = false;
      }
      if (key === "contact" && !/^\d{10}$/.test(value)) {
        errors.contact = "Contact number should be a 10-digit number";
        isValid = false;
      }
      if (key === "regd" && !/^\d{10}$/.test(value)) {
        errors.regd = "Registration number should be a 10-digit number";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      handleAddItem();
    }
  };

  const handleAddItem = () => {
    const uniqueNum = Date.now();
    const dateObject = new Date(uniqueNum);

    const scanParams = {
      TableName: "EnigmaForm",
      FilterExpression: "#email = :email",
      ExpressionAttributeNames: {
        "#email": "email",
      },
      ExpressionAttributeValues: {
        ":email": formData.email,
      },
    };

    docClient.scan(scanParams, (scanErr, scanData) => {
      if (scanErr) {
        console.error("Error scanning DynamoDB:", scanErr);
        toast.error("Registration failed. Please try again.");
      } else {
        if (scanData.Items.length > 0) {
          toast.error(
            "Email is already registered. Please use a different email."
          );
        } else {
          const newItemParams = {
            TableName: "EnigmaForm",
            Item: {
              date: dateObject.toLocaleString(),
              name: formData.name,
              regd: formData.regd,
              branch: formData.branch,
              section: formData.section,
              email: formData.email,
              contact: formData.contact,
            },
          };

          docClient.put(newItemParams, (putErr, putData) => {
            if (putErr) {
              console.error(
                "Unable to add item. Error JSON:",
                JSON.stringify(putErr, null, 2)
              );
              toast.error("Registration failed. Please try again.");
            } else {
              setResponseData(putData);
              toast.success("Registration successful!");

              const emailData = {
                to: formData.email,
                subject: "Thanking you for registration  ",
                text: "Welcome To Enigma",
                html: `
                <h1 style="text-align:center;">ENIGMA</h1>
                <img src="cid:Poster1" alt="Enigma Poster" style="max-width: 100%;" />
                <p>Best regards,</p>
    <p>ENIGMA-VSSUT</p>

                <a href="https://chat.whatsapp.com/IwGvJnfIK2V6MKQLcbVIOo"><button style="background-color: green;>Join Group</button</a>`,
              };

              fetch(`https://enigma-form.onrender.com/send-email`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(emailData),
              })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error(error));

              setFormData({
                name: "",
                regd: "",
                branch: "",
                section: "",
                email: "",
                contact: "",
              });
            }
          });
        }
      }
    });
  };

  return (
    <>
      <div
        className="l1"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div className="matrix-container">
          <Matrix />
        </div>
        <img
          src={logo}
          alt="Logo"
          style={{
            height: "80px",
            width: "80px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        <div
          className="form-container"
          style={{ display: "flex", flexDirection: "column", gap: "5px" }}
        >
          <h1>Registration Form</h1>
          <TextField
            type="text"
            color="success"
            defaultValue="success"
            id="name"
            label="Name"
            value={formData.name}
            onChange={(event) => handleInputChange(event, "name")}
            error={!!formErrors.name}
            helperText={formErrors.name}
            style={{ marginBottom: "10px" }}
            InputLabelProps={{
              style: { color: "green" },
            }}
            InputProps={{
              style: {
                borderColor: "green !important",
                "&:focus": {
                  borderColor: "green !important",
                },
              },
            }}
          />

          <TextField
            type="text"
            color="success"
            defaultValue="success"
            id="email"
            label="Email"
            value={formData.email}
            onChange={(event) => handleInputChange(event, "email")}
            error={!!formErrors.email}
            helperText={formErrors.email}
            style={{ marginBottom: "10px" }}
            InputLabelProps={{
              style: { color: "green" },
              focused: false,
            }}
            InputProps={{
              style: { borderColor: "green" },
              focused: false,
            }}
          />
          <TextField
            type="text"
            color="success"
            defaultValue="success"
            id="regd"
            label="Registration No."
            value={formData.regd}
            onChange={(event) => handleInputChange(event, "regd")}
            error={!!formErrors.regd}
            helperText={formErrors.regd}
            style={{ marginBottom: "10px" }}
            InputLabelProps={{
              style: { color: "green" },
              focused: false,
            }}
            InputProps={{
              style: { borderColor: "green" },
              focused: false,
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <FormControl error={!!formErrors.branch} style={{ width: "48%" }}>
              <InputLabel id="branch-label" style={{ color: "green" }}>
                Branch
              </InputLabel>
              <Select
                type="text"
                color="success"
                defaultValue="success"
                labelId="branch-label"
                id="branch"
                value={formData.branch}
                label="Branch"
                onChange={(event) => handleInputChange(event, "branch")}
                InputLabelProps={{
                  style: { color: "green" },
                }}
                InputProps={{
                  style: {
                    borderColor: formErrors.branch ? "red" : "green",
                    "&:focus": {
                      borderColor: "green",
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select Branch</em>
                </MenuItem>
                {branchOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{formErrors.branch}</FormHelperText>
            </FormControl>

            <FormControl error={!!formErrors.section} style={{ width: "48%" }}>
              <InputLabel id="section-label" style={{ color: "green" }}>
                Section
              </InputLabel>
              <Select
                type="text"
                color="success"
                defaultValue="success"
                labelId="section-label"
                id="section"
                value={formData.section}
                label="Section"
                onChange={(event) => handleInputChange(event, "section")}
                InputLabelProps={{
                  style: { color: "green" },
                }}
                InputProps={{
                  style: {
                    borderColor: formErrors.section ? "red" : "green",
                    "&:focus": {
                      borderColor: "green",
                    },
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select Section</em>
                </MenuItem>
                {sectionOptions.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{formErrors.section}</FormHelperText>
            </FormControl>
          </div>
          <TextField
            type="text"
            color="success"
            defaultValue="success"
            id="contact"
            label="Whatsapp No."
            value={formData.contact}
            onChange={(event) => handleInputChange(event, "contact")}
            error={!!formErrors.contact}
            helperText={formErrors.contact}
            style={{ marginTop: "7px" }}
            InputLabelProps={{
              style: { color: "green" },
              focused: false,
            }}
            InputProps={{
              style: { borderColor: "green" },
              focused: false,
            }}
          />

          <button className="button-18" onClick={handleSubmit}>
            Submit
          </button>

          <div
            style={{ position: "absolute", top: 0, right: 0, fontSize: "20px" }}
          >
            <Toaster position="top-right" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
