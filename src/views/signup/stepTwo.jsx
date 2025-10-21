import { useRef, useState, useEffect } from "react";
import Input from "../../components/input";
import Layout from "./layout";
import Btn from "../../components/btn";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const StepTwo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [resendCountdown, setResendCountdown] = useState(
    location.state?.duration
  );

  let email = location.state?.email;
  let duration = location.state?.duration;
  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate("/inscription-pro1"); // Adjust the path to your previous step
    }
  }, [email, navigate]);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown]);

  // Start countdown when component mounts (from first step)
  useEffect(() => {
    setResendCountdown(duration); // 60 seconds countdown
  }, []);

  const validateForm = () => {
    const newErrors = {};

    // Code validation
    if (!code || code.length !== 6) {
      newErrors.code = "Le code doit contenir 6 chiffres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleInput(e, index) {
    const input = e.target;
    const previousInput = inputRefs[index - 1];
    const nextInput = inputRefs[index + 1];

    // Update code state with single digit
    const newCode = [...code];
    // Only allow numbers
    const inputValue = input.value.replace(/[^0-9]/g, "");

    if (inputValue) {
      newCode[index] = inputValue;
      inputRefs[index].current.value = inputValue;
    } else {
      newCode[index] = "";
    }

    setCode(newCode.join(""));
    input.select();

    if (inputValue === "") {
      // If the value is deleted, select previous input, if exists
      if (previousInput) {
        previousInput.current.focus();
      }
    } else if (nextInput) {
      // Select next input on entry, if exists
      nextInput.current.select();
    }
  }

  // Select the contents on focus
  function handleFocus(e) {
    e.target.select();
  }

  // Handle backspace key
  function handleKeyDown(e, index) {
    const input = e.target;
    const previousInput = inputRefs[index - 1];
    const nextInput = inputRefs[index + 1];

    if ((e.keyCode === 8 || e.keyCode === 46) && input.value === "") {
      e.preventDefault();
      setCode(
        (prevCode) => prevCode.slice(0, index) + prevCode.slice(index + 1)
      );
      if (previousInput) {
        previousInput.current.focus();
      }
    }
  }

  // Capture pasted characters
  const handlePaste = (e) => {
    const pastedCode = e.clipboardData.getData("text");
    const numericCode = pastedCode.replace(/[^0-9]/g, "");
    if (numericCode.length === 6) {
      setCode(numericCode);
      inputRefs.forEach((inputRef, index) => {
        inputRef.current.value = numericCode.charAt(index);
      });
    }
  };

  // Resend code function
  const handleResendCode = async () => {
    if (resendCountdown > 0) return;

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://example.com/api/v1/auth/signup",
        {
          role: "provider",
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Start 60 seconds countdown
        setResendCountdown(60);
        // Show success message
        setErrors({ resend: "Code renvoyé avec succès!" });

        // Clear success message after 3 seconds
        setTimeout(() => {
          setErrors((prev) => ({ ...prev, resend: "" }));
        }, 3000);
      }
    } catch (error) {
      console.error("Resend code error:", error);
      setErrors({
        resend: "Erreur lors de l'envoi du code. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      setErrors({ submit: "Veuillez entrer un code valide de 6 chiffres" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://example.com/api/v1/auth/signup/verify",
        {
          code: code,
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Handle successful response
      if (response.status === 200) {
        console.log("Email verified successfully:", response.data);

        // Navigate to next step
        navigate("/inscription-pro3", {
          state: {
            email: email,
            token: response.data.signup_token,
          },
        });
        localStorage.setItem("step2", {
          email: email,
          token: response.data.signup_token,
        });
      } else {
        setErrors({
          submit: response.data.message || "Une erreur s'est produite",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);

      // Handle different error types
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Erreur du serveur";

        if (error.response.status === 400) {
          setErrors({ submit: "Code invalide ou expiré" });
        } else if (error.response.status === 404) {
          setErrors({ submit: "Email non trouvé" });
        } else {
          setErrors({ submit: errorMessage });
        }
      } else if (error.request) {
        setErrors({ submit: "Erreur de connexion. Vérifiez votre internet." });
      } else {
        setErrors({ submit: "Une erreur inattendue s'est produite" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="d-flex flex-column">
        <h1 className="mb-5">Vérification de ton email</h1>
        <p className="exergue bleu3 px-16 pt-8">
          Saisis le code à 6 chiffres envoyé à {email}
        </p>

        {/* Code Inputs */}
        <div className="row d-flex justify-content-around gap-2 relative px-16 mt-32">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              className="code-input text-2xl bg-gray-800 w-10 flex p-2 text-center"
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              onChange={(e) => handleInput(e, index)}
              ref={inputRefs[index]}
              autoFocus={index === 0}
              onFocus={handleFocus}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Error message for code */}
        {errors.code && (
          <div className="text-danger text-center mt-2">{errors.code}</div>
        )}

        {/* Resend Code Section */}
        <div className="mt-16">
          <p className="current-text text-center mb-8">
            Tu n’as pas reçu de code ?
          </p>

          <div className="text-center">
            <button
              onClick={handleResendCode}
              className={`tertiary ${resendCountdown > 0 ? "disabled" : ""}`}
              disabled={resendCountdown > 0 || isLoading}
            >
              Renvoyer un code
              {resendCountdown > 0 && ` (${resendCountdown}s)`}
            </button>
          </div>

          {/* Resend success/error messages */}
          {errors.resend && (
            <div
              className={`text-center mt-2 ${
                errors.resend.includes("succès")
                  ? "text-success"
                  : "text-danger"
              }`}
            >
              {errors.resend}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-24">
          <Btn
            type="submit"
            onClick={handleSubmit}
            classbtn="primary-btn mt-16 w-100 w-sm-100"
            name={isLoading ? "Vérification..." : "Valider"}
            disabled={isLoading || code.length !== 6}
          />

          {/* Submit error message */}
          {errors.submit && (
            <div className="alert alert-danger mt-2 text-center">
              {errors.submit}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StepTwo;
