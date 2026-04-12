export const securityReportData = {
  // Overall security assessment
  overallScore: 3,
  riskLevel: 'Critical',
  lastAssessed: new Date().toISOString(),
  
  // SSDLC Phase Analysis - Based on actual codebase assessment
  phases: {
    requirements: {
      status: 'incomplete',
      score: 2,
      issues: [
        'No data retention policies defined for captured network packets',
        'Missing access control requirements for packet capture functionality',
        'No privacy compliance framework for network data processing',
        'No security requirements documentation in project',
        'Missing data handling policies for sensitive network information'
      ],
      recommendations: [
        'Define data classification and retention policies for packet data',
        'Document authentication and authorization requirements for network monitoring',
        'Implement privacy by design principles for network data collection',
        'Create security requirements specification document',
        'Establish data minimization policies for captured packets'
      ]
    },
    
    design: {
      status: 'vulnerable',
      score: 1,
      issues: [
        'No authentication mechanism designed in application architecture',
        'Overly permissive CORS configuration (localhost:3000 only)',
        'No threat modeling performed for network monitoring application',
        'Missing secure architecture patterns for sensitive data handling',
        'No role-based access control design',
        'Insecure API design without authentication layers'
      ],
      recommendations: [
        'Design JWT-based authentication system with role-based access',
        'Implement principle of least privilege for network data access',
        'Create comprehensive threat model (STRIDE) for packet capture system',
        'Design secure API architecture with proper authentication',
        'Add rate limiting and input validation at design level',
        'Design secure data flow for captured network packets'
      ]
    },
    
    development: {
      status: 'vulnerable',
      score: 2,
      issues: [
        'Debug mode enabled in production (main.py:416)',
        'Hardcoded localhost configurations in CORS',
        'Insufficient input validation on packet filter parameters',
        'Silent exception handling in packet processing',
        'No security headers implemented',
        'Missing environment variable usage for sensitive config',
        'No input sanitization for API parameters'
      ],
      recommendations: [
        'Disable debug mode in production environment',
        'Use environment variables for CORS and configuration',
        'Implement comprehensive input validation for all API endpoints',
        'Add proper error handling and security logging',
        'Implement security headers (HSTS, CSP, etc.)',
        'Add rate limiting and request validation middleware',
        'Sanitize all user inputs and packet filter parameters'
      ]
    },
    
    testing: {
      status: 'missing',
      score: 0,
      issues: [
        'No unit tests for security-critical components',
        'No static analysis security testing implemented',
        'Missing dynamic security testing for API endpoints',
        'No penetration testing performed on network monitoring features',
        'No vulnerability scanning in CI/CD pipeline',
        'No security testing for packet capture functionality',
        'Missing authentication and authorization testing'
      ],
      recommendations: [
        'Implement SAST with Bandit for Python and ESLint security plugins',
        'Set up DAST with OWASP ZAP for API security testing',
        'Conduct regular penetration testing on network monitoring features',
        'Integrate vulnerability scanning in development workflow',
        'Add unit tests for authentication and input validation',
        'Implement security testing for packet capture and data handling',
        'Set up automated security testing in CI/CD pipeline'
      ]
    },
    
    deployment: {
      status: 'vulnerable',
      score: 2,
      issues: [
        'No HTTPS/TLS encryption implemented',
        'Debug mode exposed in production deployment',
        'Missing security headers in HTTP responses',
        'No containerization or isolation for backend services',
        'No environment-specific configuration management',
        'Insecure CORS policy in production',
        'No API rate limiting implemented',
        'Missing network security controls'
      ],
      recommendations: [
        'Implement SSL/TLS certificates for HTTPS',
        'Configure production environment properly (disable debug)',
        'Add comprehensive security headers (HSTS, CSP, X-Frame-Options)',
        'Use containerization for service isolation',
        'Implement environment-specific configuration management',
        'Restrict CORS to specific production domains',
        'Add API rate limiting and DDoS protection',
        'Implement network security controls and firewalls'
      ]
    },
    
    maintenance: {
      status: 'missing',
      score: 1,
      issues: [
        'No security event logging implemented',
        'Missing audit trails for packet capture and data access',
        'No intrusion detection system for network monitoring',
        'No security monitoring and alerting system',
        'No log management for security events',
        'Missing incident response procedures',
        'No regular security patch management process',
        'No backup and recovery procedures for security incidents'
      ],
      recommendations: [
        'Implement comprehensive security logging for all operations',
        'Create audit trail for packet capture and data access events',
        'Set up intrusion detection system for suspicious activities',
        'Establish security monitoring and alerting system',
        'Implement centralized log management and analysis',
        'Create incident response procedures and escalation matrix',
        'Establish regular security patch management schedule',
        'Implement backup and disaster recovery procedures'
      ]
    }
  },
  
  // Vulnerability findings with OWASP mapping
  vulnerabilities: [
    {
      id: 'A01_BROKEN_ACCESS_CONTROL',
      category: 'Broken Access Control',
      owaspRank: 1,
      severity: 'Critical',
      description: 'No authentication or authorization mechanism implemented',
      impact: 'Unauthorized access to all system functionality and data',
      location: 'Entire application',
      remediation: 'Implement JWT-based authentication with role-based access control',
      cwe: 'CWE-287',
      cvss: 9.8
    },
    {
      id: 'A02_CRYPTOGRAPHIC_FAILURES',
      category: 'Cryptographic Failures',
      owaspRank: 2,
      severity: 'Critical',
      description: 'No encryption for data in transit or at rest',
      impact: 'Sensitive network data can be intercepted and exposed',
      location: 'All API endpoints and WebSocket connections',
      remediation: 'Implement TLS/HTTPS and encrypt sensitive data',
      cwe: 'CWE-319',
      cvss: 8.6
    },
    {
      id: 'A05_SECURITY_MISCONFIGURATION',
      category: 'Security Misconfiguration',
      owaspRank: 5,
      severity: 'High',
      description: 'Debug mode enabled and overly permissive CORS',
      impact: 'Information disclosure and potential CSRF attacks',
      location: 'main.py:416, main.py:17',
      remediation: 'Disable debug mode and restrict CORS origins',
      cwe: 'CWE-16',
      cvss: 7.5
    },
    {
      id: 'A03_INJECTION',
      category: 'Injection',
      owaspRank: 3,
      severity: 'Medium',
      description: 'Insufficient input validation on packet filters',
      impact: 'Potential injection attacks through filter parameters',
      location: 'main.py:318-375',
      remediation: 'Implement comprehensive input validation and sanitization',
      cwe: 'CWE-20',
      cvss: 6.1
    },
    {
      id: 'A07_IDENTIFICATION_AUTHENTICATION',
      category: 'Identification & Authentication Failures',
      owaspRank: 7,
      severity: 'Critical',
      description: 'No user authentication system implemented',
      impact: 'Anyone can access and control the application',
      location: 'Entire application',
      remediation: 'Implement secure authentication framework',
      cwe: 'CWE-287',
      cvss: 9.8
    }
  ],
  
  // Priority action plan
  actionPlan: [
    {
      phase: 'Immediate (Week 1-2)',
      actions: [
        {
          title: 'Disable Debug Mode',
          priority: 'Critical',
          effort: 'Low',
          description: 'Remove debug=True from production configuration',
          files: ['backend/main.py'],
          impact: 'Prevents information disclosure'
        },
        {
          title: 'Fix CORS Configuration',
          priority: 'High',
          effort: 'Low',
          description: 'Restrict CORS to specific origins only',
          files: ['backend/main.py'],
          impact: 'Prevents CSRF attacks'
        },
        {
          title: 'Add Input Validation',
          priority: 'High',
          effort: 'Medium',
          description: 'Validate and sanitize all user inputs',
          files: ['backend/main.py'],
          impact: 'Prevents injection attacks'
        }
      ]
    },
    {
      phase: 'Short Term (Week 3-4)',
      actions: [
        {
          title: 'Implement TLS/HTTPS',
          priority: 'Critical',
          effort: 'Medium',
          description: 'Configure SSL certificates and HTTPS',
          files: ['backend/main.py', 'frontend/package.json'],
          impact: 'Encrypts all communications'
        },
        {
          title: 'Basic Authentication',
          priority: 'Critical',
          effort: 'High',
          description: 'Implement JWT-based authentication',
          files: ['backend/main.py', 'frontend/src'],
          impact: 'Secures application access'
        }
      ]
    },
    {
      phase: 'Medium Term (Week 5-8)',
      actions: [
        {
          title: 'Security Testing Framework',
          priority: 'High',
          effort: 'Medium',
          description: 'Set up SAST, DAST, and penetration testing',
          files: ['CI/CD configuration'],
          impact: 'Continuous security validation'
        },
        {
          title: 'Security Monitoring',
          priority: 'Medium',
          effort: 'High',
          description: 'Implement logging and monitoring systems',
          files: ['backend/main.py'],
          impact: 'Detects and responds to threats'
        }
      ]
    }
  ],
  
  // Compliance and regulatory requirements
  compliance: {
    gdpr: {
      status: 'Non-compliant',
      gaps: [
        'No data protection impact assessment',
        'Missing user consent mechanisms',
        'No data retention policies',
        'Lack of privacy by design implementation'
      ],
      recommendations: [
        'Conduct DPIA for network data processing',
        'Implement user consent for data collection',
        'Define data retention and deletion policies',
        'Apply privacy by design principles'
      ]
    },
    
    sox: {
      status: 'Non-compliant',
      gaps: [
        'No audit trails for data access',
        'Missing security event logging',
        'No internal controls documentation'
      ],
      recommendations: [
        'Implement comprehensive audit logging',
        'Create security event monitoring',
        'Document security controls and procedures'
      ]
    },
    
    pci: {
      status: 'Not applicable',
      notes: 'Application does not process payment card data'
    }
  },
  
  // Security metrics and KPIs
  metrics: {
    current: {
      vulnerabilities: { critical: 3, high: 4, medium: 2, low: 0 },
      complianceScore: 15,
      securityScore: 3,
      testCoverage: 0
    },
    target: {
      vulnerabilities: { critical: 0, high: 1, medium: 3, low: 5 },
      complianceScore: 85,
      securityScore: 8,
      testCoverage: 80
    }
  }
};

export default securityReportData;
