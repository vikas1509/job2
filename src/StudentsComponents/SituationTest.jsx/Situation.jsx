import React, { useState, useEffect, useContext } from 'react';
import DataContext from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import './SituationTest.css';

const SituationTest = () => {
    const navigate = useNavigate();
    const { user } = useContext(DataContext);
    const [questions, setQuestions] = useState([]);
    const [paragraph, setParagraph] = useState("");
    const [answers, setAnswers] = useState({});
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [percentageAnswered, setPercentageAnswered] = useState(0);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:8000/flask/situ/${user}`);
                const data = await response.json();
                console.log(data[0],"situation quetionsss");
                setQuestions(data[0]);
                console.log(data[1],"paragraph");
                setParagraph(data[2]);
            } catch (error) {
                console.error("Error fetching questions:", error);
            }
        };

        fetchQuestions();
    }, [user]);

    useEffect(() => {
        checkForm();
    }, [answers, questions]);

    const handleChange = (questionIndex, optionValue) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionIndex]: optionValue,
        }));
    };

    const checkForm = () => {
        const answeredQuestions = Object.keys(answers).length;
        const percentage = questions.length > 0 ? (answeredQuestions / questions.length) * 100 : 0;
        setPercentageAnswered(percentage);
        setIsSubmitDisabled(answeredQuestions !== questions.length);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitDisabled) {
            alert('Please answer all questions before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('name', user);
        formData.append('count', questions.length);
        Object.keys(answers).forEach((key, index) => {
            formData.append(`mcq-${index + 1}`, answers[key]);
        });

        try {
            const response = await fetch('http://localhost:8000/flask/situation_submit_test', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                navigate("/Congratulations");
                alert('Test submitted successfully.');
            } else {
                alert('Failed to submit test.');
            }
        } catch (error) {
            console.error('Error submitting the test:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    if (questions.length === 0) {
        return <p>Loading questions...</p>;
    }

    return (
        <div className="situation-container">
            <h1 className="situation-title">Situation Based Test</h1>
            <form id="testForm" onSubmit={handleSubmit}>
                <div className="situation-passage">
                    <p>{paragraph}</p>
                </div>
                {questions.map((question, index) => (
                    <div key={index}>
                        <div className="situation-question">
                            <p>{question.question}</p>
                        </div>
                        <ul className="situation-options">
                            {['A', 'B', 'C', 'D'].map((option) => (
                                <li key={option}>
                                    <input
                                        type="radio"
                                        id={`option${option}-${index}`}
                                        name={`mcq-${index + 1}`}
                                        value={option}
                                        checked={answers[index] === option}
                                        onChange={() => handleChange(index, option)}
                                        required
                                    />
                                    <label htmlFor={`option${option}-${index}`}>{question[`option${option}`]}</label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                <input type="hidden" name="name" value={user} />
                <input type="hidden" name="count" value={questions.length} />
                <div className="situation-submit-btn-wrapper">
                    <p className="situation-answered-questions">You Answered: {percentageAnswered}%</p>
                </div>
                <button type="submit" className="situation-submit-btn" disabled={isSubmitDisabled}>
                    Submit
                </button>
            </form>
            <p id="error" style={{ display: isSubmitDisabled ? 'block' : 'none' }}>
                Please answer all questions
            </p>
        </div>
    );
};

export default SituationTest;
