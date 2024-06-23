import React, { useContext, useEffect, useState } from 'react';
import DataContext from '../../context/DataContext';
import './Score.css';

const Score = () => {
    const [scores, setScores] = useState([]);
    const [totalScore, setTotalScore] = useState(null);
    const [topics, setTopics] = useState(null);
    const { user } = useContext(DataContext);

    useEffect(() => {
        const fetchScores = async () => {
            try {
                const response = await fetch(`http://localhost:8000/flask/score/${user}`);
                const data = await response.json();
                setScores(data[1]);
                setTotalScore(data[2]);
                setTopics(data[0]);
            } catch (error) {
                console.error("Error fetching scores:", error);
            }
        };

        fetchScores();
    }, [user]);

    return (
        <div className="score-body">
            <div className="score-container">
                <h1 className="score-title">Student Test Marks</h1>
                {scores && topics && scores.map((score, index) => (
                    <div key={index} className="score-mark">
                        <span>{topics[index]}: </span>
                        {score !== -1 ? <span>{score}%</span> : <span>Not attempted</span>}
                    </div>
                ))}
                <div className="score-mark">
                    <span>Total Score: </span>
                    <span>{totalScore}%</span>
                </div>
            </div>
        </div>
    );
};

export default Score;
