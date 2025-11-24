// ===================================
// THEME PERSISTENCE - LOAD IMMEDIATELY
// ===================================

function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'dark';
}

(function() {
  const savedTheme = localStorage.getItem('theme');
  const themeToApply = savedTheme || 'dark';
  
  if (themeToApply === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  console.log('Initial theme loaded:', themeToApply);
})();

// ===================================
// THEME TOGGLE FUNCTIONALITY
// ===================================

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const html = document.documentElement;

// Function to set theme
function setTheme(theme) {
  console.log('Setting theme to:', theme);
  
  if (theme === 'dark') {
    html.setAttribute('data-theme', 'dark');
    // Replace moon with sun icon
    themeIcon.className = 'theme-icon fas fa-sun';
    localStorage.setItem('theme', 'dark');
    console.log('Dark theme saved to localStorage');
  } else {
    html.removeAttribute('data-theme');
    // Replace sun with moon icon
    themeIcon.className = 'theme-icon fas fa-moon';
    localStorage.setItem('theme', 'light');
    console.log('Light theme saved to localStorage');
  }
} 

function getSavedTheme() {
  const saved = localStorage.getItem('theme');
  if (!saved) {
    return 'dark';
  }
  return saved;
}

function toggleTheme() {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

themeToggle.addEventListener('click', toggleTheme);

// ===================================
// CENTERED TAB NAVIGATION SYSTEM
// ===================================

const centeredNavItems = document.querySelectorAll('.centered-nav-item');
const contentSections = document.querySelectorAll('.content-section');

function switchTab(sectionId) {
    // Update centered navigation
    centeredNavItems.forEach(item => item.classList.remove('active'));
    contentSections.forEach(section => section.classList.remove('active'));
    
    const activeNavItem = document.querySelector(`.centered-nav-item[data-section="${sectionId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    const activeSection = document.getElementById(`${sectionId}-section`);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    localStorage.setItem('activeTab', sectionId);
    console.log('Switched to tab:', sectionId);
}

// Initialize centered navigation
centeredNavItems.forEach(item => {
    item.addEventListener('click', () => {
        const sectionId = item.getAttribute('data-section');
        switchTab(sectionId);
    });
});

// ===================================
// PORTFOLIO SUB-TABS
// ===================================

const portfolioTabs = document.querySelectorAll('.portfolio-tab');
const portfolioContents = document.querySelectorAll('.portfolio-content');

portfolioTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const portfolioType = tab.getAttribute('data-portfolio');
    
    portfolioTabs.forEach(t => t.classList.remove('active'));
    portfolioContents.forEach(c => c.classList.remove('active'));
    
    tab.classList.add('active');
    
    const activeContent = document.getElementById(`${portfolioType}-portfolio`);
    if (activeContent) {
      activeContent.classList.add('active');
    }
    
    console.log('Switched to portfolio tab:', portfolioType);
  });
});

// ===================================
// CV DOWNLOAD FUNCTIONALITY
// ===================================

const cvDownloadLink = document.querySelector('a[href*="Ryan_Bertulfo_Resume.pdf"]');

if (cvDownloadLink) {
  cvDownloadLink.addEventListener('click', function(e) {
    showDownloadNotification();
    console.log('CV downloaded at:', new Date().toISOString());
  });
}

function showDownloadNotification() {
  const notification = document.createElement('div');
  notification.className = 'download-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">✓</span>
      <span class="notification-text">CV Download Started</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// ===================================
// SMOOTH SCROLLING
// ===================================

const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===================================
// SCROLL ANIMATIONS
// ===================================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const cards = document.querySelectorAll('.cert-card, .contact-method, .competency-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `all 0.5s ease-out ${index * 0.05}s`;
  });
  
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  cards.forEach(card => cardObserver.observe(card));
}

// ===================================
// SCROLL PROGRESS INDICATOR
// ===================================

let scrollProgress = document.createElement('div');
scrollProgress.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--accent-primary);
  width: 0%;
  z-index: 9999;
  transition: width 0.1s ease;
`;
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
  const contentArea = document.querySelector('.content-area');
  if (contentArea) {
    const scrollHeight = contentArea.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;
    scrollProgress.style.width = Math.min(scrolled, 100) + '%';
  }
});
// ===================================
// SIMPLE LIGHTBOX FOR CERTIFICATES (FIXED VERSION)
// ===================================

// Create lightbox overlay (simple approach)
function createLightbox() {
  if (document.getElementById('lightbox')) {
    return;
  }
  
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <span class="lightbox-close">&times;</span>
      <img class="lightbox-image" src="" alt="Certificate">
      <div class="lightbox-caption"></div>
    </div>
  `;
  
  // Add styles inline for reliability
  lightbox.style.cssText = `
    display: none;
    position: fixed;
    z-index: 99999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.95);
    overflow: auto;
    animation: fadeIn 0.3s;
  `;
  
  const content = lightbox.querySelector('.lightbox-content');
  content.style.cssText = `
    position: relative;
    margin: 2% auto;
    padding: 20px;
    max-width: 95%;
    max-height: 95%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `;
  
  const closeBtn = lightbox.querySelector('.lightbox-close');
  closeBtn.style.cssText = `
    position: absolute;
    top: 20px;
    right: 35px;
    color: #0a19a1ff;
    font-size: 50px;
    font-weight: bold;
    cursor: pointer;
    z-index: 100000;
    transition: 0.3s;
    line-height: 1;
    user-select: none;
  `;
  
  const img = lightbox.querySelector('.lightbox-image');
  img.style.cssText = `
    max-width: 90%;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    animation: zoomIn 0.3s;
  `;
  
  const caption = lightbox.querySelector('.lightbox-caption');
  caption.style.cssText = `
    color: #fff;
    text-align: center;
    padding: 20px;
    font-size: 1.2rem;
    max-width: 90%;
  `;
  
  document.body.appendChild(lightbox);
  
  // Close on X button
  closeBtn.onclick = function() {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  };
  
  // Close on background click
  lightbox.onclick = function(e) {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  };
  
  // Close on ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.style.display === 'block') {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
  
  console.log('✅ Lightbox created');
}

// Open lightbox with image
function openLightbox(imgSrc, title, issuer) {
  const lightbox = document.getElementById('lightbox');
  const img = lightbox.querySelector('.lightbox-image');
  const caption = lightbox.querySelector('.lightbox-caption');
  
  img.src = imgSrc;
  img.alt = title;
  caption.innerHTML = `<strong>${title}</strong><br>${issuer}`;
  
  lightbox.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  console.log('🖼️ Lightbox opened:', title);
}

// SIMPLER FIX: Setup certificate click handlers
// SIMPLER FIX: Setup certificate click handlers with mixed behavior
function setupCertificateClicks() {
  const certCards = document.querySelectorAll('.cert-card');
  
  console.log(`🎯 Setting up clicks for ${certCards.length} certificates`);
  
  certCards.forEach((card) => {
    // Handle card clicks (for zoom)
    card.onclick = function(e) {
      // Don't trigger if clicking any button
      if (e.target.classList.contains('cert-btn') || e.target.closest('.cert-btn')) {
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      const imgElement = card.querySelector('.cert-image-container img');
      const title = card.querySelector('.cert-title')?.textContent || 'Certificate';
      const issuer = card.querySelector('.cert-issuer')?.textContent || '';
      
      console.log(`🖱️ Certificate card clicked: ${title}`);
      
      if (imgElement && imgElement.src && !imgElement.src.includes('data:image/svg')) {
        openLightbox(imgElement.src, title, issuer);
      } else {
        alert(`Certificate: ${title}\nIssuer: ${issuer}\n\nImage not available for preview.`);
      }
    };
    
    // Handle button clicks specifically
    const certBtn = card.querySelector('.cert-btn');
    if (certBtn) {
      certBtn.onclick = function(e) {
        e.stopPropagation(); // Prevent card click from firing
        
        const action = this.getAttribute('data-action');
        const title = card.querySelector('.cert-title')?.textContent || 'Certificate';
        
        console.log(`🔘 Certificate button clicked: ${title} (Action: ${action})`);
        
        if (action === 'zoom') {
          e.preventDefault();
          const imgElement = card.querySelector('.cert-image-container img');
          const issuer = card.querySelector('.cert-issuer')?.textContent || '';
          
          if (imgElement && imgElement.src && !imgElement.src.includes('data:image/svg')) {
            openLightbox(imgElement.src, title, issuer);
          } else {
            alert(`Certificate: ${title}\nIssuer: ${issuer}\n\nImage not available for preview.`);
          }
        }
        // If action is 'link' or no action specified, let the link work normally
      };
    }
    
    card.style.cursor = 'pointer';
  });
  
  console.log('✅ All certificate clicks configured with mixed behavior');
}
    
// ===================================
// KEYBOARD NAVIGATION
// ===================================

document.addEventListener('keydown', (e) => {
  if (e.altKey) {
    switch(e.key) {
      case '1':
        switchTab('about');
        break;
      case '2':
        switchTab('resume');
        break;
      case '3':
        switchTab('portfolio');
        break;
      case '4':
        switchTab('contact');
        break;
    }
  }
});

// ===================================
// INITIALIZE ON PAGE LOAD (FIXED VERSION)
// ===================================

document.addEventListener('DOMContentLoaded', function() {
  // Load saved theme preference and update icon
  const savedTheme = getSavedTheme();
  
  // Update icon based on current theme
  if (savedTheme === 'dark') {
    themeIcon.className = 'theme-icon fas fa-sun';
  } else {
    themeIcon.className = 'theme-icon fas fa-moon';
  }
  
  // Load saved tab - update to use centered navigation
  const savedTab = localStorage.getItem('activeTab') || 'about';
  switchTab(savedTab);
  
  // Initialize animations
  initScrollAnimations();
  
  // Create lightbox
  createLightbox();
  
  // FIXED: Setup certificate clicks immediately but only if portfolio is active
  if (savedTab === 'portfolio') {
    setTimeout(() => {
      setupCertificateClicks();
    }, 100);
  }
  
  // FIXED: Better event listener for portfolio tab switching
  centeredNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const sectionId = item.getAttribute('data-section');
      if (sectionId === 'portfolio') {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
          setupCertificateClicks();
        }, 50);
      }
    });
  });
  
  // FIXED: Also handle portfolio sub-tabs
  portfolioTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setTimeout(() => {
        setupCertificateClicks();
      }, 50);
    });
  });
  
  console.log('✅ Portfolio initialized with centered layout!');
});
// ===================================
// PRIVATE ANALYTICS DASHBOARD
// ===================================

class PrivateAnalytics {
    constructor() {
        this.storageKey = 'portfolio_analytics_data';
        this.adminKey = 'portfolio_admin_mode';
        this.init();
    }

    init() {
        this.trackVisit();
        this.setupAdminAccess();
    }

    trackVisit() {
        const data = this.getAnalyticsData();
        
        // Update visitor stats
        data.totalVisits = (data.totalVisits || 0) + 1;
        
        // Track unique visitors (by day)
        const today = new Date().toDateString();
        if (!data.dailyVisits) data.dailyVisits = {};
        data.dailyVisits[today] = (data.dailyVisits[today] || 0) + 1;
        
        // Update last visit
        data.lastVisit = new Date().toISOString();
        
        this.saveAnalyticsData(data);
    }

    getAnalyticsData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            return {};
        }
    }

    saveAnalyticsData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
        } catch (error) {
            console.log('Could not save analytics data');
        }
    }

    setupAdminAccess() {
        // Secret key combination to show analytics (Ctrl+Shift+Q)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'Q') {
                e.preventDefault();
                this.toggleAdminMode();
            }
        });
    }

    toggleAdminMode() {
        const isAdmin = localStorage.getItem(this.adminKey) === 'true';
        localStorage.setItem(this.adminKey, (!isAdmin).toString());
        
        if (!isAdmin) {
            this.showAnalyticsPanel();
            console.log('🔓 Analytics mode activated');
        } else {
            this.hideAnalyticsPanel();
            console.log('🔒 Analytics mode deactivated');
        }
    }

    showAnalyticsPanel() {
        const analyticsPanel = document.getElementById('admin-analytics');
        const panel = analyticsPanel.querySelector('.analytics-panel');
        const toggleBtn = analyticsPanel.querySelector('.analytics-toggle');
        
        analyticsPanel.style.display = 'block';
        panel.classList.add('show');
        toggleBtn.style.display = 'flex';
        
        this.updateAnalyticsDisplay();
    }

    hideAnalyticsPanel() {
        const analyticsPanel = document.getElementById('admin-analytics');
        const panel = analyticsPanel.querySelector('.analytics-panel');
        const toggleBtn = analyticsPanel.querySelector('.analytics-toggle');
        
        panel.classList.remove('show');
        // Keep toggle button visible but hide panel
    }

    updateAnalyticsDisplay() {
        const data = this.getAnalyticsData();
        
        // Calculate unique visitors (count unique days)
        const uniqueVisitors = data.dailyVisits ? Object.keys(data.dailyVisits).length : 0;
        
        document.getElementById('admin-total-visitors').textContent = data.totalVisits || 0;
        document.getElementById('admin-unique-visitors').textContent = uniqueVisitors;
        
        if (data.lastVisit) {
            const lastVisit = new Date(data.lastVisit);
            document.getElementById('admin-last-visit').textContent = 
                lastVisit.toLocaleDateString() + ' ' + lastVisit.toLocaleTimeString();
        }
    }
}

// Toggle function for the button
function toggleAnalytics() {
    const panel = document.querySelector('.analytics-panel');
    panel.classList.toggle('show');
}

// Initialize private analytics
const privateAnalytics = new PrivateAnalytics();