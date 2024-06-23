import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataContext from '../../context/DataContext';
import './Congrats.css';

const Congrats = () => {
    const { user } = useContext(DataContext);



    return (
        <div className="congrats-body">
            <div className="confetti-wrapper" id="confetti-wrapper"></div>
            <div className="congrats-container">
                <div className="congrats-content">
                    <h1 className="congrats-title">Congratulations!</h1>
                    <p className="congrats-message">You have successfully submitted the test.</p>
                    <p className="congrats-message">
                        Please check your performance here
                        <Link to={`/Score`}>view</Link> for
                        the score and detailed analysis of your performance.
                    </p>
                </div>
            </div>
            <div className="congrats-footer">Hiring is powered by Hire-AI</div>
        </div>
    );
};

export default Congrats;
