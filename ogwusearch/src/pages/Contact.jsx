import { useState } from "react";
import styled from "styled-components";

const ContactContainer = styled.div`
  max-width: 600px;
  margin: 3rem auto;
  padding: 0 1rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  color: #0070f3;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1.5px solid #ccc;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #0070f3;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1.5px solid #ccc;
  min-height: 120px;
  resize: vertical;

  &:focus {
    border-color: #0070f3;
    outline: none;
  }
`;

const ErrorMsg = styled.span`
  color: #d32f2f;
  font-size: 0.85rem;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  font-size: 1.1rem;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  transition: background-color 0.3s ease;

  &:hover:not(:disabled) {
    background-color: #005bb5;
  }

  &:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.p`
  color: #2e7d32;
  font-weight: 600;
  text-align: center;
  margin-top: 1rem;
`;

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required.";
    if (!formData.email.trim()) errs.email = "Email is required.";
    else if (!emailRegex.test(formData.email)) errs.email = "Invalid email address.";
    if (!formData.message.trim()) errs.message = "Message cannot be empty.";
    return errs;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);

    // Simulate sending data to a server
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <ContactContainer>
      <Title>Contact Me</Title>
      <Form onSubmit={handleSubmit} noValidate>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby="name-error"
          />
          {errors.name && <ErrorMsg id="name-error">{errors.name}</ErrorMsg>}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
          />
          {errors.email && <ErrorMsg id="email-error">{errors.email}</ErrorMsg>}
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <TextArea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            aria-invalid={!!errors.message}
            aria-describedby="message-error"
          />
          {errors.message && <ErrorMsg id="message-error">{errors.message}</ErrorMsg>}
        </div>

        <SubmitButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Message"}
        </SubmitButton>
      </Form>

      {success && <SuccessMessage>Thanks for reaching out! I will get back to you soon.</SuccessMessage>}
    </ContactContainer>
  );
};

export default Contact;
