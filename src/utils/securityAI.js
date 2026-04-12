import securityReportData from '../data/securityReport';

class SecurityAI {
  constructor() {
    this.securityData = securityReportData;
    this.context = {
      userRole: 'developer',
      teamSize: 'small',
      budget: 'limited',
      timeline: 'medium',
      expertise: 'intermediate'
    };
    this.conversationHistory = [];
    this.learningData = new Map();
  }

  // Advanced context analysis
  analyzeContext(message) {
    const keywords = {
      budget: ['budget', 'cost', 'money', 'afford', 'cheap', 'expensive'],
      timeline: ['timeline', 'deadline', 'urgent', 'quick', 'fast', 'slow'],
      team: ['team', 'solo', 'alone', 'help', 'resources', 'manpower'],
      expertise: ['beginner', 'expert', 'experienced', 'learning', 'newbie'],
      compliance: ['compliance', 'gdpr', 'regulation', 'legal', 'audit'],
      priority: ['important', 'critical', 'urgent', 'must-have', 'priority']
    };

    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => message.toLowerCase().includes(word))) {
        this.updateContext(category, message);
      }
    }
  }

  updateContext(category, message) {
    switch (category) {
      case 'budget':
        if (message.includes('limited') || message.includes('cheap')) {
          this.context.budget = 'limited';
        } else if (message.includes('good') || message.includes('enough')) {
          this.context.budget = 'good';
        }
        break;
      case 'timeline':
        if (message.includes('urgent') || message.includes('quick')) {
          this.context.timeline = 'urgent';
        } else if (message.includes('slow') || message.includes('careful')) {
          this.context.timeline = 'relaxed';
        }
        break;
      case 'team':
        if (message.includes('solo') || message.includes('alone')) {
          this.context.teamSize = 'solo';
        } else if (message.includes('team')) {
          this.context.teamSize = 'team';
        }
        break;
      case 'expertise':
        if (message.includes('beginner') || message.includes('newbie')) {
          this.context.expertise = 'beginner';
        } else if (message.includes('expert')) {
          this.context.expertise = 'expert';
        }
        break;
      default:
        // Handle unknown categories
        break;
    }
  }

  // Smart response generation
  generateResponse(message) {
    this.analyzeContext(message);
    this.conversationHistory.push({ role: 'user', text: message, timestamp: new Date() });

    const lowerMessage = message.toLowerCase();
    
    // Priority-based routing
    if (lowerMessage.includes('priority') || lowerMessage.includes('most important')) {
      return this.getPriorityResponse();
    }
    
    if (lowerMessage.includes('timeline') || lowerMessage.includes('how long')) {
      return this.getTimelineResponse();
    }
    
    if (lowerMessage.includes('budget') || lowerMessage.includes('cost')) {
      return this.getBudgetResponse();
    }
    
    if (lowerMessage.includes('compliance') || lowerMessage.includes('gdpr')) {
      return this.getComplianceResponse();
    }
    
    if (lowerMessage.includes('beginner') || lowerMessage.includes('help me')) {
      return this.getBeginnerResponse();
    }
    
    if (lowerMessage.includes('step by step') || lowerMessage.includes('implementation')) {
      return this.getImplementationResponse();
    }
    
    if (lowerMessage.includes('testing') || lowerMessage.includes('test')) {
      return this.getTestingResponse();
    }
    
    if (lowerMessage.includes('monitoring') || lowerMessage.includes('alert')) {
      return this.getMonitoringResponse();
    }
    
    if (lowerMessage.includes('authentication') || lowerMessage.includes('auth')) {
      return this.getAuthenticationResponse();
    }
    
    if (lowerMessage.includes('encryption') || lowerMessage.includes('tls')) {
      return this.getEncryptionResponse();
    }
    
    // Contextual default response
    return this.getContextualResponse(message);
  }

  getPriorityResponse() {
    const criticalVulns = this.securityData.vulnerabilities.filter(v => v.severity === 'Critical');
    const topPriority = criticalVulns.sort((a, b) => b.cvss - a.cvss)[0];
    
    return `Based on your risk assessment, the absolute top priority is **${topPriority.category}** (CVSS: ${topPriority.cvss}). 

This vulnerability affects ${topPriority.location} and could lead to ${topPriority.impact.toLowerCase()}.

**Why it's critical:** ${topPriority.description}

**Quick win:** If you're under time pressure, disable debug mode immediately (1 line change in main.py) while you plan larger fixes.

**Next steps:** ${topPriority.remediation}

Would you like me to break this down into specific code changes?`;
  }

  getTimelineResponse() {
    const phases = this.securityData.actionPlan;
    let timeline = 'Here\'s a realistic security improvement timeline:\n\n';
    
    phases.forEach((phase, index) => {
      const duration = phase.phase.includes('Immediate') ? 'Week 1-2' :
                      phase.phase.includes('Short') ? 'Week 3-4' : 'Week 5-8';
      
      timeline += `**${duration} - ${phase.phase}**\n`;
      phase.actions.forEach(action => {
        timeline += `  - ${action.title} (${action.effort} effort)\n`;
      });
      timeline += '\n';
    });
    
    if (this.context.timeline === 'urgent') {
      timeline += '\n**Urgent timeline adjustment:** Focus only on Critical items first. Skip Medium priority for now.';
    } else if (this.context.timeline === 'relaxed') {
      timeline += '\n**Relaxed timeline:** Add 2-3 weeks for thorough testing and documentation.';
    }
    
    return timeline;
  }

  getBudgetResponse() {
    const lowBudgetFixes = this.securityData.actionPlan[0].actions.filter(a => a.effort === 'Low');
    const mediumBudgetFixes = this.securityData.actionPlan.flatMap(p => p.actions).filter(a => a.effort === 'Medium');
    
    let response = 'Here are budget-conscious security improvements:\n\n';
    
    response += '**FREE (No additional cost):**\n';
    lowBudgetFixes.forEach(fix => {
      response += `- ${fix.title} - ${fix.description}\n`;
    });
    
    response += '\n**LOW COST:**\n';
    mediumBudgetFixes.slice(0, 3).forEach(fix => {
      response += `- ${fix.title} - ${fix.description}\n`;
    });
    
    if (this.context.budget === 'limited') {
      response += '\n**Limited budget strategy:** Start with free fixes, then allocate budget for a single SSL certificate (~$50/year).';
    } else {
      response += '\n**Good budget strategy:** Consider security tools like SAST scanners and penetration testing services.';
    }
    
    return response;
  }

  getComplianceResponse() {
    const compliance = this.securityData.compliance;
    let response = 'Your compliance status needs significant attention:\n\n';
    
    Object.entries(compliance).forEach(([standard, info]) => {
      if (info.status === 'Non-compliant') {
        response += `**${standard.toUpperCase()}:** ${info.status}\n`;
        response += `Key gaps: ${info.gaps.slice(0, 2).join(', ')}\n`;
        response += `First step: ${info.recommendations[0]}\n\n`;
      }
    });
    
    response += '**Compliance priority:** Start with GDPR if you handle EU user data, as fines can be up to 4% of global revenue.';
    
    return response;
  }

  getBeginnerResponse() {
    return `Welcome to security improvement! Let me guide you step by step:

**Security 101 for your project:**

1. **Start with the basics** (Beginner-friendly):
   - Disable debug mode (Find line 416 in main.py, change debug=True to debug=False)
   - Add basic input validation
   - Set up simple logging

2. **Learn as you go:**
   - Each fix includes explanations of WHY it matters
   - I'll provide code examples you can copy-paste
   - Ask me "explain" for any security concept

3. **Your learning path:**
   Week 1: Basic configuration fixes
   Week 2: Add simple authentication
   Week 3: Implement HTTPS
   Week 4: Set up basic monitoring

**Don't worry about being perfect** - security is about continuous improvement!

What would you like to tackle first?`;
  }

  getImplementationResponse() {
    const authFix = this.securityData.actionPlan[1].actions.find(a => a.title.includes('Authentication'));
    const tlsFix = this.securityData.actionPlan[1].actions.find(a => a.title.includes('TLS'));
    
    return `Step-by-step implementation guide:

**Step 1: Immediate Fixes (Today)**
\`\`\`python
# In main.py, line 416:
app.run(host="0.0.0.0", port=8000, debug=False)  # Changed from debug=True
\`\`\`

**Step 2: Add Input Validation (This Week)**
\`\`\`python
# Add this function to main.py:
def validate_input(data, max_length=100):
    if not isinstance(data, str):
        return False
    if len(data) > max_length:
        return False
    # Add more validation rules
    return True
\`\`\`

**Step 3: Basic Authentication (Next Week)**
${authFix.description}

**Step 4: HTTPS Setup (Following Week)**
${tlsFix.description}

Would you like me to provide the complete code for any of these steps?`;
  }

  getTestingResponse() {
    return `Security testing strategy for your application:

**Automated Testing (Set up today):**
\`\`\`bash
# Install security testing tools
pip install bandit safety
npm install -g npm-audit-ci

# Run static analysis
bandit -r backend/
safety check
npm audit
\`\`\`

**Manual Testing Checklist:**
1. **Authentication Testing**
   - Try accessing endpoints without login
   - Test with invalid credentials
   - Check session management

2. **Input Validation Testing**
   - Send SQL injection attempts
   - Test XSS in all input fields
   - Try file upload attacks

3. **Network Security Testing**
   - Test with HTTP (not HTTPS)
   - Check CORS policies
   - Verify API rate limiting

**Free Testing Tools:**
- OWASP ZAP (Free DAST scanner)
- Burp Suite Community (Free proxy for testing)
- Nmap (Network scanning)

**Testing Schedule:**
- Daily: Automated scans
- Weekly: Manual testing
- Monthly: Full security assessment

Want me to help you set up automated testing?`;
  }

  getMonitoringResponse() {
    return `Security monitoring setup:

**Basic Logging (Add today):**
\`\`\`python
import logging
from datetime import datetime

# Configure security logging
logging.basicConfig(
    filename='security.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def log_security_event(event_type, details):
    logging.info(f"SECURITY: {event_type} - {details}")

# Add to your API endpoints
@app.before_request
def log_request():
    log_security_event("API_ACCESS", {
        "endpoint": request.endpoint,
        "ip": request.remote_addr,
        "user_agent": request.headers.get('User-Agent')
    })
\`\`\`

**Alert Triggers:**
- Failed authentication attempts (>5 in 1 minute)
- Unusual API access patterns
- Error rate spikes
- New IP addresses accessing sensitive endpoints

**Free Monitoring Tools:**
- Prometheus + Grafana (Metrics)
- ELK Stack (Logging)
- Fail2Ban (Intrusion prevention)

**What to Monitor:**
1. Authentication failures
2. API access patterns
3. Error rates
4. Network traffic anomalies
5. System resource usage

**Alert Channels:**
- Email notifications
- Slack integration
- SMS for critical alerts

Need help setting up specific monitoring?`;
  }

  getAuthenticationResponse() {
    return `JWT Authentication Implementation:

**Step 1: Install Dependencies**
\`\`\`bash
pip install PyJWT flask-jwt-extended
\`\`\`

**Step 2: Add JWT Configuration**
\`\`\`python
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

app.config['JWT_SECRET_KEY'] = 'your-secret-key-change-this'  # Use environment variable!
jwt = JWTManager(app)
\`\`\`

**Step 3: Create Login Endpoint**
\`\`\`python
@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    
    # Validate credentials (use database in production)
    if username == 'admin' and password == 'secure-password':
        access_token = create_access_token(identity=username)
        return jsonify({'token': access_token})
    
    return jsonify({'error': 'Invalid credentials'}), 401
\`\`\`

**Step 4: Protect Endpoints**
\`\`\`python
@app.route('/api/stats')
@jwt_required()
def get_stats():
    # Your existing stats code
    pass
\`\`\`

**Step 5: Frontend Integration**
\`\`\`javascript
// Add token to requests
const token = localStorage.getItem('token');
fetch('/api/stats', {
  headers: { 'Authorization': "Bearer " + token }
});
\`\`\`

**Security Best Practices:**
- Use strong, random JWT secrets
- Set short token expiration (15-30 minutes)
- Implement refresh tokens
- Store secrets in environment variables

Want me to provide the complete authentication system?`;
  }

  getEncryptionResponse() {
    return `HTTPS/TLS Implementation Guide:

**Option 1: Development SSL (Free)**
\`\`\`python
# For development only
from flask_sslify import SSLify

if 'DYNO' in os.environ:  # Heroku
    app = SSLify(app)
\`\`\`

**Option 2: Self-Signed Certificate (Free)**
\`\`\`bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Run Flask with SSL
python main.py --cert cert.pem --key key.pem
\`\`\`

**Option 3: Let's Encrypt (Free, Production-ready)**
\`\`\`bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com
\`\`\`

**Flask HTTPS Configuration:**
\`\`\`python
from flask import Flask
import ssl

app = Flask(__name__)

context = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
context.load_cert_chain('cert.pem', 'key.pem')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=443, ssl_context=context)
\`\`\`

**WebSocket Secure (WSS):**
\`\`\`javascript
// Update WebSocket URL
const wsUrl = "wss://" + window.location.host + "/ws";
const ws = new WebSocket(wsUrl);
\`\`\`

**Security Headers to Add:**
\`\`\`python
@app.after_request
def add_security_headers(response):
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response
\`\`\`

**Certificate Management:**
- Set up automatic renewal (Let's Encrypt)
- Monitor certificate expiration
- Use strong cipher suites
- Disable outdated protocols (SSLv2, SSLv3)

Need help with specific certificate setup?`;
  }

  getContextualResponse(message) {
    let response = `I understand you're asking about "${message}". `;
    
    // Personalize based on context
    if (this.context.expertise === 'beginner') {
      response += 'Since you\'re new to security, let me break this down simply. ';
    } else if (this.context.expertise === 'expert') {
      response += 'Given your expertise, I\'ll provide advanced details. ';
    }
    
    if (this.context.budget === 'limited') {
      response += 'I\'ll focus on cost-effective solutions. ';
    }
    
    if (this.context.timeline === 'urgent') {
      response += 'Here\'s the fastest approach: ';
    }
    
    // Provide relevant information based on security data
    const criticalIssues = this.securityData.vulnerabilities.filter(v => v.severity === 'Critical');
    response += `\n\nYour top security concerns are:\n`;
    criticalIssues.slice(0, 2).forEach((vuln, i) => {
      response += `${i + 1}. ${vuln.category}: ${vuln.description}\n`;
    });
    
    response += `\n**Specific to your question:** `;
    
    // Try to match the query to specific security topics
    if (message.toLowerCase().includes('fix') || message.toLowerCase().includes('solve')) {
      response += this.getImplementationResponse();
    } else if (message.toLowerCase().includes('measure') || message.toLowerCase().includes('metric')) {
      response += 'Key security metrics to track: vulnerability count, compliance score, test coverage, incident response time.';
    } else {
      response += 'I can help you create a customized security plan. Would you like to focus on quick wins, long-term strategy, or specific vulnerabilities?';
    }
    
    return response;
  }

  // Learning capability
  learnFromFeedback(message, feedback) {
    const key = message.toLowerCase();
    if (!this.learningData.has(key)) {
      this.learningData.set(key, []);
    }
    this.learningData.get(key).push({
      feedback,
      timestamp: new Date(),
      context: { ...this.context }
    });
  }

  // Get security recommendations based on context
  getPersonalizedRecommendations() {
    const recommendations = [];
    
    // Budget-based recommendations
    if (this.context.budget === 'limited') {
      recommendations.push({
        title: 'Free Security Fixes',
        items: ['Disable debug mode', 'Add input validation', 'Implement rate limiting']
      });
    }
    
    // Timeline-based recommendations
    if (this.context.timeline === 'urgent') {
      recommendations.push({
        title: 'Critical Fixes Only',
        items: ['Authentication', 'HTTPS setup', 'Input validation']
      });
    }
    
    // Expertise-based recommendations
    if (this.context.expertise === 'beginner') {
      recommendations.push({
        title: 'Beginner-Friendly Start',
        items: ['Configuration fixes', 'Basic logging', 'Simple authentication']
      });
    }
    
    return recommendations;
  }
}

export default SecurityAI;
