import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './SuccessEmail.css'; // Import the CSS file
import DataContext from '../../context/DataContext';

const SuccessEmail = () => {
  const { user } = useContext(DataContext);

  return (
    <div className="successEmailContainer">
      <h1 className="successEmailHeading">Email Sent!</h1>
      <p className="successEmailText">
        A confirmation email containing the skill test link has been sent to
        your inbox.
      </p>
      <p className="successEmailText">Please check your inbox and follow the instructions.</p>
      <p className="successEmailText">If you haven't received the email, please check your spam folder.</p>
      <p className="successEmailText">
        Once you've received the email,
        <Link
          className="successEmailLink"
          to={`/SkillTest?user=${user}`}
        >
          click here
        </Link>
        to proceed to the test.
      </p>
    </div>
  );
};

export default SuccessEmail;
