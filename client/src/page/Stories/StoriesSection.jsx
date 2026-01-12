import { useMemo, useState, useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import BottomNav from "../../components/BottomNav/BottomNav.jsx";
import "./StoriesSection.css";
import storyService from '../../services/storyService.js';
import studentService from '../../services/studentService.js';

/* eslint-disable react/prop-types */

/* --- SVG Icons --- */
const IconSend = ({ className = "", style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M22 2L11 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M22 2L15 22L11 13L2 9L22 2Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconShield = ({ className = "", style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L3 5v6c0 5 3.8 9.8 9 11 5.2-1.2 9-6 9-11V5l-9-3z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconHeart = ({ className = "", fill = "none", style, stroke }) => (
  <svg
    viewBox="0 0 24 24"
    fill={fill}
    stroke={stroke || "currentColor"}
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 21s-7-4.6-9-7.4C1 10.8 3 6 7 6c2 0 3 1.4 5 3.2C15 7.4 16 6 18 6c4 0 6 4.8 4 7.6C19 16.4 12 21 12 21z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconHandHeart = ({ className = "", style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="m2 15 6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCheck = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconX = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18 6L6 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconTrash = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 11v6M14 11v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const defaultUser = { firstName: "User", fullName: "User Name", userId: null };
const defaultStudent = { points: 0, streak: 0 };

const StoriesSection = () => {
  const [currentUser, setCurrentUser] = useState(defaultUser);
  const [student, setStudent] = useState(defaultStudent);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showMyStories, setShowMyStories] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState(null);

  const [likedStories, setLikedStories] = useState([]);

  const [formData, setFormData] = useState({
    story: "",
    incidentType: "",
    nameVisibility: "",
  });

  const [stories, setStories] = useState([]);

  const incidentTypes = useMemo(
    () => [
      "Harassment or Bullying",
      "Impersonation",
      "Scams or Fraud",
      "Privacy Violation",
      "Unwanted Contact",
      "Fake Accounts",
      "Other",
    ],
    []
  );

  // Load current user and stories on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current student from localStorage or API
        const studentData = await studentService.getCurrentStudent();
        if (studentData) {
          const firstName = studentData.full_name?.split(" ")[0] || studentData.username || "User";
          const fullName = studentData.full_name || studentData.username || "User Name";
          setCurrentUser({ 
            firstName, 
            fullName, 
            userId: studentData.id 
          });
          // Set student data for Header
          setStudent({
            points: studentData.points || 0,
            streak: studentData.streak || 0
          });
        }

        // Load all stories from API
        const allStories = await storyService.getAllStories();
        setStories(allStories);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Refresh stories every 10 seconds to show new stories from other users
    const refreshInterval = setInterval(async () => {
      try {
        const allStories = await storyService.getAllStories();
        setStories(allStories);
      } catch (error) {
        console.error('Error refreshing stories:', error);
      }
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  const handleLike = async (id) => {
    const isAlreadyLiked = likedStories.includes(id);

    try {
      if (isAlreadyLiked) {
        // Unlike story
        const updatedStory = await storyService.unlikeStory(id);
        if (updatedStory) {
          // Reload all stories to get updated like counts
          const allStories = await storyService.getAllStories();
          setStories(allStories);
          setLikedStories((prevLiked) => prevLiked.filter((storyId) => storyId !== id));
          // Update student points in state
          const updatedStudentUnliked = await studentService.getCurrentStudent();
          if (updatedStudentUnliked) {
            setStudent({
              points: updatedStudentUnliked.points || 0,
              streak: updatedStudentUnliked.streak || 0
            });
          }
        }
      } else {
        // Like story
        const updatedStory = await storyService.likeStory(id);
        if (updatedStory) {
          // Reload all stories to get updated like counts
          const allStories = await storyService.getAllStories();
          setStories(allStories);
          setLikedStories((prevLiked) => [...prevLiked, id]);
          // Add points for liking
          await studentService.addPoints(2);
          // Update student points in state
          const updatedStudent = await studentService.getCurrentStudent();
          if (updatedStudent) {
            setStudent({
              points: updatedStudent.points || 0,
              streak: updatedStudent.streak || 0
            });
          }
        }
      }
    } catch (error) {
      console.error('Error liking/unliking story:', error);
    }
  };

  const handleDelete = (id) => {
    setStoryToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!storyToDelete) return;

    try {
      const success = await storyService.deleteStory(storyToDelete);
      if (success) {
        setStories((prev) => prev.filter((s) => s.id !== storyToDelete));
        setLikedStories((prev) => prev.filter((id) => id !== storyToDelete));
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      alert('Failed to delete story. Please try again.');
    } finally {
      setShowDeleteModal(false);
      setStoryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setStoryToDelete(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.story.trim() || !formData.incidentType || !formData.nameVisibility) {
      alert("Please fill in all required fields");
      return;
    }

    if (!currentUser.userId) {
      alert("Please sign in to share a story");
      return;
    }

    let displayName = "Anonymous";
    if (formData.nameVisibility === "full") displayName = currentUser.fullName;
    if (formData.nameVisibility === "first") displayName = currentUser.firstName;

    try {
      // Save story to backend
      const newStory = await storyService.createStory({
        story: formData.story.trim(),
        incidentType: formData.incidentType,
        displayName,
        userId: currentUser.userId
      });

      if (newStory) {
        // Reload all stories from server to ensure everyone sees the new story
        const allStories = await storyService.getAllStories();
        setStories(allStories);
        setSubmitted(true);

        // Add points for writing a story
        await studentService.addPoints(10);
        // Update student points in state
        const updatedStudent = await studentService.getCurrentStudent();
        if (updatedStudent) {
          setStudent({
            points: updatedStudent.points || 0,
            streak: updatedStudent.streak || 0
          });
        }

        setTimeout(() => {
          setFormData({ story: "", incidentType: "", nameVisibility: "" });
          setSubmitted(false);
          setShowForm(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error creating story:', error);
      alert('Failed to share story. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const displayedStories = showMyStories
    ? stories.filter((story) => {
        // Convert both to strings for comparison
        const storyUserId = story.userId?.toString() || story.userId;
        const currentUserId = currentUser.userId?.toString() || currentUser.userId;
        return storyUserId === currentUserId;
      })
    : stories; // Show ALL stories in Community Stories, regardless of userId

  const isFormValid =
    formData.story.trim().length > 0 && formData.incidentType !== "" && formData.nameVisibility !== "";

  if (loading) {
    return (
      <>
        <Header points={student.points} streak={student.streak} />
        <div className="stories-section">
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading stories...</div>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Header points={student.points} streak={student.streak} />

      <div className="background-wrapper">
        <div className="gradient-overlay"></div>

        <div className="floating-orb orb-pink"></div>
        <div className="floating-orb orb-purple"></div>
        <div className="floating-orb orb-blue"></div>

        <div className="floating-icon icon1">
          <IconShield style={{ width: "3rem", height: "3rem", color: "#c084fc" }} />
        </div>
        <div className="floating-icon icon2">
          <IconHeart style={{ width: "3rem", height: "3rem", color: "#f472b6" }} fill="#f472b6" />
        </div>
        <div className="floating-icon icon3">
          <IconHandHeart style={{ width: "3rem", height: "3rem", color: "#60a5fa" }} />
        </div>
        <div className="floating-icon icon4">
          <IconShield style={{ width: "3rem", height: "3rem", color: "#f472b6" }} />
        </div>
        <div className="floating-icon icon5">
          <IconHeart style={{ width: "3rem", height: "3rem", color: "#c084fc" }} fill="#c084fc" />
        </div>
        <div className="floating-icon icon6">
          <IconHandHeart style={{ width: "3rem", height: "3rem", color: "#f472b6" }} />
        </div>
        <div className="floating-icon icon7">
          <IconShield style={{ width: "3rem", height: "3rem", color: "#60a5fa" }} />
        </div>
        <div className="floating-icon icon8">
          <IconHeart style={{ width: "3rem", height: "3rem", color: "#f472b6" }} fill="#f472b6" />
        </div>
      </div>

      <div className="stories-section">
        <div className="stories-container">
          <div className="stories-header">
            <div className="header-icon">
              <IconHeart className="icon-heart" fill="none" stroke="#f472b6" />
            </div>
            <h1 className="main-title">Stories & Experiences</h1>
            <p className="main-description">
              A safe space to share your experiences and learn from others.
               Your voice matters, and your story could help someone else feel less alone.
            </p>
          </div>

          <div className="safety-cards">
            <div className="safety-card">
              <IconShield className="card-icon icon-purple" />
              <h3 className="card-title">Your Privacy First</h3>
              <p className="card-description">Choose how your name appears or stay completely anonymous</p>
            </div>
            <div className="safety-card">
              <IconHandHeart className="card-icon icon-blue" />
              <h3 className="card-title">Community Support</h3>
              <p className="card-description">Stories are reviewed to ensure a supportive environment</p>
            </div>
            <div className="safety-card">
              <IconHeart className="card-icon icon-pink" fill="none" stroke="#f472b6" />
              <h3 className="card-title">You&apos;re Not Alone</h3>
              <p className="card-description">Learn from others and help empower your peers</p>
            </div>
          </div>

          <div>
            <div className="stories-toggle">
              <button
                className={`toggle-button ${!showMyStories ? "toggle-active" : ""}`}
                onClick={() => setShowMyStories(false)}
              >
                Community Stories
              </button>
              <button
                className={`toggle-button ${showMyStories ? "toggle-active" : ""}`}
                onClick={() => setShowMyStories(true)}
              >
                My Stories ({stories.filter((s) => {
                  const storyUserId = s.userId?.toString() || s.userId;
                  const currentUserId = currentUser.userId?.toString() || currentUser.userId;
                  return storyUserId === currentUserId;
                }).length})
              </button>
            </div>

            <h2 className="section-title">{showMyStories ? "My Stories" : "Community Stories"}</h2>

            {displayedStories.length === 0 && showMyStories ? (
              <div className="empty-state">
                <p className="empty-text">You haven&apos;t shared any stories yet.</p>
                <button onClick={() => setShowForm(true)} className="empty-button">
                  Share Your First Story
                </button>
              </div>
            ) : (
              <div className="stories-list">
                {displayedStories.map((story) => {
                  const isLikedByMe = likedStories.includes(story.id);
                  // Convert both to strings for comparison
                  const storyUserId = story.userId?.toString() || story.userId;
                  const currentUserId = currentUser.userId?.toString() || currentUser.userId;
                  const isMyStory = storyUserId === currentUserId;

                  return (
                    <div key={story.id} className="story-card">
                      <div className="story-header">
                        <div className="story-author">
                          <div className="author-avatar">
                            {story.displayName === "Anonymous" ? "?" : story.displayName.charAt(0)}
                          </div>
                          <div>
                            <div className="author-name">
                              {story.displayName}
                              {isMyStory && <span className="my-badge">You</span>}
                            </div>
                            <div className="story-date">{story.date}</div>
                          </div>
                        </div>

                        <div className="story-header-right">
                          <span className="story-badge">{story.incidentType}</span>
                          {isMyStory && (
                            <button
                              onClick={() => handleDelete(story.id)}
                              className="delete-button"
                              title="Delete story"
                            >
                              <IconTrash className="delete-icon" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="story-text">{story.story}</p>

                      <div className="story-footer">
                        <button
                          className={`like-button ${isLikedByMe ? "is-liked" : ""}`}
                          onClick={() => handleLike(story.id)}
                        >
                          <IconHeart
                            className="footer-icon"
                            fill={isLikedByMe ? "#f472b6" : "none"}
                            stroke={isLikedByMe ? "#f472b6" : "currentColor"}
                          />
                          <span className="like-count">
                            {story.likes} {isLikedByMe ? "Supported" : "Support"}
                          </span>
                        </button>
                        <span className="footer-thankyou">Thank you for sharing</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="resources-section">
            <h3 className="resources-title">Need Support?</h3>
            <p className="resources-description">
              If you&apos;re experiencing online harassment, you don&apos;t have to handle it alone.
            </p>
            <div className="resources-grid">
              <div className="resource-card resource-card-pink">
                <h4 className="resource-title">Talk to a Trusted Adult</h4>
                <p className="resource-text">Teachers or parents can help you navigate difficult situations</p>
              </div>
              <div className="resource-card resource-card-blue">
                <h4 className="resource-title">Report & Block</h4>
                <p className="resource-text">Use platform reporting tools to document harmful behavior</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => setShowForm(true)} className="share-button">
        <IconSend className="share-icon" />
        <span className="share-text-full">Share Your Story</span>
        <span className="share-text-mobile">Share</span>
      </button>

      {showForm && !submitted && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-icon">
                  <IconSend className="modal-icon-svg" />
                </div>
                <h2 className="modal-title">Share Your Experience</h2>
              </div>
              <button type="button" onClick={() => setShowForm(false)} className="close-button">
                <IconX className="close-icon" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="form-content">
              <div className="form-grid">
                <div className="form-column">
                  <label className="form-label">
                    Your Story <span className="required">*</span>
                  </label>
                  <textarea
                    name="story"
                    value={formData.story}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Share what happened..."
                    className="story-textarea"
                    maxLength={500}
                    required
                  />
                  <div className="char-counter">{formData.story.length}/500 characters</div>

                  <div className="incident-type-container">
                    <label className="form-label">
                      Incident Type <span className="required">*</span>
                    </label>
                    <select
                      name="incidentType"
                      value={formData.incidentType}
                      onChange={handleChange}
                      className="incident-select"
                      required
                    >
                      <option value="">Select type</option>
                      {incidentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-column form-column-right">
                  <label className="form-label">
                    Name Display <span className="required">*</span>
                  </label>
                  <p className="name-description">Choose what feels safest</p>

                  <div className="radio-group">
                    <label className={`radio-option ${formData.nameVisibility === "anonymous" ? "radio-selected" : ""}`}>
                      <input
                        type="radio"
                        name="nameVisibility"
                        value="anonymous"
                        checked={formData.nameVisibility === "anonymous"}
                        onChange={handleChange}
                        className="radio-input"
                      />
                      <div>
                        <div className="radio-title">Anonymous</div>
                        <div className="radio-subtitle">No name shown</div>
                      </div>
                    </label>

                    <label className={`radio-option ${formData.nameVisibility === "first" ? "radio-selected" : ""}`}>
                      <input
                        type="radio"
                        name="nameVisibility"
                        value="first"
                        checked={formData.nameVisibility === "first"}
                        onChange={handleChange}
                        className="radio-input"
                      />
                      <div className="radio-content-full">
                        <div className="radio-title">First name only</div>
                        <div className="radio-subtitle">
                          Will show as: <span className="preview-name">&quot;{currentUser.firstName}&quot;</span>
                        </div>
                      </div>
                    </label>

                    <label className={`radio-option ${formData.nameVisibility === "full" ? "radio-selected" : ""}`}>
                      <input
                        type="radio"
                        name="nameVisibility"
                        value="full"
                        checked={formData.nameVisibility === "full"}
                        onChange={handleChange}
                        className="radio-input"
                      />
                      <div className="radio-content-full">
                        <div className="radio-title">Full name</div>
                        <div className="radio-subtitle">
                          Will show as: <span className="preview-name">&quot;{currentUser.fullName}&quot;</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="submit-container">
                <button type="submit" disabled={!isFormValid} className="submit-button">
                  <IconSend className="submit-icon" />
                  Share My Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="delete-icon-wrapper">
              <IconTrash className="delete-modal-icon" />
            </div>
            <h3 className="delete-title">Delete Story?</h3>
            <p className="delete-text">Are you sure you want to delete this story? This action cannot be undone.</p>
            <div className="delete-buttons">
              <button onClick={cancelDelete} className="cancel-button">
                Cancel
              </button>
              <button onClick={confirmDelete} className="confirm-delete-button">
                <IconTrash className="delete-btn-icon" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {submitted && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon-wrapper">
              <IconCheck className="success-icon" />
            </div>
            <h3 className="success-title">Thank you for sharing</h3>
            <p className="success-text">Your story has been submitted and will help empower others.</p>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  );
};

export default StoriesSection;