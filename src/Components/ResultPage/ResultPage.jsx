import React, { useContext, useState } from 'react';
import axios from 'axios';
import DataContext from '../../context/DataContext';
import "./ResultPage.css"; // Ensure the path is correct
import send from "../../assets/send.png"; // Ensure the path is correct

const ResultsPage = () => {
  const baseURL = 'http://127.0.0.1:8000';
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { data, setData } = useContext(DataContext);

  const fetchData = async (url) => {
    try {
      console.log('Fetching data from URL:', url); // Log the URL being fetched
      setLoading(true);
      const response = await axios.get(url);
      console.log('API Response:', response.data); // Log the response data
      const data = response.data;
      localStorage.setItem('apiResponse', JSON.stringify(data));
      setData(data.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') return;
    const url = `${baseURL}/search?query=${searchTerm}`;
    fetchData(url);
  };

  return (
    <div className="result-page">
      <div className="result-page-left">
        <div className="Get-top-5">Hiring Compass</div>
        <div className="answer-text"></div>
      </div>
      <div className="result-page-right">
        <div className="search-bar">
          <input
            type="text"
            id="query-input"
            className="input-fields"
            placeholder="Search the Talent..."
            aria-label="Recipient's username"
            aria-describedby="button-addon2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button id="search-button" className="image-send" onClick={handleSearch}>
            <img src={send} height="20px" width="20px" className="send" alt="Send" />
          </button>
        </div>
        <div id="profiles-container">
          {loading ? (
            <div>Loading...</div>
          ) : data && data.length ? (
              data.map((profile, index) => (
                <div key={index} className="Result">
                  <div className="candidate-one">
                    <header>
                      <div className="profile-pic-section">
                        <div className="name-position-section">
                          <div className="candidate-name">{profile.Name}</div>
                          <div className="position">{profile.Position}</div>
                        </div>
                      </div>
                      <div className="recommended">Recommended {Math.floor((100 - profile.score * 100).toFixed(2))}%</div>
                    </header>
                    <div className="body-container">
                      <div className="pi-left">
                        <div className="current">
                          <div className="key">Current</div>
                          <div className="value">
                            <div className="line-one">
                              <div className="nested-line-one">
                                <div className="current-position">{profile.Position}</div>
                                <div className="Current-Company">{profile.Company}</div>
                              </div>
                              <div className="nested-line-one">
                                <div className="current-date">Jul 23 - Current</div>
                                <div className="current-location">Pune</div>
                              </div>
                            </div>
                            <div className="line-3 position-description">
                              {(profile.WorkEx.length > 350 ? profile.WorkEx.slice(0, 350) + '...' : profile.WorkEx).split('-').join('\n')}
                            </div>
                          </div>
                        </div>
                        <div className="Education">
                          <div className="key">Education</div>
                          <div className="value">
                            <div className="line-one">
                              <div className="nested-line-one">
                                <div className="current-position">Student</div>
                                <div className="Current-Company">College</div>
                              </div>
                              <div className="nested-line-one">
                                <div className="current-date">Jul 23 - Current</div>
                                <div className="current-location">Pune</div>
                              </div>
                            </div>
                            <div className="line-3 position-description">{profile.Education}</div>
                          </div>
                        </div>
                        <div className="preferred-location">
                          <div className="key">Preferred Location</div>
                          <div className="value">
                            <div className="value-location">
                              {profile.PreferredLocation?.map((location, index) => (
                                <div key={index} className="location">
                                  <img src="images/Icon.png" alt="Location Icon" />
                                  <div className="city-name">{location}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="key-skills">
                          <div className="key">Key Skills</div>
                          <ul className="lists">
                            <li>{profile.PrimarySkills.length > 100 ? profile.PrimarySkills.slice(0, 100) + '...' : profile.PrimarySkills}</li>
                          </ul>
                        </div>
                      </div>
                      <div className="pi-right">
                        <div className="Buttons">
                          <a href={profile.Resume_Link} target="_blank" rel="noopener noreferrer">
                            <button className="Download">Resume <span><img className="down_img" src="images/down.png" height="20px" width="20px" alt="Download" /></span></button>
                          </a>
                        </div>
                        <div className="contacts-information">
                          <div className="info-1 info">
                            <div className="key-info">
                              <div className="key-image"><img height="20px" width="20px" src="images/exp.jpeg" alt="Experience" /></div>
                              <div className="key-text">Experience</div>
                            </div>
                            <div className="info-value">: 5 Years</div>
                          </div>
                          <div className="info-2 info">
                            <div className="key-info">
                              <div className="key-image"><img height="20px" width="20px" src="images/status.jpeg" alt="Current Status" /></div>
                              <div className="key-text">Current Status</div>
                            </div>
                            <div className="info-value">: Actively Looking for job</div>
                          </div>
                          <div className="info-3 info">
                            <div className="key-info">
                              <div className="key-image"><img height="20px" width="15px" src="images/Icon (1).png" alt="Relocation" /></div>
                              <div className="key-text">Relocation</div>
                            </div>
                            <div className="info-value">: Pune</div>
                          </div>
                          <div className="info-4 info">
                            <div className="key-info">
                              <div className="key-image"><img height="20px" width="20px" src="images/notice.png" alt="Notice Period" /></div>
                              <div className="key-text">Notice Period</div>
                            </div>
                            <div className="info-value">: 30 Days</div>
                          </div>
                          <div className="info-5 info">
                            <div className="key-info">
                              <div className="key-image"><img height="20px" width="20px" src="images/email.png" alt="Email" /></div>
                              <div className="key-text">Email</div>
                            </div>
                            <div className="info-value">: {profile.email.replace("example.com", "gmail.com").toLowerCase().replace(" ", "")}</div>
                          </div>
                          <div className="info-6 info">
                            <div className="key-info">
                              <div className="key-image"><img height="20px" width="20px" src="images/phone.png" alt="Phone" /></div>
                              <div className="key-text">Phone</div>
                            </div>
                            <div className="info-value">: {profile.phone_number}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <footer></footer>
                  </div>
                </div>
              ))
            ) : (
              <div>No results found.</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;