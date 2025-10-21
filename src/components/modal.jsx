// components/ParrainageModal.js (Bootstrap classes only)
import { useState, useEffect } from "react";
import Input from "./input";
import Btn from "./btn";


const ParrainageModal = ({ show, onClose, onAddCode, existingCode = "" }) => {
    const [code, setCode] = useState(existingCode);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (show) {
            setCode(existingCode);
            setError("");
        }
    }, [show, existingCode]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!code.trim()) {
            setError("Veuillez entrer un code de parrainage");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (code.trim().length < 3) {
                setError("Code de parrainage invalide");
                return;
            }
            
            onAddCode(code.trim());
        } catch (error) {
            setError("Erreur lors de la validation du code");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setCode(existingCode);
        setError("");
        onClose();
    };

    if (!show) return null;

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Code de parrainage</h5>
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={handleClose}
                            disabled={isLoading}
                        ></button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <p className="text-muted mb-3">
                            Permet à ton parrain de gagner 50€ après 3 rendez-vous* 
                            en entrant son code de parrainage dès maintenant ! 
                            </p>
                            
                            <Input
                                type="text"
                                name="parrainageCode"
                                label="Code de parrainage"
                                placeholder="Entrez le code"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value);
                                    setError("");
                                }}
                                error={error}
                                className="mb-3"
                                disabled={isLoading}
                            />
                        </div>
                        
                        <div className="modal-footer">
                            
                            
                            <Btn
                                classbtn={"primary-btn w-100"}
                                name={isLoading ? "Validation..." : "Enregistrer"}
                                type="submit"
                                disabled={!code.trim() || isLoading}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ParrainageModal;