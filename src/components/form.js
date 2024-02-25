import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { toast, Toaster } from "react-hot-toast";
import "./form.css";
import logo from "../components/images/EnigmaLogo.png";
// import Matrix from "./Matrix";

const Form = () => {
  const [responseData, setResponseData] = useState(null);
  const [interest, setInterest] = useState(false);
  const [inductionDomainS, setInductionDomainS] = useState("");
  const [inductionDomainP, setInductionDomainP] = useState("");
  const [enigma,setEnigma]=useState("");
  const [loading, setLoading] = useState(false);
  const inductionDomainOptionsS = [
    "Web Dev",
    "App Dev",
    "Game Dev",
    "AI/ML",
    "Cyber Security",
    "Cloud Computing",
    "UI/UX",
    "Blender",
  ];
  const inductionDomainOptionsP = [
    "Web Dev",
    "App Dev",
    "Game Dev",
    "AI/ML",
    "Cyber Security",
    "Cloud Computing",
    "UI/UX",
    "Blender",
  ];

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    gender:"",
    regd: "",
    branch: "",
    section: "",
    email: "",
    contact: "",
    feedback: "",
  });
  const [formErrors, setFormErrors] = useState({
    fname: "",
    lname: "",
    gender:"",
    regd: "",
    branch: "",
    section: "",
    email: "",
    contact: "",
    feedback: "",
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

  const gender=["Male","Female","Prefer not to say"]

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
    setLoading(true);
    const uniqueNum = Date.now();
    const dateObject = new Date(uniqueNum);
    console.log(inductionDomainP, inductionDomainS);
    const newItem = {
      date: dateObject.toLocaleString(),
      first_name: formData.fname,
      last_name: formData.lname,
      gender: formData.gender,
      regd: formData.regd,
      branch: formData.branch,
      section: formData.section,
      email: formData.email,
      contact: formData.contact,
      feedback: formData.feedback,
      enigmaMotivation:enigma,
      primary_domain: inductionDomainP,
      secondary_domain: inductionDomainS,
    };

    axios
      .post("https://enigma-regd-backend.onrender.com/add-regn", newItem)
      .then((response) => {
        setLoading(false);
        if (response.data.error) {
          toast.error(response.data);
        } else {
          setResponseData(response.data);
          toast.success("Registration successful!");

          const emailData = {
            to: formData.email,
            subject: "Thanking you for registration  ",
            text: "Welcome To Enigma",
            html: `     <div className="form-container" style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <h1 style="text-align:center;">Thank You</h1>
          <p>Best regards,</p>
          <p>Enigma-VSSUT</p>            
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram" style={{ fontSize: "24px", margin: "0 10px", color: "green" }}></i>
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-linkedin" style={{ fontSize: "24px", margin: "0 10px", color: "green" }}></i>
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-twitter" style={{ fontSize: "24px", margin: "0 10px", color: "green" }}></i>
          </a>
        </div>
      </div>
`,
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
            fname: "",
            lname: "",
            regd: "",
            branch: "",
            section: "",
            email: "",
            feedback: "",
            contact: "",
          });
          setInductionDomainP("");
          setInductionDomainS("");
          setInterest(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          console.error(error.response.data);
          toast.error(`${error.response.data.error}`);
        } else if (error.request) {
          console.error("Network error:", error.request);
          toast.error("Network error. Please check your internet connection.");
        } else {
          console.error("Request error:", error.message);
          toast.error("Request error. Please try again.");
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
          marginBottom: "10px",
        }}
      >
        <div className="ma-container"></div>
        <a href="https://enigmavssut.com/" rel="noreferrer" target="_blank">
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
        </a>
        <div
          className="form-container"
          style={{ display: "flex", flexDirection: "column", gap: "5px" }}
        >
          <h1>Registration Form</h1>
          <TextField
            type="text"
            color="success"
            defaultValue=""
            id="name"
            autoComplete="off"
            label="First Name"
            value={formData.fname}
            onChange={(event) => handleInputChange(event, "fname")}
            error={!!formErrors.fname}
            helperText={formErrors.fname}
            style={{ marginBottom: "10px", width: "100%" }}
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
              marginTop: "10px",
            }}
          >
            <TextField
              type="text"
              color="success"
              defaultValue=""
              id="name"
              autoComplete="off"
              label="Last Name"
              value={formData.lname}
              onChange={(event) => handleInputChange(event, "lname")}
              error={!!formErrors.lname}
              helperText={formErrors.lname}
              style={{ marginBottom: "10px", width: "100%" }}
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
              <FormControl error={!!formErrors.branch} style={{ width: "48%" }}>
                  <InputLabel id="branch-label" style={{ color: "green" }}>
                    Gender
                  </InputLabel>
                  <Select
                    type="text"
                    color="success"
                    defaultValue="success"
                    autoComplete="off"
                    labelId="gender-label"
                    id="gender"
                    value={formData.gender}
                    label="Gender"
                    style={{ marginBottom: "10px", width: "100%" }}
                    onChange={(event) => handleInputChange(event, "gender")}
                    InputLabelProps={{
                      style: { color: "green" },
                    }}
                    InputProps={{
                      style: {
                        borderColor: formErrors.gender ? "red" : "green",
                        "&:focus": {
                          borderColor: "green",
                        },
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      <em>Select Gender</em>
                    </MenuItem>
                    {gender.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{formErrors.gender}</FormHelperText>
                </FormControl>
          </div>

          <TextField
            type="text"
            color="success"
            defaultValue="success"
            id="email"
            autoComplete="off"
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
            autoComplete="off"
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
              gap: "20px",
              width: "100%",
            }}
          >
            <FormControl error={!!formErrors.branch} style={{ width: "48%" }}>
              <InputLabel id="branch-label" style={{ color: "green",borderColor:"white" }}>
                Branch
              </InputLabel>
              <Select
                type="text"
                color="success"
                defaultValue="success"
                autoComplete="off"
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
                autoComplete="off"
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
            autoComplete="off"
            label="Whatsapp No."
            value={formData.contact}
            onChange={(event) => handleInputChange(event, "contact")}
            error={!!formErrors.contact}
            helperText={formErrors.contact}
            style={{ marginTop: "7px", marginBottom: "10px" }}
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
            id="feedback"
            autoComplete="off"
            label="Write your expectations from this workshop"
            value={formData.feedback}
            onChange={(event) => handleInputChange(event, "feedback")}
            error={!!formErrors.feedback}
            helperText={formErrors.feedback}
            multiline
            rows={4}
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
              justifyContent: "flex-start",
              gap: "10px",
            }}
          >
            <span>
              <input
                type="checkbox"
                checked={interest}
                onChange={() => setInterest(!interest)}
                style={{ margin: 0, padding: 0 }}
              />
            </span>

            <span style={{ color: "green", marginBottom: "10px" }}>
              Interested to take part in Enigma Induction?
            </span>
          </div>
          {interest && (
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
              <TextField
                type="text"
                color="success"
                autoComplete="off"
                defaultValue="success"
                id="enigma"
                label="Why do you want to join Enigma?"
                value={enigma}
                onChange={(event) => setEnigma(event.target.value)}

                multiline
                rows={4}
                style={{ marginBottom: "10px",width:"100%" }}
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
                  justifyContent: "flex-start",
                  gap: "10px",
                }}
              >
                <span style={{ color: "green", marginBottom: "10px" }}>
                  Choose Domains
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "20px",
                  marginTop: "10px",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <InputLabel id="branch-label" style={{ color: "green" }}>
                    Primary
                  </InputLabel>
                  <Select
                    type="text"
                    color="success"
                    defaultValue="success"
                    autoComplete="off"
                    labelId="domains"
                    id="domains"
                    value={inductionDomainP}
                    label="domain"
                    onChange={(event) =>
                      setInductionDomainP(event.target.value)
                    }
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
                      <em>Select Primary Domain</em>
                    </MenuItem>
                    {inductionDomainOptionsP.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText></FormHelperText>
                </FormControl>
                <FormControl style={{ width: "100%" }}>
                  <InputLabel
                    id="branch-label"
                    style={{
                      color: "green"
                    }}
                  >
                    Secondary
                  </InputLabel>
                  <Select
                    type="text"
                    color="success"
                    defaultValue="success"
                    autoComplete="off"
                    labelId="domains"
                    id="domains"
                    value={inductionDomainS}
                    label="domain"
                    onChange={(event) =>
                      setInductionDomainS(event.target.value)
                    }
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
                      <em>Select Secondary Domain</em>
                    </MenuItem>
                    {inductionDomainOptionsS.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText></FormHelperText>
                </FormControl>
              </div>
            </div>
          )}

          <button
            className="button-18"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
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
