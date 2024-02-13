import React, { useState } from "react";

import AWS from "aws-sdk";
import { toast, Toaster } from "react-hot-toast";
import "./form.css";
import logo from "../components/images/EnigmaLogo.png";

const AWS_ACCESS_KEY_ID = "AKIAXYKJT7OCKNTDZC6G";
const AWS_SECRET_ACCESS_KEY = "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";
const AWS_REGION = "ap-south-1";

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

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    const parsedValue = id === "contact" ? parseInt(value, 10) : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: parsedValue,
    }));
    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [id]: "", 
    }));
  };
  const validateForm = () => {
    let isValid = true;
    const errors = {};
  
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    for (const key in formData) {
      const value = formData[key];
  
      if (typeof value === 'string' && value.trim() === "") {
        errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        isValid = false;
      }
  
     
      if (key === "email" && !emailRegex.test(value.trim())) {
        errors.email = "Invalid email format";
        isValid = false;
      }
      if (key === "contact" && (!/^\d{10}$/.test(value))) {
        errors.contact = "Contact number should be a 10-digit number";
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
       
      }
    });
  };

  return (
    <div class="l1"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <img src={logo} alt="Logo" style={{ height: "80px", width: "80px", position: "absolute", top: 0, left: 0 }} />
      <div
        className="form-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          flexDirection: "column",
          marginTop: "70px", 
        }}
      >
        
        <div>
          <h1>Registration Form</h1>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            onChange={handleInputChange}
            value={formData.name}
          />
          {formErrors.name && <span className="error">{formErrors.name}</span>}
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            onChange={handleInputChange}
            value={formData.email}
          />
          {formErrors.email && <span className="error">{formErrors.email}</span>}
        </div>
        <div>
          <label htmlFor="regd">Registration No.:</label>
          <input
            id="regd"
            onChange={handleInputChange}
            value={formData.regd}
          />
          {formErrors.regd && <span className="error">{formErrors.regd}</span>}
        </div>
        <div>
          <label htmlFor="branch">Branch:</label>
          <input
            id="branch"
            onChange={handleInputChange}
            value={formData.branch}
          />
          {formErrors.branch && <span className="error">{formErrors.branch}</span>}
        </div>
        <div>
          <label htmlFor="section">Section:</label>
          <input
            id="section"
            onChange={handleInputChange}
            value={formData.section}
          />
          {formErrors.section && <span className="error">{formErrors.section}</span>}
        </div>
        <div>
          <label htmlFor="contact">Whatsapp no:</label>
          <input
            id="contact"
            onChange={handleInputChange}
            value={formData.contact}
          />
          {formErrors.contact && <span className="error">{formErrors.contact}</span>}
        </div>
        <button style={{fontFamily:"cursive"}} onClick={handleSubmit}>Submit</button>
        <div style={{ position: 'absolute', top: 0, right: 0 ,fontSize:"25px"}}>
        <Toaster position="top-right" />
      </div>
      </div>
    </div>
  );
};

export default Form;
