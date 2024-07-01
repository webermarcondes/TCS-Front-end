import React, { useState, useEffect } from "react";

const TelaErro = ({ message }) => {
    const [displayMessage, setDisplayMessage] = useState("");

    useEffect(() => {
        if (!message) {
            setDisplayMessage(message);
        } else {
            setDisplayMessage(message);
        }
    }, [message]);

    return (
        <div className="error-box bg-light p-4 rounded">
            <h4>ERROS</h4>
            <textarea
                className="form-control form-control-lg"
                readOnly
                value={displayMessage}
            />
        </div>
    );
};

export default TelaErro;
