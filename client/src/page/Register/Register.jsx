import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, IdCard, Sparkles, ArrowRight, Shield, Mail, Phone, CheckCircle2, AlertCircle, Lock, Eye, EyeOff, UserCircle, GraduationCap, School } from 'lucide-react';
import './Register.css';

const REGIONS = ['North', 'Haifa', 'Center', 'Tel Aviv', 'Jerusalem', 'South', 'Negev'];
const GRADE_LEVELS = [
  { value: 'middle', label: 'Middle School' },
  { value: 'high', label: 'High School' }
];

const mockUsers = [
  { email: 'test@example.com', phone: '0501234567', password: '123456', name: 'Test User', username: 'testuser' },
  { email: 'user@gmail.com', phone: '0509876543', password: 'password', name: 'Demo User', username: 'demouser' }
];

export default function Register() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [contactMethod, setContactMethod] = useState('email'); // 'email' or 'phone'
  
  const [signInData, setSignInData] = useState({ emailOrPhone: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    full_name: '', username: '', grade_level: '', region: '', school_name: '', id_number: '',
    password: '', confirmPassword: '', email: '', phone: ''
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^05\d{8}$/.test(phone.replace(/[-\s]/g, ''));
  const validateIDNumber = (id) => /^\d{9}$/.test(id.replace(/[-\s]/g, ''));
  const validateUsername = (username) => /^[a-zA-Z0-9_]{3,20}$/.test(username);
  const checkUserExists = (emailOrPhone) => mockUsers.find(user => user.email === emailOrPhone || user.phone === emailOrPhone);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!signInData.emailOrPhone.trim()) newErrors.emailOrPhone = 'Email or phone number is required';
    if (!signInData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user = checkUserExists(signInData.emailOrPhone);
      if (user && user.password === signInData.password) {
        localStorage.setItem('besafe_student', JSON.stringify({
          name: user.name, username: user.username, email: user.email, phone: user.phone,
          points: 120, streak: 5, currentLevel: 2, completedLevels: 1
        }));
        navigate('/');
      } else if (user) {
        setErrors({ password: 'Incorrect password' });
      } else {
        setErrors({ emailOrPhone: 'User not found. Please sign up first.', general: 'notfound' });
      }
    } catch  {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const validateSignUpStep = (stepNum) => {
    const newErrors = {};
    if (stepNum === 1) {
      if (!signUpData.full_name.trim()) newErrors.full_name = 'Full name is required';
      if (!signUpData.username.trim()) newErrors.username = 'Username is required';
      else if (!validateUsername(signUpData.username)) newErrors.username = 'Username must be 3-20 characters (letters, numbers, underscore only)';
      if (!signUpData.grade_level) newErrors.grade_level = 'Grade level is required';
    }
    if (stepNum === 2) {
      if (!signUpData.region) newErrors.region = 'Region is required';
      if (!signUpData.school_name.trim()) newErrors.school_name = 'School name is required';
      if (!signUpData.id_number.trim()) newErrors.id_number = 'ID number is required';
      else if (!validateIDNumber(signUpData.id_number)) newErrors.id_number = 'ID number must be 9 digits';
    }
    if (stepNum === 3) {
      if (!signUpData.password.trim()) newErrors.password = 'Password is required';
      else if (signUpData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (signUpData.password !== signUpData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
      
      if (contactMethod === 'email') {
        if (!signUpData.email.trim()) newErrors.email = 'Email is required';
        else if (!validateEmail(signUpData.email)) newErrors.email = 'Invalid email format';
      } else {
        if (!signUpData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!validatePhone(signUpData.phone)) newErrors.phone = 'Phone must start with 05 and be 10 digits';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // إظهار رسالة النجاح مباشرة
    setErrors({ general: 'success' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newUser = {
        name: signUpData.full_name, username: signUpData.username, grade_level: signUpData.grade_level,
        email: signUpData.email, phone: signUpData.phone, id_number: signUpData.id_number, 
        region: signUpData.region, school_name: signUpData.school_name,
        points: 0, streak: 0, currentLevel: 1, completedLevels: 0
      };
      localStorage.setItem('besafe_student', JSON.stringify(newUser));
      mockUsers.push({ 
        email: signUpData.email, 
        phone: signUpData.phone, 
        password: signUpData.password, 
        name: signUpData.full_name, 
        username: signUpData.username 
      });
      
      setTimeout(() => navigate('/'), 5000);
    } catch {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const updateSignInField = (field, value) => {
    setSignInData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const updateSignUpField = (field, value) => {
    setSignUpData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const nextStep = () => { if (validateSignUpStep(step)) setStep(step + 1); };
  const prevStep = () => { if (step > 1) { setStep(step - 1); setErrors({}); } };
  
  const canProceedSignUp = () => {
    if (step === 1) return signUpData.full_name.trim() && signUpData.username.trim() && signUpData.grade_level;
    if (step === 2) return signUpData.region && signUpData.school_name.trim() && signUpData.id_number.trim();
    if (step === 3) {
      const hasPassword = signUpData.password.trim() && signUpData.confirmPassword.trim();
      const hasContact = contactMethod === 'email' ? signUpData.email.trim() : signUpData.phone.trim();
      return hasPassword && hasContact;
    }
    if (step === 4) return true;
    return false;
  };
  
  const switchMode = () => { setMode(mode === 'signin' ? 'signup' : 'signin'); setErrors({}); setStep(1); };

  return (
    <div className="register-container">
      <FloatingDecoration className="floating-decoration-1" duration={5} />
      <FloatingDecoration className="floating-decoration-2" duration={7} delay={2} />
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ width: '100%', maxWidth: '31rem' }}>  
          <Header />
        {mode === 'signup' && <ProgressSteps currentStep={step} totalSteps={4} />}
        <motion.div className="register-card" layout>
          <AnimatePresence mode="wait">
            {mode === 'signin' ? (
              <SignInForm key="signin" data={signInData} updateField={updateSignInField} errors={errors} loading={loading} onSubmit={handleSignIn} showPassword={showPassword} setShowPassword={setShowPassword} />
            ) : (
              <SignUpForm 
                key="signup" 
                step={step} 
                data={signUpData} 
                updateField={updateSignUpField} 
                errors={errors} 
                loading={loading} 
                onSubmit={handleSignUp} 
                showPassword={showPassword} 
                setShowPassword={setShowPassword} 
                nextStep={nextStep} 
                prevStep={prevStep} 
                canProceed={canProceedSignUp()}
                contactMethod={contactMethod}
                setContactMethod={setContactMethod}
              />
            )}
          </AnimatePresence>
          {errors.general !== 'success' && (
            <div className="register-switch">
              <p>{mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}</p>
              <button onClick={switchMode} className="register-switch-btn">{mode === 'signin' ? 'Sign Up' : 'Sign In'}</button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

function FloatingDecoration({ className, duration, delay = 0 }) {
  return <motion.div className={`floating-decoration ${className}`} animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration, repeat: Infinity, delay }} />;
}

FloatingDecoration.propTypes = {
  className: PropTypes.string,
  duration: PropTypes.number.isRequired,
  delay: PropTypes.number
};

function Header() {
  return (
    <motion.div className="register-header" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
      <motion.div className="register-logo" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <Shield style={{ width: '2rem', height: '2rem', color: 'white' }} />
      </motion.div>
      <h1 className="register-title">BeSafe</h1>
      <p className="register-subtitle">Your journey to online safety starts here ✨</p>
    </motion.div>
  );
}

function ProgressSteps({ currentStep, totalSteps }) {
  return (
    <div className="progress-steps">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
        <React.Fragment key={stepNum}>
          <motion.div className={`step-indicator ${stepNum === currentStep ? 'active' : stepNum < currentStep ? 'completed' : 'inactive'}`} animate={stepNum === currentStep ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.3 }}>
            {stepNum < currentStep ? '✓' : stepNum}
          </motion.div>
          {stepNum < totalSteps && <div className={`step-connector ${stepNum < currentStep ? 'completed' : 'inactive'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

ProgressSteps.propTypes = {
  currentStep: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired
};

function SignInForm({ data, updateField, errors, loading, onSubmit, showPassword, setShowPassword }) {
  return (
    <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} onSubmit={onSubmit} className="register-form">
      <div className="register-form-header">
        <h2 className="register-form-title">Welcome Back!</h2>
        <p className="register-form-subtitle">Sign in to continue your journey</p>
      </div>
      <div className="register-form-content">
        <FormField icon={Mail} iconColor="#E7B6D1" label="Email or Phone" value={data.emailOrPhone} onChange={(e) => updateField('emailOrPhone', e.target.value)} placeholder="Enter your email or phone number" focusClass="focus-pink" error={errors.emailOrPhone} />
        <PasswordField icon={Lock} iconColor="#C9B7E2" label="Password" value={data.password} onChange={(e) => updateField('password', e.target.value)} placeholder="Enter your password" focusClass="focus-purple" error={errors.password} showPassword={showPassword} setShowPassword={setShowPassword} />
        {errors.general === 'notfound' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="not-found-message">
            <AlertCircle style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Account not found</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.813rem' }}>Don&apos;t have an account yet? Sign up below to get started.</p>
            </div>
          </motion.div>
        )}
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary btn-full">
        {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Sparkles style={{ width: '1rem', height: '1rem' }} /></motion.div> : <></>}
        {!loading && <>Sign In <ArrowRight style={{ width: '0.875rem', height: '0.875rem', marginLeft: '0.5rem' }} /></>}
      </button>
    </motion.form>
  );
}

SignInForm.propTypes = {
  data: PropTypes.object.isRequired,
  updateField: PropTypes.func.isRequired,
  errors: PropTypes.object,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  showPassword: PropTypes.bool,
  setShowPassword: PropTypes.func
};

function SignUpForm({ step, data, updateField, errors, loading, onSubmit, showPassword, setShowPassword, nextStep, prevStep, canProceed, contactMethod, setContactMethod }) {
  return (
    <form onSubmit={onSubmit} className="register-form">
      <AnimatePresence mode="wait">
        {step === 1 && <SignUpStep1 data={data} updateField={updateField} errors={errors} />}
        {step === 2 && <SignUpStep2 data={data} updateField={updateField} errors={errors} />}
        {step === 3 && <SignUpStep3 data={data} updateField={updateField} errors={errors} showPassword={showPassword} setShowPassword={setShowPassword} contactMethod={contactMethod} setContactMethod={setContactMethod} />}
        {step === 4 && <SignUpStep4 data={data} errors={errors} />}
      </AnimatePresence>
      {errors.general !== 'success' && (
        <div className="button-group">
          {step > 1 && <button type="button" onClick={prevStep} disabled={loading} className="btn btn-back">Back</button>}
          {step < 4 ? (
            <button type="button" onClick={nextStep} disabled={!canProceed} className="btn btn-primary" style={{ flex: step === 1 ? 1 : undefined }}>
              Continue <ArrowRight style={{ width: '0.875rem', height: '0.875rem', marginLeft: '0.5rem' }} />
            </button>
          ) : (
            <button type="submit" disabled={!canProceed || loading} className="btn btn-success" style={{ flex: 1 }}>
              {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><Sparkles style={{ width: '1rem', height: '1rem' }} /></motion.div> : <>Create Account <Sparkles style={{ width: '0.875rem', height: '0.875rem', marginLeft: '0.5rem' }} /></>}
            </button>
          )}
        </div>
      )}
    </form>
  );
}

SignUpForm.propTypes = {
  step: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  updateField: PropTypes.func.isRequired,
  errors: PropTypes.object,
  loading: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
  showPassword: PropTypes.bool,
  setShowPassword: PropTypes.func,
  nextStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  canProceed: PropTypes.bool,
  contactMethod: PropTypes.string,
  setContactMethod: PropTypes.func
};

function SignUpStep1({ data, updateField, errors }) {
  return (
    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="register-form-section">
      <div className="register-form-header">
        <h2 className="register-form-title">Personal Information</h2>
        <p className="register-form-subtitle">Tell us about yourself</p>
      </div>
      <div className="register-form-content">
        <FormField icon={User} iconColor="#E7B6D1" label="Full Name" value={data.full_name} onChange={(e) => updateField('full_name', e.target.value)} placeholder="Enter your full name" focusClass="focus-pink" error={errors.full_name} />
        <FormField icon={UserCircle} iconColor="#C9B7E2" label="Username" value={data.username} onChange={(e) => updateField('username', e.target.value)} placeholder="Choose a unique username" focusClass="focus-purple" error={errors.username} />
        <div className="form-field">
          <label className="form-label"><GraduationCap style={{ width: '1.375rem', height: '1.375rem', color: '#CFE7F5' }} /> Grade Level</label>
          <div className="radio-group">
            {GRADE_LEVELS.map((level) => (
              <div key={level.value} className="radio-option">
                <input type="radio" id={`grade-${level.value}`} name="grade_level" value={level.value} checked={data.grade_level === level.value} onChange={(e) => updateField('grade_level', e.target.value)} />
                <label htmlFor={`grade-${level.value}`} className="radio-label">{level.label}</label>
              </div>
            ))}
          </div>
          {errors.grade_level && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="error-message"><AlertCircle style={{ width: '0.75rem', height: '0.75rem' }} /> {errors.grade_level}</motion.p>}
        </div>
      </div>
    </motion.div>
  );
}

SignUpStep1.propTypes = {
  data: PropTypes.object.isRequired,
  updateField: PropTypes.func.isRequired,
  errors: PropTypes.object
};

function SignUpStep2({ data, updateField, errors }) {
  return (
    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="register-form-section">
      <div className="register-form-header">
        <h2 className="register-form-title">Location Details</h2>
        <p className="register-form-subtitle">Where are you from?</p>
      </div>
      <div className="register-form-content">
        <div className="form-field">
          <label className="form-label"><MapPin style={{ width: '1.375rem', height: '1.375rem', color: '#E7B6D1' }} /> Region</label>
          <select value={data.region} onChange={(e) => updateField('region', e.target.value)} className={`select-trigger ${errors.region ? 'error' : ''}`}>
            <option value="">Select your region</option>
            {REGIONS.map((region) => <option key={region} value={region}>{region}</option>)}
          </select>
          {errors.region && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="error-message"><AlertCircle style={{ width: '0.75rem', height: '0.75rem' }} /> {errors.region}</motion.p>}
        </div>
        <FormField icon={School} iconColor="#CFE7F5" label="School Name" value={data.school_name} onChange={(e) => updateField('school_name', e.target.value)} placeholder="Enter your school name" focusClass="focus-blue" error={errors.school_name} />
        <FormField icon={IdCard} iconColor="#C9B7E2" label="ID Number" value={data.id_number} onChange={(e) => updateField('id_number', e.target.value)} placeholder="9 digits (e.g., 123456789)" focusClass="focus-purple" error={errors.id_number} maxLength={9} />
      </div>
    </motion.div>
  );
}

SignUpStep2.propTypes = {
  data: PropTypes.object.isRequired,
  updateField: PropTypes.func.isRequired,
  errors: PropTypes.object
};

function SignUpStep3({ data, updateField, errors, showPassword, setShowPassword, contactMethod, setContactMethod }) {
  return (
    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="register-form-section">
      <div className="register-form-header">
        <h2 className="register-form-title">Security & Contact</h2>
        <p className="register-form-subtitle">Secure your account</p>
      </div>
      <div className="register-form-content">
        <PasswordField icon={Lock} iconColor="#CFE7F5" label="Password" value={data.password} onChange={(e) => updateField('password', e.target.value)} placeholder="At least 6 characters" focusClass="focus-blue" error={errors.password} showPassword={showPassword} setShowPassword={setShowPassword} />
        <PasswordField icon={Lock} iconColor="#D8CFF0" label="Confirm Password" value={data.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} placeholder="Re-enter your password" focusClass="focus-lavender" error={errors.confirmPassword} showPassword={showPassword} setShowPassword={setShowPassword} />
        
        <div className="form-field">
          <label className="form-label">
            {contactMethod === 'email' ? <Mail style={{ width: '1.375rem', height: '1.375rem', color: '#E7B6D1' }} /> : <Phone style={{ width: '1.375rem', height: '1.375rem', color: '#C9B7E2' }} />}
            Contact Method
          </label>
          <div className="radio-group">
            <div className="radio-option">
              <input type="radio" id="contact-email" name="contact_method" value="email" checked={contactMethod === 'email'} onChange={(e) => setContactMethod(e.target.value)} />
              <label htmlFor="contact-email" className="radio-label">Email</label>
            </div>
            <div className="radio-option">
              <input type="radio" id="contact-phone" name="contact_method" value="phone" checked={contactMethod === 'phone'} onChange={(e) => setContactMethod(e.target.value)} />
              <label htmlFor="contact-phone" className="radio-label">Phone Number</label>
            </div>
          </div>
        </div>

        {contactMethod === 'email' ? (
          <FormField icon={Mail} iconColor="#E7B6D1" label="Email Address" value={data.email} onChange={(e) => updateField('email', e.target.value)} placeholder="example@email.com" focusClass="focus-pink" error={errors.email} type="email" />
        ) : (
          <FormField icon={Phone} iconColor="#C9B7E2" label="Phone Number" value={data.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="05X-XXXXXXXX" focusClass="focus-purple" error={errors.phone} type="tel" />
        )}
      </div>
    </motion.div>
  );
}

SignUpStep3.propTypes = {
  data: PropTypes.object.isRequired,
  updateField: PropTypes.func.isRequired,
  errors: PropTypes.object,
  showPassword: PropTypes.bool,
  setShowPassword: PropTypes.func,
  contactMethod: PropTypes.string,
  setContactMethod: PropTypes.func
};

function SignUpStep4({ data, errors }) {
  if (errors.general === 'success') {
    return (
      <motion.div 
        key="success" 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0, scale: 0.95 }} 
        transition={{ duration: 0.4 }} 
        className="register-form-section"
      >
        <div className="register-form-header">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }} 
            className="success-checkmark"
          >
            <CheckCircle2 style={{ width: '3.5rem', height: '3.5rem', color: 'white' }} />
          </motion.div>
          <h2 className="register-form-title" style={{ color: '#059669', fontSize: '2.25rem', marginTop: '1rem', fontWeight: 700 }}>
            Account Created Successfully! 🎉
          </h2>
          <p className="register-form-subtitle" style={{ fontSize: '1.25rem', marginTop: '0.75rem', color: '#059669', fontWeight: 600 }}>
            Welcome to BeSafe!
          </p>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }} 
          className="success-message-box"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem', padding: '0.625rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', fontSize: '1.25rem', color: '#065f46', fontWeight: 600 }}>
              <CheckCircle2 size={26} style={{ flexShrink: 0 }} />
              <span>Your account has been created</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', fontSize: '1.25rem', color: '#065f46', fontWeight: 600 }}>
              <CheckCircle2 size={26} style={{ flexShrink: 0 }} />
              <span>Profile saved successfully</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', fontSize: '1.25rem', color: '#065f46', fontWeight: 600 }}>
              <CheckCircle2 size={26} style={{ flexShrink: 0 }} />
              <span>Ready to start learning!</span>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5 }} 
          style={{ 
            marginTop: '1.75rem', 
            padding: '1.25rem', 
            background: 'linear-gradient(135deg, rgba(231, 182, 209, 0.12), rgba(201, 183, 226, 0.12))', 
            borderRadius: '0.875rem', 
            border: '2px solid rgba(201, 183, 226, 0.3)', 
            textAlign: 'center' 
          }}
        >
          <p style={{ margin: 0, fontSize: '1.125rem', color: '#6b7280', fontWeight: 600 }}>
            Redirecting to your dashboard...
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }} className="register-form-section">
      <div className="register-form-header">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="review-checkmark">
          <CheckCircle2 style={{ width: '1.75rem', height: '1.75rem', color: 'white' }} />
        </motion.div>
        <h2 className="register-form-title">Review Information</h2>
        <p className="register-form-subtitle">Confirm everything is correct</p>
      </div>
      <div className="review-container">
        <ReviewItem icon={User} label="Full Name" value={data.full_name} color="#E7B6D1" />
        <ReviewItem icon={UserCircle} label="Username" value={data.username} color="#C9B7E2" />
        <ReviewItem icon={GraduationCap} label="Grade Level" value={GRADE_LEVELS.find(g => g.value === data.grade_level)?.label || data.grade_level} color="#CFE7F5" />
        <ReviewItem icon={MapPin} label="Region" value={data.region} color="#D8CFF0" />
        <ReviewItem icon={School} label="School Name" value={data.school_name} color="#E7B6D1" />
        <ReviewItem icon={IdCard} label="ID Number" value={data.id_number} color="#C9B7E2" />
        <ReviewItem icon={Mail} label="Email" value={data.email || 'Not provided'} color="#CFE7F5" />
        <ReviewItem icon={Phone} label="Phone" value={data.phone || 'Not provided'} color="#D8CFF0" />
      </div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="review-notice">
        <AlertCircle style={{ width: '1rem', height: '1rem', marginTop: '0.125rem', flexShrink: 0 }} />
        <span>By creating an account, you agree to our terms and conditions.</span>
      </motion.div>
    </motion.div>
  );
}

SignUpStep4.propTypes = {
  data: PropTypes.object.isRequired,
  errors: PropTypes.object
};


function ReviewItem({ icon: Icon, label, value, color }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="review-item">
      <div className="review-icon" style={{ color }}><Icon style={{ width: '1rem', height: '1rem' }} /></div>
      <div style={{ flex: 1 }}><p className="review-label">{label}</p><p className="review-value">{value}</p></div>
    </motion.div>
  );
}

ReviewItem.propTypes = {
  icon: PropTypes.elementType.isRequired, // 'elementType' is used when passing a component like 'User' or 'MapPin'
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  color: PropTypes.string
};

function FormField({ icon: Icon, iconColor, label, value, onChange, placeholder, focusClass, error, type = "text", optional = false, maxLength }) {
  return (
    <div className="form-field">
      <label className="form-label"><Icon style={{ width: '1.375rem', height: '1.375rem', color: iconColor }} /> {label} {optional && <span className="form-label-optional">(Optional)</span>}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} maxLength={maxLength} className={`form-input ${focusClass} ${error ? 'error' : ''}`} />
      {error && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="error-message"><AlertCircle style={{ width: '0.875rem', height: '0.875rem' }} /> {error}</motion.p>}
    </div>
  );
}

FormField.propTypes = {
  icon: PropTypes.elementType.isRequired,
  iconColor: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  focusClass: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  optional: PropTypes.bool,
  maxLength: PropTypes.number
};

function PasswordField({ icon: Icon, iconColor, label, value, onChange, placeholder, focusClass, error, showPassword, setShowPassword }) {
  return (
    <div className="form-field">
      <label className="form-label"><Icon style={{ width: '1.375rem', height: '1.375rem', color: iconColor }} /> {label}</label>
      <div className="password-input-wrapper">
        <input type={showPassword ? "text" : "password"} value={value} onChange={onChange} placeholder={placeholder} className={`form-input ${focusClass} ${error ? 'error' : ''}`} style={{ paddingRight: '3.5rem' }} />
        <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
          {showPassword ? <EyeOff style={{ width: '1.375rem', height: '1.375rem', color: '#9ca3af' }} /> : <Eye style={{ width: '1.375rem', height: '1.375rem', color: '#9ca3af' }} />}
        </button>
      </div>
      {error && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="error-message"><AlertCircle style={{ width: '0.875rem', height: '0.875rem' }} /> {error}</motion.p>}
    </div>
  );
}

PasswordField.propTypes = {
  icon: PropTypes.elementType.isRequired,
  iconColor: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  focusClass: PropTypes.string,
  error: PropTypes.string,
  showPassword: PropTypes.bool.isRequired,
  setShowPassword: PropTypes.func.isRequired
};
