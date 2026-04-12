import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, Shield, Lightbulb, Clock, User, Lock, Database, Globe, Cpu, Brain, TrendingUp, Target } from 'lucide-react';
import securityReportData from '../data/securityReport';
import SecurityAI from '../utils/securityAI';

const SecurityAssistant = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedItems, setExpandedItems] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiInstance] = useState(() => new SecurityAI());
  const [smartRecommendations, setSmartRecommendations] = useState([]);
  const [userContext, setUserContext] = useState({
    expertise: 'intermediate',
    budget: 'limited',
    timeline: 'medium',
    teamSize: 'small'
  });

  // Reset AI state on component mount (page refresh)
  useEffect(() => {
    aiInstance.conversationHistory = [];
    aiInstance.context = {
      userRole: 'developer',
      teamSize: 'small',
      budget: 'limited',
      timeline: 'medium',
      expertise: 'intermediate'
    };
  }, [aiInstance]);

  const securityData = {
    score: securityReportData.overallScore,
    criticalIssues: securityReportData.metrics.current.vulnerabilities.critical,
    highIssues: securityReportData.metrics.current.vulnerabilities.high,
    mediumIssues: securityReportData.metrics.current.vulnerabilities.medium,
    totalFindings: securityReportData.vulnerabilities.length,
    phases: [
      {
        id: 'requirements',
        name: 'Security Requirements',
        status: securityReportData.phases.requirements.status,
        icon: <Database className="w-5 h-5" />,
        issues: securityReportData.phases.requirements.issues,
        priority: 'high',
        score: securityReportData.phases.requirements.score
      },
      {
        id: 'design',
        name: 'Secure Design',
        status: securityReportData.phases.design.status,
        icon: <Shield className="w-5 h-5" />,
        issues: securityReportData.phases.design.issues,
        priority: 'critical',
        score: securityReportData.phases.design.score
      },
      {
        id: 'development',
        name: 'Secure Development',
        status: securityReportData.phases.development.status,
        icon: <Lock className="w-5 h-5" />,
        issues: securityReportData.phases.development.issues,
        priority: 'critical',
        score: securityReportData.phases.development.score
      },
      {
        id: 'testing',
        name: 'Security Testing',
        status: securityReportData.phases.testing.status,
        icon: <Cpu className="w-5 h-5" />,
        issues: securityReportData.phases.testing.issues,
        priority: 'high',
        score: securityReportData.phases.testing.score
      },
      {
        id: 'deployment',
        name: 'Deployment Security',
        status: securityReportData.phases.deployment.status,
        icon: <Globe className="w-5 h-5" />,
        issues: securityReportData.phases.deployment.issues,
        priority: 'critical',
        score: securityReportData.phases.deployment.score
      },
      {
        id: 'maintenance',
        name: 'Maintenance & Monitoring',
        status: securityReportData.phases.maintenance.status,
        icon: <Clock className="w-5 h-5" />,
        issues: securityReportData.phases.maintenance.issues,
        priority: 'high',
        score: securityReportData.phases.maintenance.score
      }
    ],
    priorityFixes: securityReportData.actionPlan.flatMap(phase => 
      phase.actions.map(action => ({
        id: action.title.toLowerCase().replace(/\s+/g, '_'),
        title: action.title,
        severity: action.priority === 'Critical' ? 'critical' : action.priority === 'High' ? 'high' : 'medium',
        effort: action.effort,
        timeEstimate: phase.phase.includes('Immediate') ? '1-2 days' : 
                     phase.phase.includes('Short') ? '1-2 weeks' : '4-8 weeks',
        description: action.description,
        steps: action.description ? [action.description] : ['Implementation needed']
      }))
    ).slice(0, 6) // Show top 6 fixes
  };

  const aiResponses = {
    'how to start': 'Based on your security audit, I recommend starting with the highest priority fixes. Begin with implementing authentication since it\'s critical and affects your entire security posture.',
    'what is most important': 'The most critical issues are: 1) No authentication system, 2) Debug mode in production, and 3) No encryption. These should be addressed immediately.',
    'timeline': 'For a complete security overhaul, estimate 6-8 weeks. Critical fixes (2-3 weeks), High priority fixes (2-3 weeks), Medium fixes (1-2 weeks).',
    'cost': 'Security improvements require development time but prevent costly breaches. Consider this an investment in data protection and compliance.',
    'compliance': 'Your application currently has significant compliance gaps. Implement GDPR measures, data protection policies, and audit logging to meet regulatory requirements.',
    'default': 'I can help you understand your security audit results and prioritize fixes. Ask me about specific vulnerabilities, implementation steps, or security best practices.'
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'incomplete': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'vulnerable': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'missing': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const clearChat = () => {
    setChatMessages([]);
    setCurrentMessage('');
    setSmartRecommendations([]);
    // Reset AI instance conversation history
    aiInstance.conversationHistory = [];
    aiInstance.context = {
      userRole: 'developer',
      teamSize: 'small',
      budget: 'limited',
      timeline: 'medium',
      expertise: 'intermediate'
    };
  };

  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage = { role: 'user', text: currentMessage, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const smartResponse = aiInstance.generateResponse(currentMessage);
      const aiMessage = { 
        role: 'assistant', 
        text: smartResponse, 
        timestamp: new Date() 
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      
      // Update smart recommendations based on conversation
      const newRecommendations = aiInstance.getPersonalizedRecommendations();
      setSmartRecommendations(newRecommendations);
      
      setIsTyping(false);
    }, 1000);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          Security Score Overview
        </h3>
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
            <div className="absolute inset-0 w-32 h-32 rounded-full border-8 border-red-500 border-t-transparent border-r-transparent transform -rotate-45"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{securityData.score}/10</div>
                <div className="text-sm text-gray-600">Critical Risk</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{securityData.criticalIssues}</div>
            <div className="text-sm text-gray-600">Critical</div>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{securityData.highIssues}</div>
            <div className="text-sm text-gray-600">High</div>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{securityData.mediumIssues}</div>
            <div className="text-sm text-gray-600">Medium</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
          Key Recommendations
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium">Implement Authentication Immediately</div>
              <div className="text-sm text-gray-600">No authentication is the most critical security gap</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium">Enable Encryption</div>
              <div className="text-sm text-gray-600">All data is currently transmitted unencrypted</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
            <div>
              <div className="font-medium">Fix Production Configuration</div>
              <div className="text-sm text-gray-600">Debug mode and permissive settings create risks</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPhases = () => (
    <div className="space-y-4">
      {securityData.phases.map(phase => (
        <div key={phase.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleExpand(phase.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">{phase.icon}</div>
                <div>
                  <div className="font-medium">{phase.name}</div>
                  <div className="text-sm text-gray-600">SSDLC Phase</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(phase.priority)}`}>
                  {phase.priority}
                </span>
                {getStatusIcon(phase.status)}
              </div>
            </div>
          </div>
          {expandedItems[phase.id] && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <div className="mt-3">
                <div className="text-sm font-medium text-gray-700 mb-2">Issues Found:</div>
                <ul className="space-y-1">
                  {phase.issues.map((issue, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-red-500 mr-2">-</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderPriorityFixes = () => (
    <div className="space-y-4">
      {securityData.priorityFixes.map(fix => (
        <div key={fix.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900">{fix.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{fix.description}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(fix.severity)}`}>
              {fix.severity}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
            <div>
              <span className="font-medium">Effort:</span>
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                fix.effort === 'high' ? 'bg-red-100 text-red-700' :
                fix.effort === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {fix.effort}
              </span>
            </div>
            <div>
              <span className="font-medium">Timeline:</span>
              <span className="ml-2 text-gray-600">{fix.timeEstimate}</span>
            </div>
          </div>

          <div>
            <button 
              onClick={() => toggleExpand(fix.id)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {expandedItems[fix.id] ? 'Hide' : 'Show'} Implementation Steps
            </button>
            {expandedItems[fix.id] && (
              <ol className="mt-2 space-y-1 text-sm text-gray-600">
                {fix.steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2 font-medium">{index + 1}.</span>
                    {step}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSmartInsights = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-purple-600" />
          AI-Powered Security Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-purple-900">Risk Assessment</span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-sm text-purple-700">Your current security posture poses critical risks to data confidentiality and system integrity.</p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-blue-900">Improvement Potential</span>
              <Target className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-sm text-blue-700">With focused effort, you can achieve 80% security improvement in 6-8 weeks.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Personalized Recommendations</h4>
          {smartRecommendations.length > 0 ? (
            smartRecommendations.map((rec, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h5 className="font-medium text-gray-900 mb-2">{rec.title}</h5>
                <ul className="space-y-1">
                  {rec.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-sm text-gray-600 flex items-start">
                      <span className="text-green-500 mr-2">-</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Start a conversation to get personalized recommendations!</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => {
              setCurrentMessage("I'm a beginner, help me get started");
              sendMessage();
            }}
            className="p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors"
          >
            <div className="font-medium text-green-900">Beginner Path</div>
            <div className="text-sm text-green-700">Step-by-step guidance</div>
          </button>
          
          <button
            onClick={() => {
              setCurrentMessage("What are the most critical issues?");
              sendMessage();
            }}
            className="p-3 text-left bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
          >
            <div className="font-medium text-red-900">Critical Fixes</div>
            <div className="text-sm text-red-700">Priority vulnerabilities</div>
          </button>
          
          <button
            onClick={() => {
              setCurrentMessage("I have a limited budget, what can I do?");
              sendMessage();
            }}
            className="p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
          >
            <div className="font-medium text-blue-900">Budget-Friendly</div>
            <div className="text-sm text-blue-700">Free security fixes</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="bg-white rounded-lg border border-gray-200 h-96 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-600" />
              Smart AI Security Assistant
            </h3>
            <p className="text-sm text-gray-600 mt-1">Contextual, personalized security guidance</p>
          </div>
          <button
            onClick={clearChat}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            Clear Chat
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Ask me anything about your security!</p>
            <p className="text-sm mt-2">I understand context, budget, timeline, and expertise level</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {["Beginner help", "Critical issues", "Budget options", "Implementation steps", "Testing strategy"].map(prompt => (
                <button
                  key={prompt}
                  onClick={() => {
                    setCurrentMessage(prompt);
                    sendMessage();
                  }}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {chatMessages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md px-4 py-2 rounded-lg ${
              message.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              <p className="text-sm whitespace-pre-line">{message.text}</p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask me anything... (I understand context!)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Security Assistant</h2>
        <p className="text-gray-600">Interactive guidance for implementing security improvements based on your audit results</p>
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {['overview', 'phases', 'fixes', 'insights', 'chat'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === tab 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'insights' ? 'Smart Insights' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'phases' && renderPhases()}
        {activeTab === 'fixes' && renderPriorityFixes()}
        {activeTab === 'insights' && renderSmartInsights()}
        {activeTab === 'chat' && renderChat()}
      </div>
    </div>
  );
};

export default SecurityAssistant;
