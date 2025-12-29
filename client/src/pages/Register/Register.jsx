import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, School, MapPin, IdCard, Sparkles, ArrowRight, Shield, Mail, Phone, CheckCircle2, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';

// Constants
const REGIONS = [
  'North', 'Haifa', 'Center', 'Tel Aviv', 'Jerusalem', 'South', 'Negev'
];

// Mock database - replace with real API in production
const mockUsers = [
  { email: 'test@example.com', phone: '0501234567', password: '123456', name: 'Test User' },
  { email: 'user@gmail.com', phone: '0509876543', password: 'password', name: 'Demo User' }
];

export default function Register() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  
  const [signInData, setSignInData] = useState({
    emailOrPhone: '',
    password: ''
  });

  const [signUpData, setSignUpData] = useState({
    full_name: '',
    id_number: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    school_name: '',
    region: ''
  });

  // Validation Functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^05\d{8}$/;
    const cleanPhone = phone.replace(/[-\s]/g, '');
    return phoneRegex.test(cleanPhone);
  };

  const validateIDNumber = (id) => {
    const cleanID = id.replace(/[-\s]/g, '');
    return /^\d{9}$/.test(cleanID);
  };

  const checkUserExists = (emailOrPhone) => {
    return mockUsers.find(user => 
      user.email === emailOrPhone || user.phone === emailOrPhone
    );
  };

  // Sign In Handler
  const handleSignIn = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!signInData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    }

    if (!signInData.password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user exists
      const user = checkUserExists(signInData.emailOrPhone);

      if (user && user.password === signInData.password) {
        // Successful login
        localStorage.setItem('currentUser', JSON.stringify({
          name: user.name,
          email: user.email,
          phone: user.phone,
          points: 120,
          streak: 5,
          currentLevel: 2,
          completedLevels: 1
        }));
        
        // Navigate to home page
        navigate('/');
      } else if (user && user.password !== signInData.password) {
        setErrors({ password: 'Incorrect password' });
      } else {
        // User doesn't exist - show error inline
        setErrors({ 
          emailOrPhone: 'User not found. Please sign up first.',
          general: 'notfound'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Validation
  const validateSignUpStep = (stepNum) => {
    const newErrors = {};

    if (stepNum === 1) {
      if (!signUpData.full_name.trim()) {
        newErrors.full_name = 'Full name is required';
      }
      if (!signUpData.id_number.trim()) {
        newErrors.id_number = 'ID number is required';
      } else if (!validateIDNumber(signUpData.id_number)) {
        newErrors.id_number = 'ID number must be 9 digits';
      }
    }

    if (stepNum === 2) {
      if (!signUpData.email.trim() && !signUpData.phone.trim()) {
        newErrors.contact = 'Email or phone number is required';
      }
      if (signUpData.email.trim() && !validateEmail(signUpData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (signUpData.phone.trim() && !validatePhone(signUpData.phone)) {
        newErrors.phone = 'Phone must start with 05 and be 10 digits';
      }
      if (!signUpData.password.trim()) {
        newErrors.password = 'Password is required';
      } else if (signUpData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (signUpData.password !== signUpData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (stepNum === 3) {
      if (!signUpData.school_name.trim()) {
        newErrors.school_name = 'School name is required';
      }
      if (!signUpData.region) {
        newErrors.region = 'Region is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Sign Up Submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save new user data
      const newUser = {
        name: signUpData.full_name,
        email: signUpData.email,
        phone: signUpData.phone,
        id_number: signUpData.id_number,
        school_name: signUpData.school_name,
        region: signUpData.region,
        points: 0,
        streak: 0,
        currentLevel: 1,
        completedLevels: 0
      };

      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(newUser));

      // Add to mock database (in production use API)
      mockUsers.push({
        email: signUpData.email,
        phone: signUpData.phone,
        password: signUpData.password,
        name: signUpData.full_name
      });

      // Show success message for 2 seconds then navigate
      setErrors({ general: 'success' });
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const updateSignInField = (field, value) => {
    setSignInData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateSignUpField = (field, value) => {
    setSignUpData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (field === 'email' || field === 'phone') {
      setErrors(prev => ({ ...prev, contact: '' }));
    }
  };

  const nextStep = () => {
    if (validateSignUpStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const canProceedSignUp = () => {
    if (step === 1) {
      return signUpData.full_name.trim() && signUpData.id_number.trim();
    }
    if (step === 2) {
      return (signUpData.email.trim() || signUpData.phone.trim()) && 
             signUpData.password.trim() && 
             signUpData.confirmPassword.trim();
    }
    if (step === 3) {
      return signUpData.school_name.trim() && signUpData.region;
    }
    if (step === 4) {
      return true; // في صفحة المراجعة، كل شي تمام
    }
    return false;
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setErrors({});
    setStep(1);
  };

  return (
    <div className="register-container">
      {/* Floating Decorations */}
      <FloatingDecoration className="floating-decoration-1" duration={5} />
      <FloatingDecoration className="floating-decoration-2" duration={7} delay={2} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '28rem' }}
      >
        {/* Header */}
        <Header />

        {/* Progress Steps (only for sign up) */}
        {mode === 'signup' && <ProgressSteps currentStep={step} totalSteps={4} />}

        {/* Register Card */}
        <motion.div className="register-card" layout>
          <AnimatePresence mode="wait">
            {mode === 'signin' ? (
              <SignInForm
                key="signin"
                data={signInData}
                updateField={updateSignInField}
                errors={errors}
                loading={loading}
                onSubmit={handleSignIn}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
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
              />
            )}
          </AnimatePresence>

          {/* Switch Mode Button */}
          <div className="register-switch">
            <p>
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button onClick={switchMode} className="register-switch-btn">
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ===== Sub-Components =====

function FloatingDecoration({ className, duration, delay = 0 }) {
  return (
    <motion.div
      className={`floating-decoration ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3]
      }}
      transition={{
        duration,
        repeat: Infinity,
        delay
      }}
    />
  );
}

function Header() {
  return (
    <motion.div
      className="register-header"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <motion.div
        className="register-logo"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Shield style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
      </motion.div>
      <h1 className="register-title">BeSafe Academy</h1>
      <p className="register-subtitle">Your journey to online safety starts here ✨</p>
    </motion.div>
  );
}

function ProgressSteps({ currentStep, totalSteps }) {
  return (
    <div className="progress-steps">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
        <React.Fragment key={stepNum}>
          <motion.div
            className={`step-indicator ${
              stepNum === currentStep ? 'active' : stepNum < currentStep ? 'completed' : 'inactive'
            }`}
            animate={stepNum === currentStep ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            {stepNum < currentStep ? '✓' : stepNum}
          </motion.div>
          {stepNum < totalSteps && (
            <div className={`step-connector ${stepNum < currentStep ? 'completed' : 'inactive'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function SignInForm({ data, updateField, errors, loading, onSubmit, showPassword, setShowPassword }) {
  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={onSubmit}
      className="register-form"
    >
      <div className="register-form-header">
        <h2 className="register-form-title">Welcome Back!</h2>
        <p className="register-form-subtitle">Sign in to continue your journey</p>
      </div>

      <div className="register-form-content">
        <FormField
          icon={Mail}
          iconColor="#E7B6D1"
          label="Email or Phone"
          value={data.emailOrPhone}
          onChange={(e) => updateField('emailOrPhone', e.target.value)}
          placeholder="Enter your email or phone number"
          focusClass="focus-pink"
          error={errors.emailOrPhone}
        />

        <PasswordField
          icon={Lock}
          iconColor="#C9B7E2"
          label="Password"
          value={data.password}
          onChange={(e) => updateField('password', e.target.value)}
          placeholder="Enter your password"
          focusClass="focus-purple"
          error={errors.password}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />

        {/* User Not Found Message */}
        {errors.general === 'notfound' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="not-found-message"
          >
            <AlertCircle style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Account not found</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.813rem' }}>
                Don't have an account yet? Sign up below to get started.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary btn-full"
      >
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles style={{ width: '1.25rem', height: '1.25rem' }} />
          </motion.div>
        ) : (
          <>
            Sign In
            <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
          </>
        )}
      </button>
    </motion.form>
  );
}

function SignUpForm({ step, data, updateField, errors, loading, onSubmit, showPassword, setShowPassword, nextStep, prevStep, canProceed }) {
  return (
    <form onSubmit={onSubmit} className="register-form">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <SignUpStep1 data={data} updateField={updateField} errors={errors} />
        )}

        {step === 2 && (
          <SignUpStep2 
            data={data} 
            updateField={updateField} 
            errors={errors}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        )}

        {step === 3 && (
          <SignUpStep3 data={data} updateField={updateField} errors={errors} />
        )}

        {step === 4 && (
          <SignUpStep4 data={data} errors={errors} />
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      {errors.general !== 'success' && (
        <div className="button-group">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              disabled={loading}
              className="btn btn-back"
            >
              Back
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canProceed}
              className="btn btn-primary"
              style={{ flex: step === 1 ? 1 : undefined }}
            >
              Continue
              <ArrowRight style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!canProceed || loading}
              className="btn btn-success"
              style={{ flex: 1 }}
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles style={{ width: '1.25rem', height: '1.25rem' }} />
                </motion.div>
              ) : (
                <>
                  Create Account
                  <Sparkles style={{ width: '1rem', height: '1rem', marginLeft: '0.5rem' }} />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </form>
  );
}

function SignUpStep1({ data, updateField, errors }) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="register-form-section"
    >
      <div className="register-form-header">
        <h2 className="register-form-title">Personal Information</h2>
        <p className="register-form-subtitle">Tell us about yourself</p>
      </div>

      <div className="register-form-content">
        <FormField
          icon={User}
          iconColor="#E7B6D1"
          label="Full Name"
          value={data.full_name}
          onChange={(e) => updateField('full_name', e.target.value)}
          placeholder="Enter your full name"
          focusClass="focus-pink"
          error={errors.full_name}
        />

        <FormField
          icon={IdCard}
          iconColor="#C9B7E2"
          label="ID Number"
          value={data.id_number}
          onChange={(e) => updateField('id_number', e.target.value)}
          placeholder="9 digits (e.g., 123456789)"
          focusClass="focus-purple"
          error={errors.id_number}
          maxLength={9}
        />
      </div>
    </motion.div>
  );
}

function SignUpStep2({ data, updateField, errors, showPassword, setShowPassword }) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="register-form-section"
    >
      <div className="register-form-header">
        <h2 className="register-form-title">Contact & Security</h2>
        <p className="register-form-subtitle">How can we reach you?</p>
        {errors.contact && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-message"
            style={{ justifyContent: 'center', marginTop: '0.5rem' }}
          >
            <AlertCircle style={{ width: '0.75rem', height: '0.75rem' }} />
            {errors.contact}
          </motion.p>
        )}
      </div>

      <div className="register-form-content">
        <FormField
          icon={Mail}
          iconColor="#CFE7F5"
          label="Email"
          value={data.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="example@email.com"
          focusClass="focus-blue"
          error={errors.email}
          type="email"
          optional
        />

        <div className="form-divider">
          <div className="form-divider-line"></div>
          <span className="form-divider-text">OR</span>
        </div>

        <FormField
          icon={Phone}
          iconColor="#D8CFF0"
          label="Phone Number"
          value={data.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          placeholder="05X-XXXXXXXX"
          focusClass="focus-lavender"
          error={errors.phone}
          type="tel"
          optional
        />

        <PasswordField
          icon={Lock}
          iconColor="#E7B6D1"
          label="Password"
          value={data.password}
          onChange={(e) => updateField('password', e.target.value)}
          placeholder="At least 6 characters"
          focusClass="focus-pink"
          error={errors.password}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />

        <PasswordField
          icon={Lock}
          iconColor="#C9B7E2"
          label="Confirm Password"
          value={data.confirmPassword}
          onChange={(e) => updateField('confirmPassword', e.target.value)}
          placeholder="Re-enter your password"
          focusClass="focus-purple"
          error={errors.confirmPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
      </div>
    </motion.div>
  );
}

function SignUpStep3({ data, updateField, errors }) {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="register-form-section"
    >
      <div className="register-form-header">
        <h2 className="register-form-title">School Information</h2>
        <p className="register-form-subtitle">Where do you study?</p>
      </div>

      <div className="register-form-content">
        <FormField
          icon={School}
          iconColor="#E7B6D1"
          label="School Name"
          value={data.school_name}
          onChange={(e) => updateField('school_name', e.target.value)}
          placeholder="Enter your school name"
          focusClass="focus-pink"
          error={errors.school_name}
        />

        <div className="form-field">
          <label className="form-label">
            <MapPin style={{ width: '1rem', height: '1rem', color: '#C9B7E2' }} />
            Region
          </label>
          <select
            value={data.region}
            onChange={(e) => updateField('region', e.target.value)}
            className={`select-trigger ${errors.region ? 'error' : ''}`}
          >
            <option value="">Select your region</option>
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.region && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="error-message"
            >
              <AlertCircle style={{ width: '0.75rem', height: '0.75rem' }} />
              {errors.region}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SignUpStep4({ data, errors }) {
  // If success message should be shown
  if (errors.general === 'success') {
    return (
      <motion.div
        key="success"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="register-form-section"
      >
        <div className="register-form-header">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="success-checkmark"
          >
            <CheckCircle2 style={{ width: '3rem', height: '3rem', color: 'white' }} />
          </motion.div>
          <h2 className="register-form-title" style={{ color: '#059669' }}>Account Created Successfully! 🎉</h2>
          <p className="register-form-subtitle">
            Welcome aboard! Redirecting you to your dashboard...
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="success-message-box"
        >
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#065f46', textAlign: 'center' }}>
            Your account has been created successfully. Get ready to start your online safety journey!
          </p>
        </motion.div>
      </motion.div>
    );
  }

  // Regular review step
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="register-form-section"
    >
      <div className="register-form-header">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="review-checkmark"
        >
          <CheckCircle2 style={{ width: '2rem', height: '2rem', color: 'white' }} />
        </motion.div>
        <h2 className="register-form-title">Review Your Information</h2>
        <p className="register-form-subtitle">Please confirm everything is correct</p>
      </div>

      <div className="review-container">
        <ReviewItem icon={User} label="Full Name" value={data.full_name} color="#E7B6D1" />
        <ReviewItem icon={IdCard} label="ID Number" value={data.id_number} color="#C9B7E2" />
        <ReviewItem icon={Mail} label="Email" value={data.email || 'Not provided'} color="#CFE7F5" />
        <ReviewItem icon={Phone} label="Phone" value={data.phone || 'Not provided'} color="#D8CFF0" />
        <ReviewItem icon={School} label="School" value={data.school_name} color="#E7B6D1" />
        <ReviewItem icon={MapPin} label="Region" value={data.region} color="#C9B7E2" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="review-notice"
      >
        <AlertCircle style={{ width: '1rem', height: '1rem', marginTop: '0.125rem', flexShrink: 0 }} />
        <span>By creating an account, you agree to our terms and conditions.</span>
      </motion.div>
    </motion.div>
  );
}

function ReviewItem({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="review-item"
    >
      <div className="review-icon" style={{ color }}>
        <Icon style={{ width: '1rem', height: '1rem' }} />
      </div>
      <div style={{ flex: 1 }}>
        <p className="review-label">{label}</p>
        <p className="review-value">{value}</p>
      </div>
    </motion.div>
  );
}

function FormField({ icon: Icon, iconColor, label, value, onChange, placeholder, focusClass, error, type = "text", optional = false, maxLength }) {
  return (
    <div className="form-field">
      <label className="form-label">
        <Icon style={{ width: '1rem', height: '1rem', color: iconColor }} />
        {label}
        {optional && <span className="form-label-optional">(Optional)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`form-input ${focusClass} ${error ? 'error' : ''}`}
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="error-message"
        >
          <AlertCircle style={{ width: '0.75rem', height: '0.75rem' }} />
          {error}
        </motion.p>
      )}
    </div>
  );
}

function PasswordField({ icon: Icon, iconColor, label, value, onChange, placeholder, focusClass, error, showPassword, setShowPassword }) {
  return (
    <div className="form-field">
      <label className="form-label">
        <Icon style={{ width: '1rem', height: '1rem', color: iconColor }} />
        {label}
      </label>
      <div className="password-input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-input ${focusClass} ${error ? 'error' : ''}`}
          style={{ paddingRight: '3rem' }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="password-toggle"
        >
          {showPassword ? (
            <EyeOff style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
          ) : (
            <Eye style={{ width: '1.25rem', height: '1.25rem', color: '#9ca3af' }} />
          )}
        </button>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="error-message"
        >
          <AlertCircle style={{ width: '0.75rem', height: '0.75rem' }} />
          {error}
        </motion.p>
      )}
    </div>
  );
}