import React, { useState, useEffect, useContext } from 'react';
import DataContext from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import './VerbalTest.css';

const VerbalTest = () => {
    const navigate = useNavigate();
    const { user } = useContext(DataContext);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [percentageAnswered, setPercentageAnswered] = useState(0);



    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:8000/flask/verbal/${user}`);
                const data = await response.json();
                console.log(data[0],"verbal quetionsss");
                setQuestions(data[0]);
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
            const response = await fetch('http://localhost:8000/flask/verbal_submit_test', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                navigate("/Situation");
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
        <div className="verbal-body">
            <div className="verbal-container">
                <h1 className="verbal-title">Verbal Test</h1>
                <form id="testForm" onSubmit={handleSubmit}>
                    {questions.map((question, index) => (
                        <div key={index}>
                            <div className="verbal-question">
                                <p>{question.question}</p>
                            </div>
                            <ul className="verbal-options">
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
                    <div className="verbal-submit-btn-wrapper">
                        <p className="verbal-answered-questions">You Answered: {percentageAnswered}%</p>
                    </div>
                    <button type="submit" className="verbal-submit-btn" disabled={isSubmitDisabled}>
                        Submit
                    </button>
                </form>
                <p id="error" style={{ display: isSubmitDisabled ? 'block' : 'none' }}>
                    Please answer all questions
                </p>
            </div>
        </div>
    );
};

export default VerbalTest;