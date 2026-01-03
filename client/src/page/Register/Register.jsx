import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';
import api from '../../services/api.js';
import studentService from '../../services/studentService.js';
import './Register.css';

const REGIONS = ['North', 'Haifa', 'Center', 'Tel Aviv', 'Jerusalem', 'South', 'Negev'];

export default function Register() {
  const navigate = useNavigate();
  const [panelActive, setPanelActive] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [contactMethod, setContactMethod] = useState('email');
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('besafe_language') || 'en');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({
    full_name: '',
    username: '',
    id_number: '',
    region: '',
    school_name: '',
    grade_level: '',
    password: '',
    confirm_password: '',
    email: '',
    phone: ''
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^05\d{8}$/.test(phone.replace(/[-\s]/g, ''));
  const validateIDNumber = (id) => /^\d{9}$/.test(id.replace(/[-\s]/g, ''));

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!loginData.username.trim()) newErrors.username = 'Student name is required';
    if (!loginData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await api.post('/students/signin', {
        emailOrPhone: loginData.username,
        password: loginData.password
      });

      if (response.data.success) {
        const student = response.data.data.student;
        studentService.saveStudentToLocal(student);
        if (response.data.data.token) {
          localStorage.setItem('besafe_token', response.data.data.token);
        }
        localStorage.setItem('besafe_returning_user', 'true');
        await studentService.updateDailyStreak();
        navigate('/homepage');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 404) {
        setErrors({ general: 'User not found. Please sign up first.' });
      } else if (error.response?.status === 401) {
        setErrors({ password: 'Incorrect password' });
      } else {
        setErrors({ general: error.response?.data?.message || 'An error occurred. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (step < 3) {
      if (validateStep(step)) {
        setStep(step + 1);
        setErrors({});
      }
      return;
    }

    // Final step - submit
    const newErrors = {};
    if (!signupData.password.trim()) newErrors.password = 'Password is required';
    else if (signupData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!signupData.confirm_password.trim()) newErrors.confirm_password = 'Please confirm your password';
    else if (signupData.password !== signupData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }
    
    if (contactMethod === 'email') {
      if (!signupData.email.trim()) newErrors.email = 'Email is required';
      else if (!validateEmail(signupData.email)) newErrors.email = 'Invalid email format';
    } else {
      if (!signupData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!validatePhone(signupData.phone)) newErrors.phone = 'Phone must start with 05 and be 10 digits';
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const signUpPayload = {
        full_name: signupData.full_name,
        username: signupData.username,
        password: signupData.password,
        grade_level: signupData.grade_level,
        region: signupData.region,
        school_name: signupData.school_name,
        id_number: signupData.id_number
      };

      if (contactMethod === 'email') {
        signUpPayload.email = signupData.email;
      } else {
        signUpPayload.phone = signupData.phone;
      }

      console.log('Signup payload:', signUpPayload);
      console.log('API base URL:', api.defaults.baseURL);
      console.log('Full URL will be:', `${api.defaults.baseURL}/students/signup`);
      const response = await api.post('/students/signup', signUpPayload);
      console.log('Signup response:', response.data);

      if (response.data.success) {
        const student = response.data.data.student;
        studentService.saveStudentToLocal(student);
        if (response.data.data.token) {
          localStorage.setItem('besafe_token', response.data.data.token);
        }
        localStorage.setItem('besafe_new_user', 'true');
        localStorage.setItem('besafe_new_username', student.username || student.full_name || '');
        await studentService.updateDailyStreak();
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response);
      console.error('Error request URL:', error.config?.url);
      console.error('Full error:', error);
      
      if (error.response?.status === 404) {
        setErrors({ general: 'Server endpoint not found. Please make sure the server is running on port 5000.' });
      } else if (error.response?.status === 409) {
        const field = error.response.data.message.includes('Username') ? 'username' : 
                     error.response.data.message.includes('Email') ? 'email' : 'phone';
        setErrors({ [field]: error.response.data.message });
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (error.response?.status) {
        setErrors({ general: `Error ${error.response.status}. Please check your information and try again.` });
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network')) {
        setErrors({ general: 'Unable to connect to server. Please make sure the server is running on http://localhost:5000' });
      } else {
        setErrors({ general: 'Unable to connect. Please check your internet connection and try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (stepNum) => {
    const newErrors = {};
    if (stepNum === 1) {
      if (!signupData.full_name.trim()) newErrors.full_name = 'Student name is required';
      if (!signupData.username.trim()) newErrors.username = 'Username is required';
      if (!signupData.id_number.trim()) newErrors.id_number = 'ID number is required';
      else if (!validateIDNumber(signupData.id_number)) newErrors.id_number = 'ID number must be 9 digits';
    }
    if (stepNum === 2) {
      if (!signupData.region) newErrors.region = 'Region is required';
      if (!signupData.school_name.trim()) newErrors.school_name = 'School name is required';
      if (!signupData.grade_level) newErrors.grade_level = 'Grade level is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateLoginField = (field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const updateSignupField = (field, value) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const nextStep = () => { 
    if (validateStep(step)) {
      setStep(step + 1);
      setErrors({});
    }
  };
  
  const prevStep = () => { 
    if (step > 1) { 
      setStep(step - 1); 
      setErrors({}); 
    } 
  };

  const handleLanguageChange = (newLang) => {
    setCurrentLang(newLang);
    localStorage.setItem('besafe_language', newLang);
    document.documentElement.dir = newLang === 'he' || newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="register-page-wrapper">
      <div className={`auth-wrapper ${panelActive ? 'panel-active' : ''}`} id="authWrapper">
        {/* Register Form Box */}
        <div className="auth-form-box register-form-box">
          <form onSubmit={handleSignup}>
            <h1>Create Account</h1>
            
            <div className="social-links">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Google">G</a>
              <a href="#" aria-label="LinkedIn">in</a>
            </div>
            
            {/* Step Indicator */}
            <div className="step-indicator">
              <div className={`step ${step > 1 ? 'completed' : step === 1 ? 'active' : ''}`}>
                {step > 1 ? '✓' : '1'}
              </div>
              <div className={`step ${step > 2 ? 'completed' : step === 2 ? 'active' : ''}`}>
                {step > 2 ? '✓' : '2'}
              </div>
              <div className={`step ${step === 3 ? 'active' : ''}`}>3</div>
            </div>
            
            {/* Step 1: Name, Username, ID Number */}
            {step === 1 && (
              <>
                <input
                  type="text"
                  placeholder="Student Name"
                  value={signupData.full_name}
                  onChange={(e) => updateSignupField('full_name', e.target.value)}
                  className={errors.full_name ? 'error' : ''}
                  required
                />
                {errors.full_name && <span className="error-text">{errors.full_name}</span>}
                
                <input
                  type="text"
                  placeholder="Username"
                  value={signupData.username}
                  onChange={(e) => updateSignupField('username', e.target.value)}
                  className={errors.username ? 'error' : ''}
                  required
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
                
                <input
                  type="text"
                  placeholder="ID Number (9 digits)"
                  value={signupData.id_number}
                  onChange={(e) => updateSignupField('id_number', e.target.value)}
                  maxLength={9}
                  className={errors.id_number ? 'error' : ''}
                  required
                />
                {errors.id_number && <span className="error-text">{errors.id_number}</span>}
              </>
            )}

            {/* Step 2: Region, School Name, Grade Level */}
            {step === 2 && (
              <>
                <select
                  value={signupData.region}
                  onChange={(e) => updateSignupField('region', e.target.value)}
                  className={errors.region ? 'error' : ''}
                  required
                >
                  <option value="">Select Region/City</option>
                  {REGIONS.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                {errors.region && <span className="error-text">{errors.region}</span>}
                
                <input
                  type="text"
                  placeholder="School Name"
                  value={signupData.school_name}
                  onChange={(e) => updateSignupField('school_name', e.target.value)}
                  className={errors.school_name ? 'error' : ''}
                  required
                />
                {errors.school_name && <span className="error-text">{errors.school_name}</span>}
                
                <div className="grade-level-toggle">
                  <button
                    type="button"
                    className={`toggle-option ${signupData.grade_level === 'middle' ? 'active' : ''}`}
                    onClick={() => updateSignupField('grade_level', 'middle')}
                  >
                    Middle School
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${signupData.grade_level === 'high' ? 'active' : ''}`}
                    onClick={() => updateSignupField('grade_level', 'high')}
                  >
                    High School
                  </button>
                </div>
                {errors.grade_level && <span className="error-text">{errors.grade_level}</span>}
              </>
            )}

            {/* Step 3: Password, Confirm Password, Email/Phone */}
            {step === 3 && (
              <>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={signupData.password}
                    onChange={(e) => updateSignupField('password', e.target.value)}
                    className={errors.password ? 'error' : ''}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}

                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={signupData.confirm_password}
                    onChange={(e) => updateSignupField('confirm_password', e.target.value)}
                    className={errors.confirm_password ? 'error' : ''}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirm_password && <span className="error-text">{errors.confirm_password}</span>}

                <span className="or-text">or use your email for registration</span>

                {/* Contact Method Toggle */}
                <div className="contact-method-toggle">
                  <button
                    type="button"
                    className={`toggle-option ${contactMethod === 'email' ? 'active' : ''}`}
                    onClick={() => {
                      setContactMethod('email');
                      setErrors(prev => ({ ...prev, email: '', phone: '' }));
                    }}
                  >
                    <Mail size={16} /> Email
                  </button>
                  <button
                    type="button"
                    className={`toggle-option ${contactMethod === 'phone' ? 'active' : ''}`}
                    onClick={() => {
                      setContactMethod('phone');
                      setErrors(prev => ({ ...prev, email: '', phone: '' }));
                    }}
                  >
                    <Phone size={16} /> Phone
                  </button>
                </div>

                {/* Email or Phone Input */}
                {contactMethod === 'email' ? (
                  <>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={signupData.email}
                      onChange={(e) => updateSignupField('email', e.target.value)}
                      className={errors.email ? 'error' : ''}
                      required
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </>
                ) : (
                  <>
                    <input
                      type="tel"
                      placeholder="Phone Number (05X-XXXXXXX)"
                      value={signupData.phone}
                      onChange={(e) => updateSignupField('phone', e.target.value)}
                      className={errors.phone ? 'error' : ''}
                      required
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </>
                )}
              </>
            )}

            {errors.general && (
              <div className="error-alert">
                <AlertCircle size={16} /> {errors.general}
              </div>
            )}

            <div className="form-actions-signup">
              {step > 1 && (
                <button type="button" onClick={prevStep} className="back-button">
                  Back
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={nextStep} className="next-button">
                  Next
                </button>
              ) : (
                <button type="submit" className="next-button" disabled={loading}>
                  {loading ? <Sparkles className="spinner" /> : 'Sign Up'}
                </button>
              )}
            </div>
            
            <div className="mobile-switch">
              <p>Already have an account?</p>
              <button type="button" id="mobileLoginBtn" onClick={() => setPanelActive(false)}>
                Sign In
              </button>
            </div>
          </form>
        </div>

        {/* Login Form Box */}
        <div className="auth-form-box login-form-box">
          <form onSubmit={handleLogin}>
            <h1>Sign In</h1>
            
            <div className="social-links">
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Google">G</a>
              <a href="#" aria-label="LinkedIn">in</a>
            </div>
            
            <span>or use your account</span>
            
            <input
              type="text"
              placeholder="Username, Email, or Phone"
              value={loginData.username}
              onChange={(e) => updateLoginField('username', e.target.value)}
              className={errors.username ? 'error' : ''}
              required
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
            
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => updateLoginField('password', e.target.value)}
                className={errors.password ? 'error' : ''}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
            
            <a href="#" className="forgot-password">Forgot your password?</a>
            
            {errors.general && (
              <div className="error-alert">
                <AlertCircle size={16} /> {errors.general}
              </div>
            )}
            
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? <Sparkles className="spinner" /> : 'Sign In'}
            </button>
            
            <div className="mobile-switch">
              <p>Don&apos;t have an account?</p>
              <button type="button" id="mobileRegisterBtn" onClick={() => setPanelActive(true)}>
                Sign Up
              </button>
            </div>
          </form>
        </div>

        {/* Slide Panel */}
        <div className="slide-panel-wrapper">
          <div className="slide-panel">
            <div className="panel-content panel-content-left">
              <h2>Welcome Back!</h2>
              <p>Stay connected by logging in with your credentials and continue your experience</p>
              <button className="transparent-btn" onClick={() => setPanelActive(false)}>
                Sign In
              </button>
            </div>
            
            <div className="panel-content panel-content-right">
              <h2>Hey There!</h2>
              <p>Begin your amazing journey by creating an account with us today</p>
              <button className="transparent-btn" onClick={() => setPanelActive(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="success-modal-overlay" onClick={() => navigate('/homepage')}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <div className="success-icon">✓</div>
            <h2>Account Created Successfully!</h2>
            <p>Your account has been created successfully. Welcome to our community!</p>
          </div>
        </div>
      )}
    </div>
  );
}
