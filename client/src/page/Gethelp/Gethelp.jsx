import { useState, useEffect } from 'react';
import Header from "../../components/Header/Header.jsx";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import './GetHelp.css';
import studentService from '../../services/studentService.js';
import helpRequestService from '../../services/helpRequestService.js';

const defaultStudent = { points: 0, streak: 0 };

const GetHelp = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [showCounselors, setShowCounselors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(defaultStudent);
  const [currentUser, setCurrentUser] = useState(null);

  // بيانات المدارس والمستشارات
  const schoolCounselors = {
    'alsalam-arara': [
      { name: 'Layla Hassan', role: 'School Counselor', contact: 'layla.hassan@school.edu', emoji: '👩‍🏫' },
      { name: 'Fatima Mahmoud', role: 'Social Worker', contact: 'fatima.m@school.edu', emoji: '👩‍⚕️' },
      { name: 'Sara Ahmed', role: 'Student Support Coordinator', contact: 'sara.ahmed@school.edu', emoji: '👩‍💼' }
    ],
    'alnoor-haifa': [
      { name: 'Amira Khalil', role: 'School Counselor', contact: 'amira.k@school.edu', emoji: '👩‍🏫' },
      { name: 'Rania Said', role: 'Mental Health Specialist', contact: 'rania.s@school.edu', emoji: '👩‍⚕️' }
    ],
    'alhikma-nazareth': [
      { name: 'Dina Omar', role: 'School Counselor', contact: 'dina.omar@school.edu', emoji: '👩‍🏫' },
      { name: 'Mona Youssef', role: 'Student Advisor', contact: 'mona.y@school.edu', emoji: '👩‍💼' },
      { name: 'Hana Ali', role: 'Crisis Counselor', contact: 'hana.ali@school.edu', emoji: '👩‍⚕️' }
    ],
    'alqasemi-baqa': [
      { name: 'Nour Mansour', role: 'School Counselor', contact: 'nour.m@school.edu', emoji: '👩‍🏫' },
      { name: 'Aisha Ibrahim', role: 'Social Worker', contact: 'aisha.i@school.edu', emoji: '👩‍⚕️' }
    ],
    'alkhorazmi-umm': [
      { name: 'Salma Haddad', role: 'School Counselor', contact: 'salma.h@school.edu', emoji: '👩‍🏫' },
      { name: 'Mariam Nasser', role: 'Student Support Specialist', contact: 'mariam.n@school.edu', emoji: '👩‍💼' }
    ]
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setSelectedSchool('');
    setShowCounselors(false);
  };

  const handleSchoolSelect = (e) => {
    const school = e.target.value;
    setSelectedSchool(school);
    
    if (school) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowCounselors(true);
      }, 800);
    } else {
      setShowCounselors(false);
    }
  };

  // Load student data on mount
  useEffect(() => {
    const loadStudent = async () => {
      try {
        const studentData = await studentService.getCurrentStudent();
        if (studentData) {
          setStudent({
            points: studentData.points || 0,
            streak: studentData.streak || 0
          });
          setCurrentUser({
            id: studentData.id || studentData._id,
            full_name: studentData.full_name || studentData.name,
            username: studentData.username
          });
        }
      } catch (error) {
        console.error('Error loading student:', error);
      }
    };
    loadStudent();
  }, []);

  // Handle contact with counselor or organization
  const handleContact = async (contactType, counselorName = null, counselorContact = null, organizationName = null, schoolName = null) => {
    if (!currentUser || !currentUser.id) {
      alert('Please sign in to contact support');
      return;
    }

    try {
      const helpRequestData = {
        userId: currentUser.id,
        studentName: currentUser.full_name,
        studentUsername: currentUser.username,
        contactType: contactType, // 'school', 'national', or 'counselor'
        schoolName: schoolName || (contactType === 'school' ? selectedSchool : null),
        counselorName: counselorName || null,
        counselorContact: counselorContact || null,
        organizationName: organizationName || null,
        message: `Student requested contact with ${counselorName || organizationName || 'support'}`
      };

      await helpRequestService.createHelpRequest(helpRequestData);
      
      // Open email client
      if (counselorContact) {
        // eslint-disable-next-line react-hooks/immutability
        window.location.href = `mailto:${counselorContact}`;
      }
    } catch (error) {
      console.error('Error creating help request:', error);
      // Still open email even if save fails
      if (counselorContact) {
        // eslint-disable-next-line react-hooks/immutability
        window.location.href = `mailto:${counselorContact}`;
      }
    }
  };

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '80px' }}>
      <Header points={student.points} streak={student.streak} />
      
      {/* Animated Background */}
      <div className="background-wrapper">
        <div className="gradient-overlay"></div>
        <div className="floating-orb orb-pink"></div>
        <div className="floating-orb orb-purple"></div>
        <div className="floating-orb orb-blue"></div>
      </div>
      
      {/* Get Help Section */}
      <div className="get-help-section">
        <div className="get-help-container">
          <header className="header">
            <h1> Get Support & Help 💝</h1>
            <p className="subtitle">
              You&apos;re not alone. Choose how you&apos;d like to get help - from your school or from trusted organizations.
            </p>
          </header>

          {/* خيارات الدعم الرئيسية */}
          <div className="options-section">
            <h2 className="section-title">Where would you like to get help?</h2>
            
            <div className="options-grid">
              <button 
                className={`option-card ${selectedOption === 'school' ? 'active' : ''}`}
                onClick={() => handleOptionSelect('school')}
              >
                <div className="option-icon">🏫</div>
                <h3>My School</h3>
                <p>Connect with counselors at your school</p>
              </button>

              <button 
                className={`option-card ${selectedOption === 'external' ? 'active' : ''}`}
                onClick={() => handleOptionSelect('external')}
              >
                <div className="option-icon">🌟</div>
                <h3>Outside My School</h3>
                <p>Get help from national support services</p>
              </button>
            </div>
          </div>

          {/* قسم المدرسة */}
          {selectedOption === 'school' && (
            <div className="content-section school-section">
              <div className="school-card">
                <div className="card-header">
                  <div className="card-icon">🏫</div>
                  <div>
                    <h2>Your School Support</h2>
                    <p className="card-description">
                      Connect with trusted counselors and support staff at your school who are here to help you.
                    </p>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="school-select">Select Your School</label>
                  <select 
                    id="school-select" 
                    value={selectedSchool}
                    onChange={handleSchoolSelect}
                  >
                    <option value="">Choose your school...</option>
                    <option value="alsalam-arara">Al-Salam School, Ar&apos;ara</option>
                    <option value="alnoor-haifa">Al-Noor High School, Haifa</option>
                    <option value="alhikma-nazareth">Al-Hikma School, Nazareth</option>
                    <option value="alqasemi-baqa">Al-Qasemi School, Baqa al-Gharbiyye</option>
                    <option value="alkhorazmi-umm">Al-Khorazmi School, Umm al-Fahm</option>
                  </select>
                </div>

                {loading && (
                  <div className="loading">
                    <div className="spinner"></div>
                    <p>Finding your school counselors...</p>
                  </div>
                )}

                {showCounselors && selectedSchool && (
                  <div className="counselors-section">
                    <h3>Available Counselors</h3>
                    <div className="counselors-list">
                      {schoolCounselors[selectedSchool].map((counselor, index) => (
                        <div key={index} className="counselor-card">
                          <div className="counselor-avatar">{counselor.emoji}</div>
                          <div className="counselor-info">
                            <div className="counselor-name">{counselor.name}</div>
                            <div className="counselor-role">{counselor.role}</div>
                          </div>
                          <button 
                            className="contact-btn"
                            onClick={() => handleContact('school', counselor.name, counselor.contact, null, selectedSchool)}
                          >
                            Contact
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* قسم الخدمات الخارجية */}
          {selectedOption === 'external' && (
            <div className="content-section external-section">
              <div className="resources-card">
                <div className="card-header">
                  <div className="card-icon">🌟</div>
                  <div>
                    <h2>National Support Services</h2>
                    <p className="card-description">
                      Professional help is available 24/7 through these trusted organizations.
                    </p>
                  </div>
                </div>

                <div className="resources-list">
                  <div className="resource-item">
                    <div className="resource-icon">🚨</div>
                    <div className="resource-content">
                      <div className="resource-title">Police Emergency</div>
                      <div className="resource-description">
                        For immediate danger or serious threats
                      </div>
                      <div className="resource-contact">
                        <button 
                          className="emergency-badge"
                          onClick={() => handleContact('national', null, null, 'Police Emergency', null)}
                        >
                          📞 Call 100
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="resource-item">
                    <div className="resource-icon">💙</div>
                    <div className="resource-content">
                      <div className="resource-title">Cyber Safety Helpline</div>
                      <div className="resource-description">
                        Specialized support for online harassment, cyberbullying, and digital threats
                      </div>
                      <div className="resource-contact">
                        <button 
                          className="info-badge"
                          onClick={() => handleContact('national', null, null, 'Cyber Safety Helpline', null)}
                        >
                          📞 Call 105
                        </button>
                        <span className="info-badge">💬 Available 24/7</span>
                      </div>
                    </div>
                  </div>

                  <div className="resource-item">
                    <div className="resource-icon">🤝</div>
                    <div className="resource-content">
                      <div className="resource-title">Women&apos;s Support Center</div>
                      <div className="resource-description">
                        Confidential counseling and legal support for harassment cases
                      </div>
                      <div className="resource-contact">
                        <button 
                          className="info-badge"
                          onClick={() => handleContact('national', null, null, 'Women\'s Support Center', null)}
                        >
                          📞 1-800-220-000
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="resource-item">
                    <div className="resource-icon">🌈</div>
                    <div className="resource-content">
                      <div className="resource-title">Youth Crisis Line</div>
                      <div className="resource-description">
                        Emotional support and guidance for young people
                      </div>
                      <div className="resource-contact">
                        <button 
                          className="info-badge"
                          onClick={() => handleContact('national', null, null, 'Youth Crisis Line', null)}
                        >
                          📞 Call *1201
                        </button>
                        <span className="info-badge">💬 Anonymous</span>
                      </div>
                    </div>
                  </div>

                  <div className="resource-item">
                    <div className="resource-icon">💻</div>
                    <div className="resource-content">
                      <div className="resource-title">Online Safety Organizations</div>
                      <div className="resource-description">
                        Professional guidance for digital safety and protection
                      </div>
                      <div className="resource-contact">
                        <button 
                          className="info-badge"
                          onClick={() => handleContact('national', null, null, 'Online Safety Organizations', null)}
                        >
                          🌐 Online Support
                        </button>
                        <button 
                          className="info-badge"
                          onClick={() => handleContact('national', null, null, 'Online Safety Organizations', null)}
                        >
                          📧 Email Support
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* رسالة الدعم */}
          <div className="support-banner">
            <h3>Remember: It&apos;s Not Your Fault</h3>
            <p>
              Whatever you&apos;re experiencing, it&apos;s important to know that it&apos;s not your fault. 
              You deserve to feel safe online and offline. Reaching out for help is a sign of 
              strength, not weakness.
            </p>
            <button className="support-btn">💬 Start Confidential Chat</button>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default GetHelp;