import { useEffect, useState } from "react";
import Input from "../../components/input";
import Layout from "./layout";
import Info from "../../assets/images/error-warning-line.svg";
import Btn from "../../components/btn";
import { useLocation, useNavigate } from "react-router-dom";
import Eye from '../../assets/images/eye.svg'
// import "./password-validation.scss"; // Optional CSS file for styling

const StepThree = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  let token = location?.state?.token;
   useEffect(() => {
      if (!token) {
       // navigate("/inscription-pro1"); // Adjust the path to your previous step
      }
    }, [token, navigate]);
  // console.log({ token });
  const handleToggle = () => {
    setShowPassword(!showPassword);
  };
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  // Password validation rules
  const validatePassword = (pwd) => {
    const errors = [];

    if (pwd.length < 8) {
      errors.push("Au moins 8 caractères");
    }
    if (!/(?=.*[a-z])/.test(pwd)) {
      errors.push("Au moins une minuscule");
    }
    if (!/(?=.*[A-Z])/.test(pwd)) {
      errors.push("Au moins une majuscule");
    }
    if (!/(?=.*\d)/.test(pwd)) {
      errors.push("Au moins un chiffre");
    }
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(pwd)) {
      errors.push("Au moins un caractère spécial");
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate password field
    if (name === "password") {
      const passwordErrors = validatePassword(value);
      setErrors((prev) => ({
        ...prev,
        password: passwordErrors.length > 0 ? passwordErrors.join(", ") : "",
      }));

      // Also validate confirmation if confirmPassword is not empty
      if (formData.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword:
            value !== formData.confirmPassword
              ? "Les mots de passe ne correspondent pas"
              : "",
        }));
      }
    }

    // Validate confirm password field
    if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value !== formData.password
            ? "Les mots de passe ne correspondent pas"
            : "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      password: true,
      confirmPassword: true,
    });

    const passwordErrors = validatePassword(formData.password);
    const confirmError =
      formData.password !== formData.confirmPassword
        ? "Les mots de passe ne correspondent pas"
        : "";

    if (passwordErrors.length === 0 && !confirmError) {
      // Form is valid, proceed with submission
      // alert('Mot de passe validé avec succès!');
      // Add your form submission logic here
      navigate("/info-perso", {
        state: {
          token: location.state?.token,
          password: formData?.password,
        },
      });
      localStorage.setItem("step3", {
        token: location.state?.token,
        password: formData?.password,
      });
    } else {
      setErrors({
        password: passwordErrors.length > 0 ? passwordErrors.join(", ") : "",
        confirmPassword: confirmError,
      });
    }
  };

  // Password validation states for UI feedback
  const isLongEnough = formData.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
    formData.password
  );

  // Check if form is valid for submit button
  const isFormValid =
    formData.password &&
    formData.confirmPassword &&
    !errors.password &&
    !errors.confirmPassword;

  return (
    <Layout>
      <div className="d-flex flex-column">
        <div className="password-container">
          <h1 className="text-center mb-24">Création du mot de passe</h1>

          <form onSubmit={handleSubmit} className="password-form">
            {/* Password Field */}
           
            <div className="floating-input-container position-relative form-group mb-24">
                  
                  <input
                 type={showPassword ? 'text' : 'password'}
                name="password"
                label="Mot de passe"
                
                placeholder="Entrez votre mot de passe"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password ? errors.password : ""}
                className="w-100 mb-16"
              />

                  <div
                    className="password-toggle-icon position-absolute"
                    style={{
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                    }}
                    onClick={handleToggle}
                  >
                    {showPassword ? (
                      <img src={Eye} alt="Hide Password" />
                    ) : (
                      <img src={Eye} alt="Show Password" />
                    )}
                  </div>
                </div>
           
            

              {/* Password Requirements */}
              <div className="password-requirements mt-16">
                {/* <h3 className="requirement-title mb-16">Le mot de passe doit contenir :</h3> */}
                <ul className="requirement-list">
                  <li
                    className={`requirement-item ${
                      isLongEnough ? "valid" : "invalid"
                    }`}
                  >
                    <img src={Info} alt="info icon" className="icon mr-8" />
                    Plus de 8 caractères
                  </li>
                  <li
                    className={`requirement-item ${
                      hasUppercase ? "valid" : "invalid"
                    }`}
                  >
                    <img src={Info} alt="info icon" className="icon mr-8" />
                    Au minimum une majuscule
                  </li>
                  <li
                    className={`requirement-item ${
                      hasLowercase ? "valid" : "invalid"
                    }`}
                  >
                    <img src={Info} alt="info icon" className="icon mr-8" />
                    Au minimum une minuscule
                  </li>
                  <li
                    className={`requirement-item ${
                      hasNumber ? "valid" : "invalid"
                    }`}
                  >
                    <img src={Info} alt="info icon" className="icon mr-8" />
                    Doit contenir un chiffre
                  </li>
                  <li
                    className={`requirement-item ${
                      hasSpecialChar ? "valid" : "invalid"
                    }`}
                  >
                    <img src={Info} alt="info icon" className="icon mr-8" />
                    Doit contenir un caractère spécial
                  </li>
                </ul>
              </div>
         

            {/* Confirm Password Field */}
            <div className="floating-input-container position-relative form-group mb-24">
                  
                  <input
                 type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                label="Mot de passe"
                
                placeholder="Entrez votre mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword ? errors.confirmPassword : ""}
                className="w-100 mb-16"
              />

                  <div
                    className="password-toggle-icon position-absolute"
                    style={{
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                    }}
                    onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <img src={Eye} alt="Hide Password" />
                    ) : (
                      <img src={Eye} alt="Show Password" />
                    )}
                  </div>
                </div>

            {/* Submit Button */}
            <div className="mt-24">
              <Btn
                type="submit"
                onClick={handleSubmit}
                classbtn="primary-btn  w-100 mt-16 w-sm-100"
                name={"Confirmer"}
                disabled={!isFormValid}
              />
            </div>
            {/* <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={!isFormValid}
            >
              Valider
            </button> */}
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default StepThree;
