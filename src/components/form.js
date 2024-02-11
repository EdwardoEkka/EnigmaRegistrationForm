import React, { useState, useEffect } from "react";
import AWS from "aws-sdk";

const AWS_ACCESS_KEY_ID = "";
const AWS_SECRET_ACCESS_KEY = "";
const AWS_REGION = "";

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

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    const parsedValue = id === "num" ? parseInt(value, 10) : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: parsedValue,
    }));
  };

  const handleSubmit = () => {
    console.log(formData);
    handleAddItem();
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
      } else {
        setResponseData(putData);
      }
    });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1>Fill the form.</h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          flexDirection: "column",
        }}
      >
        <div>
          <label htmlFor="name">Name:</label>
          <input id="name" onChange={handleInputChange} value={formData.name} />
        </div>
        <div>
          <label htmlFor="regd">Registration No.:</label>
          <input id="regd" onChange={handleInputChange} value={formData.regd} />
        </div>
        <div>
          <label htmlFor="branch">Branch:</label>
          <input
            id="branch"
            onChange={handleInputChange}
            value={formData.branch}
          />
        </div>
        <div>
          <label htmlFor="section">Section:</label>
          <input
            id="section"
            onChange={handleInputChange}
            value={formData.section}
          />
        </div>
        <div>
          <label htmlFor="email">Gmail:</label>
          <input
            id="email"
            onChange={handleInputChange}
            value={formData.email}
          />
        </div>
        <div>
          <label htmlFor="contact">Contact:</label>
          <input
            id="contact"
            onChange={handleInputChange}
            value={formData.contact}
          />
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Form;
