import React, { useState, useEffect, useContext } from 'react';
import './Professional.css'; // Separate CSS file for styling
import DataContext from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

const ProfessionalTest = () => {
    const navigate = useNavigate();
    const { user } = useContext(DataContext);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [percentageAnswered, setPercentageAnswered] = useState(0);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`http://localhost:8000/flask/profess/${user}`);
                const data = await response.json();

                console.log(data[0],"professional quetionssssss");
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
            const response = await fetch('http://localhost:8000/flask/profess_submit_test', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                navigate("/ReasoningTest")
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
        <div className="professionalContainer">
            <h1 className="professionalTitle">Professionalism Test</h1>
            <form id="testForm" onSubmit={handleSubmit}>
                {questions.map((question, index) => (
                    <div key={index}>
                        <div className="professionalQuestion">
                            <p>{question.question}</p>
                        </div>
                        <ul className="professionalOptions">
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
                <div className="professionalSubmitBtnWrapper">
                    <p className="professionalAnsweredQuestions">You Answered: {percentageAnswered}%</p>
                </div>
                <button type="submit" className="professionalSubmitBtn" disabled={isSubmitDisabled}>
                    Submit
                </button>
            </form>
            <p className="professionalError" id="error" style={{ display: isSubmitDisabled ? 'block' : 'none' }}>
                Please answer all questions
            </p>
        </div>
    );
};

export default ProfessionalTest
