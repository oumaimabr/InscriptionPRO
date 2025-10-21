import { useState } from "react";
import Input from "../../components/input";
import Layout from "./layout";
import Btn from "../../components/btn";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Return from "../../assets/images/return.svg";

const StepOne = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "L'adresse e-mail est requise";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'adresse e-mail n'est pas valide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://example.com/api/v1/auth/signup",
        {
          role: "provider",
          email: formData.email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle successful response
      if (response.status === 200) {
        // Redirect to next step or show success message
        console.log("Email registered successfully:", response.data);

        // Example: navigate to next step
        navigate("/inscription-pro2", {
          state: {
            email: formData.email,
            duration: response?.data?.duration,
          },
        });
        localStorage.setItem("step1", {
          email: formData.email,
          duration: response?.data?.duration,
        });
      } else {
        setErrors({
          submit: response.data.message || "Une erreur s'est produite",
        });
      }
    } catch (error) {
      console.error("Registration error:", error);

      // Handle different error types
      if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Erreur du serveur";

        if (error.response.status === 409) {
          setErrors({ email: "Cet e-mail est déjà utilisé" });
        } else if (error.response.status === 400) {
          setErrors({ email: "Format d'e-mail invalide" });
        } else {
          setErrors({ submit: errorMessage });
        }
      } else if (error.request) {
        // Network error
        setErrors({ submit: "Erreur de connexion. Vérifiez votre internet." });
      } else {
        // Other errors
        setErrors({ submit: "Une erreur inattendue s'est produite" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      
      <div className="d-flex flex-column">
        <h1 className="mb-5">Inscription PRO</h1>
        <form onSubmit={handleSubmit} className="form">
          <Input
            type="email"
            name="email"
            label="Adresse e-mail"
            placeholder="Votre e-mail"
            value={formData.email}
            onChange={handleChange("email")}
            error={errors.email}
            className=""
            disabled={isLoading}
          />

          {/* Display submit error */}
          {errors.submit && (
            <div className="alert alert-danger mt-2">{errors.submit}</div>
          )}

          <Btn
            classbtn={"primary-btn w-100 mt-16"}
            name={isLoading ? "Chargement..." : "Suivant"}
            type="submit"
            disabled={isLoading || formData?.email.length===0}
          />
        </form>
      </div>
    </Layout>
  );
};

export default StepOne;
