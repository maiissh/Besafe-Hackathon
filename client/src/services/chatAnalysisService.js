// Chat analysis service to detect potential problems from chat messages

// Keywords that might indicate problems
const PROBLEM_KEYWORDS = {
  bullying: ['bully', 'bullied', 'harass', 'harassment', 'tease', 'teasing', 'mean', 'hate', 'stupid', 'idiot', 'ugly', 'fat', 'loser'],
  cyberbullying: ['online', 'social media', 'post', 'comment', 'block', 'unfriend', 'delete', 'report'],
  depression: ['sad', 'depressed', 'hopeless', 'worthless', 'tired', 'sleep', 'cry', 'crying', 'lonely', 'alone', 'empty'],
  anxiety: ['worried', 'anxious', 'nervous', 'scared', 'afraid', 'panic', 'stress', 'stressed', 'fear'],
  selfHarm: ['hurt', 'cut', 'suicide', 'kill myself', 'end it', 'die', 'death', 'pain'],
  abuse: ['hit', 'beat', 'hurt me', 'scared of', 'threaten', 'threat', 'danger', 'unsafe'],
  inappropriate: ['sex', 'sexual', 'nude', 'naked', 'adult', 'explicit']
};

// Analyze a chat message for potential problems
export const analyzeMessage = (message) => {
  if (!message || typeof message !== 'string') {
    return { hasProblems: false, problems: [], severity: 'none' };
  }

  const lowerMessage = message.toLowerCase();
  const detectedProblems = [];
  let maxSeverity = 'none';

  // Check each category
  for (const [category, keywords] of Object.entries(PROBLEM_KEYWORDS)) {
    const foundKeywords = keywords.filter(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );

    if (foundKeywords.length > 0) {
      detectedProblems.push({
        category,
        keywords: foundKeywords,
        severity: getSeverity(category, foundKeywords.length)
      });

      // Update max severity
      const categorySeverity = getSeverity(category, foundKeywords.length);
      if (getSeverityLevel(categorySeverity) > getSeverityLevel(maxSeverity)) {
        maxSeverity = categorySeverity;
      }
    }
  }

  return {
    hasProblems: detectedProblems.length > 0,
    problems: detectedProblems,
    severity: maxSeverity,
    message: message
  };
};

// Get severity level
const getSeverity = (category, keywordCount) => {
  // Critical categories
  if (['selfHarm', 'abuse'].includes(category)) {
    return 'critical';
  }
  
  // High severity
  if (['bullying', 'cyberbullying', 'depression'].includes(category) && keywordCount >= 2) {
    return 'high';
  }

  // Medium severity
  if (keywordCount >= 2 || ['depression', 'anxiety'].includes(category)) {
    return 'medium';
  }

  // Low severity
  return 'low';
};

// Get severity level as number for comparison
const getSeverityLevel = (severity) => {
  const levels = { 'none': 0, 'low': 1, 'medium': 2, 'high': 3, 'critical': 4 };
  return levels[severity] || 0;
};

// Get recommendations based on detected problems
export const getRecommendations = (analysis) => {
  if (!analysis.hasProblems) {
    return [];
  }

  const recommendations = [];

  analysis.problems.forEach(problem => {
    switch (problem.category) {
      case 'bullying':
      case 'cyberbullying':
        recommendations.push({
          title: 'Bullying Detected',
          message: 'If you\'re experiencing bullying, talk to a trusted adult or use the "Get Help" section.',
          action: 'Report this to a teacher or parent',
          priority: 'high'
        });
        break;
      
      case 'depression':
      case 'selfHarm':
        recommendations.push({
          title: 'Mental Health Concern',
          message: 'If you\'re feeling this way, please reach out for help. You\'re not alone.',
          action: 'Contact a mental health professional or crisis hotline',
          priority: 'critical'
        });
        break;
      
      case 'anxiety':
        recommendations.push({
          title: 'Anxiety Detected',
          message: 'Anxiety is common. Consider talking to someone you trust or a counselor.',
          action: 'Practice breathing exercises or talk to a counselor',
          priority: 'medium'
        });
        break;
      
      case 'abuse':
        recommendations.push({
          title: 'Safety Concern',
          message: 'If you\'re in immediate danger, call emergency services. Otherwise, tell a trusted adult.',
          action: 'Contact authorities or a trusted adult immediately',
          priority: 'critical'
        });
        break;
      
      case 'inappropriate':
        recommendations.push({
          title: 'Inappropriate Content',
          message: 'This conversation contains inappropriate content. Consider ending it.',
          action: 'End the conversation and report if necessary',
          priority: 'medium'
        });
        break;
    }
  });

  return recommendations;
};

// Analyze multiple messages (conversation)
export const analyzeConversation = (messages) => {
  if (!Array.isArray(messages)) {
    return { hasProblems: false, problems: [], severity: 'none', recommendations: [] };
  }

  const allProblems = [];
  let maxSeverity = 'none';

  messages.forEach(msg => {
    if (msg.sender !== 'System' && msg.text) {
      const analysis = analyzeMessage(msg.text);
      if (analysis.hasProblems) {
        allProblems.push(...analysis.problems);
        if (getSeverityLevel(analysis.severity) > getSeverityLevel(maxSeverity)) {
          maxSeverity = analysis.severity;
        }
      }
    }
  });

  // Remove duplicates
  const uniqueProblems = allProblems.reduce((acc, problem) => {
    const existing = acc.find(p => p.category === problem.category);
    if (!existing) {
      acc.push(problem);
    } else {
      existing.keywords = [...new Set([...existing.keywords, ...problem.keywords])];
    }
    return acc;
  }, []);

  const recommendations = getRecommendations({
    hasProblems: uniqueProblems.length > 0,
    problems: uniqueProblems,
    severity: maxSeverity
  });

  return {
    hasProblems: uniqueProblems.length > 0,
    problems: uniqueProblems,
    severity: maxSeverity,
    recommendations,
    messageCount: messages.length
  };
};

