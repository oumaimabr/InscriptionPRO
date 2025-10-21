import { useState } from "react";
import Input from "../../components/input";
import Layout from "./layout";
import Btn from "../../components/btn";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import ParrinageIcon from '../../assets/images/parrinage.svg';
import ParrainageModal from "../../components/modal";

const InfoPerso = () => {
    const navigate = useNavigate();
    const location=useLocation()
    let token=location?.state?.token
    let password=location?.state?.password
    console.log({token,password})
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        dateNaissance: "",
        telephone: ""
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showParrainageModal, setShowParrainageModal] = useState(false);
    const [parrainageCode, setParrainageCode] = useState("");

    const validateForm = () => {
        const newErrors = {};

        // Nom validation
        if (!formData.nom) {
            newErrors.nom = "Le nom est requis";
        } else if (formData.nom.length < 2) {
            newErrors.nom = "Le nom doit contenir au moins 2 caractères";
        }

        // Prénom validation
        if (!formData.prenom) {
            newErrors.prenom = "Le prénom est requis";
        } else if (formData.prenom.length < 2) {
            newErrors.prenom = "Le prénom doit contenir au moins 2 caractères";
        }

        // Date de naissance validation
        if (!formData.dateNaissance) {
            newErrors.dateNaissance = "La date de naissance est requise";
        } else {
            const birthDate = new Date(formData.dateNaissance);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            
            // Check if birthday has occurred this year
            const hasBirthdayOccurred = today.getMonth() > birthDate.getMonth() || 
                                      (today.getMonth() === birthDate.getMonth() && 
                                       today.getDate() >= birthDate.getDate());
            
            const actualAge = hasBirthdayOccurred ? age : age - 1;
            
            if (actualAge < 18) {
                newErrors.dateNaissance = "Vous devez avoir au moins 18 ans";
            } else if (actualAge > 100) {
                newErrors.dateNaissance = "Veuillez vérifier votre date de naissance";
            }
        }

        // Telephone validation
        if (!formData.telephone) {
            newErrors.telephone = "Le numéro de téléphone est requis";
        } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{8,}$/.test(formData.telephone)) {
            newErrors.telephone = "Le numéro de téléphone n'est pas valide";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field) => (e) => {
        const value = e.target.value;
        
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const handleOpenParrainageModal = () => {
        setShowParrainageModal(true);
    };

    const handleCloseParrainageModal = () => {
        setShowParrainageModal(false);
    };

    const handleAddParrainageCode = (code) => {
        setParrainageCode(code);
        setShowParrainageModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const requestData = {
                role: "provider",
                last_name: formData.nom,
                        first_name: formData.prenom,
                        birth_date: new Date(formData.dateNaissance),
                        phone_number: formData.telephone,
                        referral_code: parrainageCode,
                        signup_token:token,
                        password:password,
            };

            // Add parrainage code if provided
            if (parrainageCode) {
                requestData.parrainageCode = parrainageCode;
            }

            const response = await axios.post(
                "https://example.com/api/v1/auth/signup/finish",
                requestData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            // Handle successful response
            if (response.status === 200) {
                console.log("Registration successful:", response.data);

                // Navigate to next step with all necessary data
                navigate('/Confirmation');
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

                setErrors({ submit: errorMessage });
                
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

    // Calculate max date for date input (18 years ago)
    const getMaxBirthDate = () => {
        const today = new Date();
        const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        return maxDate.toISOString().split('T')[0];
    };

    // Calculate min date for date input (100 years ago)
    const getMinBirthDate = () => {
        const today = new Date();
        const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
        return minDate.toISOString().split('T')[0];
    };

    return (
        <Layout>
            <div className="d-flex flex-column">
                <h1 className="mb-5">Informations personnelles</h1>
                <form onSubmit={handleSubmit} className="form">
                    {/* Prénom Field */}
                    <Input
                        type="text"
                        name='prenom'
                        label="Prénom"
                        placeholder="Votre prénom"
                        value={formData.prenom}
                        onChange={handleChange("prenom")}
                        error={errors.prenom}
                        className="mb-3"
                        disabled={isLoading}
                    />

                    {/* Nom Field */}
                    <Input
                        type="text"
                        name='nom'
                        label="Nom"
                        placeholder="Votre nom"
                        value={formData.nom}
                        onChange={handleChange("nom")}
                        error={errors.nom}
                        className="mb-3"
                        disabled={isLoading}
                    />

                    {/* Date de naissance Field */}
                    <Input
                        type="date"
                        name='dateNaissance'
                        label="Date de naissance"
                        value={formData.dateNaissance}
                        onChange={handleChange("dateNaissance")}
                        error={errors.dateNaissance}
                        className="mb-3"
                        disabled={isLoading}
                        min={getMinBirthDate()}
                        max={getMaxBirthDate()}
                    />

                    {/* Téléphone Field */}
                    <Input
                        type="tel"
                        name='telephone'
                        label="Numéro de téléphone"
                        placeholder="Votre numéro de téléphone"
                        value={formData.telephone}
                        onChange={handleChange("telephone")}
                        error={errors.telephone}
                        className="mb-3"
                        disabled={isLoading}
                    />

                    {/* Parrainage Section */}
                    <div className="parrainage-section mt-16">
                        {parrainageCode ? (
                            <div className="parrainage-code-display d-flex justify-content-between align-items-center p-3 bg-light rounded">
                                <div className="d-flex align-items-center">
                                    <img src={ParrinageIcon} alt="parrainage icon" className="me-2" />
                                    <span>Code de parrainage: <strong>{parrainageCode}</strong></span>
                                </div>
                                <button 
                                    type="button" 
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={handleOpenParrainageModal}
                                >
                                    Modifier
                                </button>
                            </div>
                        ) : (
                            <button 
                                type="button" 
                                className="parrinage-box w-100 d-flex justify-content-between align-items-center "
                                onClick={handleOpenParrainageModal}
                            >
                                <div className="d-flex align-items-center">
                                    <img src={ParrinageIcon} alt="parrainage icon" className="me-2" />
                                    Ajouter un code de parrainage
                                </div>
                                <span className="text-muted">+</span>
                            </button>
                        )}
                    </div>

                    {/* Display submit error */}
                    {errors.submit && (
                        <div className="alert alert-danger mt-2">{errors.submit}</div>
                    )}

                    <Btn
                        classbtn={"primary-btn mt-16 w-100"}
                        name={isLoading ? "Chargement..." : "Créer mon compte"}
                        type="submit"
                        disabled={isLoading}
                    />
                </form>

                {/* Parrainage Modal */}
                <ParrainageModal
                    show={showParrainageModal}
                    onClose={handleCloseParrainageModal}
                    onAddCode={handleAddParrainageCode}
                    existingCode={parrainageCode}
                />
            </div>
        </Layout>
    );
};

export default InfoPerso;