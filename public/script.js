// Enhanced Social Network JavaScript

// Global state management
const AppState = {
  currentUser: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    status: 'online'
  },
  rooms: [],
  filteredRooms: [],
  currentView: 'grid',
  theme: localStorage.getItem('theme') || 'dark',
  notifications: [
    {
      id: 1,
      type: 'user-join',
      message: 'Sarah joined "Tech Talk" room',
      time: '2 minutes ago',
      icon: 'fas fa-user-plus'
    },
    {
      id: 2,
      type: 'message',
      message: 'New message in "Music Lovers"',
      time: '5 minutes ago',
      icon: 'fas fa-message'
    },
    {
      id: 3,
      type: 'meeting',
      message: 'Meeting started in "Project Alpha"',
      time: '10 minutes ago',
      icon: 'fas fa-video'
    }
  ],
  currentMeeting: null,
  searchSuggestions: ['Tech Talk', 'Music Lovers', 'Sports Arena', 'Study Group', 'Gaming Zone']
};

// Initialize app when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  loadRooms();
  setupEventListeners();
  applyTheme();
  updateStats();
});

// App initialization
function initializeApp() {
  updateUserProfile();
  setupSearch();
  setupFormValidation();
  setupKeyboardShortcuts();
}

// Event listeners setup
function setupEventListeners() {
  // Search functionality
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchInput.addEventListener('focus', showSearchSuggestions);
    searchInput.addEventListener('blur', hideSearchSuggestions);
  }

  // Filter changes
  document.getElementById('language-filter')?.addEventListener('change', filterRooms);
  document.getElementById('topic-filter')?.addEventListener('change', filterRooms);
  document.getElementById('size-filter')?.addEventListener('change', filterRooms);
  document.getElementById('sort-by')?.addEventListener('change', sortRooms);

  // Form character counters
  setupCharacterCounters();

  // Close modals on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      hideCreateRoomModal();
      closeMeeting();
      toggleNotifications(false);
      toggleProfileMenu(false);
    }
  });

  // Close panels when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.notification-panel') && !e.target.closest('.notification-bell')) {
      toggleNotifications(false);
    }
    if (!e.target.closest('.profile-menu') && !e.target.closest('.profile-info')) {
      toggleProfileMenu(false);
    }
  });
}

// Theme management
function toggleTheme() {
  AppState.theme = AppState.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', AppState.theme);
  applyTheme();
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', AppState.theme);
  const themeIcon = document.getElementById('theme-icon');
  if (themeIcon) {
    themeIcon.className = AppState.theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

// User profile management
function updateUserProfile() {
  const usernameEl = document.getElementById('username');
  if (usernameEl) {
    usernameEl.textContent = AppState.currentUser.name;
  }
}

// Search functionality
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  const suggestionsEl = document.getElementById('search-suggestions');

  if (!searchInput || !suggestionsEl) return;

  // Populate search suggestions
  const suggestionsHtml = AppState.searchSuggestions.map(suggestion =>
    `<div class="search-suggestion" onclick="selectSearchSuggestion('${suggestion}')">${suggestion}</div>`
  ).join('');

  suggestionsEl.innerHTML = suggestionsHtml;
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();

  if (query === '') {
    AppState.filteredRooms = [...AppState.rooms];
  } else {
    AppState.filteredRooms = AppState.rooms.filter(room =>
      room.room_id.toLowerCase().includes(query) ||
      room.email.toLowerCase().includes(query) ||
      room.topic?.toLowerCase().includes(query)
    );
  }

  renderRooms();
  updateStats();
}

function showSearchSuggestions() {
  const suggestionsEl = document.getElementById('search-suggestions');
  if (suggestionsEl) {
    suggestionsEl.style.display = 'block';
  }
}

function hideSearchSuggestions() {
  setTimeout(() => {
    const suggestionsEl = document.getElementById('search-suggestions');
    if (suggestionsEl) {
      suggestionsEl.style.display = 'none';
    }
  }, 200);
}

function selectSearchSuggestion(suggestion) {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = suggestion;
    handleSearch({ target: searchInput });
  }
  hideSearchSuggestions();
}

function performSearch() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    handleSearch({ target: searchInput });
  }
}

// Notification management
function toggleNotifications(force) {
  const panel = document.getElementById('notification-panel');
  if (!panel) return;

  const isActive = panel.classList.contains('active');

  if (force !== undefined) {
    panel.classList.toggle('active', force);
  } else {
    panel.classList.toggle('active', !isActive);
  }
}

// Profile menu management
function toggleProfileMenu(force) {
  const menu = document.getElementById('profile-menu');
  const profileInfo = document.querySelector('.profile-info');
  if (!menu || !profileInfo) return;

  const isActive = menu.classList.contains('active');

  if (force !== undefined) {
    menu.classList.toggle('active', force);
    profileInfo.classList.toggle('active', force);
  } else {
    menu.classList.toggle('active', !isActive);
    profileInfo.classList.toggle('active', !isActive);
  }
}

function editProfile() {
  alert('Edit Profile functionality would be implemented here');
  toggleProfileMenu(false);
}

function openSettings() {
  alert('Settings panel would be implemented here');
  toggleProfileMenu(false);
}

function viewHistory() {
  alert('Room history would be implemented here');
  toggleProfileMenu(false);
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    alert('Logout functionality would be implemented here');
  }
  toggleProfileMenu(false);
}

// Room management
async function loadRooms() {
  const container = document.getElementById('rooms-container');
  if (!container) return;

  // Show loading spinner
  container.innerHTML = `
    <div class="loading-spinner">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Loading rooms...</p>
    </div>
  `;

  try {
    // Try to fetch from API, fallback to mock data
    let data;
    try {
      const response = await fetch('/v1/rooms');
      data = await response.json();
    } catch (error) {
      console.log('Using mock data...');
      data = generateMockRooms();
    }

    if (data.success && Array.isArray(data.rooms)) {
      AppState.rooms = data.rooms;
    } else if (Array.isArray(data)) {
      AppState.rooms = data;
    } else {
      AppState.rooms = generateMockRooms().rooms;
    }

    AppState.filteredRooms = [...AppState.rooms];
    renderRooms();
    updateStats();
  } catch (error) {
    console.error('Error loading rooms:', error);
    container.innerHTML = `
      <div class="loading-spinner">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Error loading rooms. Please try again.</p>
        <button onclick="loadRooms()" class="btn-primary">Retry</button>
      </div>
    `;
  }
}

function generateMockRooms() {
  const topics = ['tech', 'sports', 'music', 'education', 'gaming', 'business'];
  const languages = ['en', 'es', 'fr', 'de', 'it'];
  const names = ['Tech Talk', 'Music Lovers', 'Sports Arena', 'Study Group', 'Gaming Zone', 'Business Network', 'Creative Minds', 'Book Club', 'Movie Night', 'Cooking Masters'];

  const rooms = [];
  for (let i = 0; i < 12; i++) {
    rooms.push({
      room_id: names[i] || `Room ${i + 1}`,
      email: `host${i + 1}@example.com`,
      room_url: `https://meet.jit.si/room-${i + 1}`,
      is_closed: Math.random() > 0.7,
      participants: Math.floor(Math.random() * 20) + 1,
      topic: topics[Math.floor(Math.random() * topics.length)],
      language: languages[Math.floor(Math.random() * languages.length)],
      description: `This is an exciting ${topics[Math.floor(Math.random() * topics.length)]} room where people gather to discuss and share ideas.`,
      created_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      country: ['US', 'UK', 'FR', 'DE', 'IT', 'ES'][Math.floor(Math.random() * 6)]
    });
  }

  return { success: true, rooms };
}

function renderRooms() {
  const container = document.getElementById('rooms-container');
  if (!container) return;

  if (AppState.filteredRooms.length === 0) {
    container.innerHTML = `
      <div class="loading-spinner">
        <i class="fas fa-search"></i>
        <p>No rooms found matching your criteria.</p>
        <button onclick="showCreateRoomModal()" class="btn-primary">Create a Room</button>
      </div>
    `;
    return;
  }

  const roomsHtml = AppState.filteredRooms.map(room => createRoomCard(room)).join('');
  container.innerHTML = roomsHtml;
}

function createRoomCard(room) {
  const statusClass = room.is_closed ? 'closed' : 'open';
  const statusText = room.is_closed ? 'Closed' : 'Open';
  const statusIcon = room.is_closed ? '🔒' : '✅';

  const topicIcons = {
    tech: 'fas fa-laptop-code',
    sports: 'fas fa-futbol',
    music: 'fas fa-music',
    education: 'fas fa-graduation-cap',
    gaming: 'fas fa-gamepad',
    business: 'fas fa-briefcase'
  };

  const languageNames = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian'
  };

  return `
    <div class="room" data-topic="${room.topic}" data-language="${room.language}" data-participants="${room.participants}">
      <div class="room-header">
        <h2>${room.room_id}</h2>
        <span class="room-status ${statusClass}">${statusIcon} ${statusText}</span>
      </div>

      ${room.description ? `<p class="room-description">${room.description}</p>` : ''}

      <div class="room-meta">
        <div class="room-meta-item">
          <i class="fas fa-user"></i>
          <span>Host: <span class="room-host">${room.email.split('@')[0]}</span></span>
        </div>
        <div class="room-meta-item">
          <i class="fas fa-users"></i>
          <span>${room.participants || 0} participants</span>
        </div>
        <div class="room-meta-item">
          <i class="fas fa-globe"></i>
          <span>${room.country || 'Unknown'}</span>
        </div>
        <div class="room-meta-item">
          <i class="fas fa-clock"></i>
          <span>${formatTime(room.created_at)}</span>
        </div>
      </div>

      <div class="room-tags">
        <span class="room-tag">
          <i class="${topicIcons[room.topic] || 'fas fa-tag'}"></i>
          ${room.topic || 'General'}
        </span>
        <span class="room-tag">
          <i class="fas fa-language"></i>
          ${languageNames[room.language] || room.language || 'English'}
        </span>
      </div>

      <div class="room-actions">
        <button class="join-button" onclick="joinRoom('${room.room_url}', '${room.room_id}')" ${room.is_closed ? 'disabled' : ''}>
          <i class="fas fa-video"></i>
          ${room.is_closed ? 'Room Closed' : 'Join Room'}
        </button>
        <button class="room-action-btn" onclick="favoriteRoom('${room.room_id}')" title="Add to Favorites">
          <i class="far fa-heart"></i>
        </button>
        <button class="room-action-btn" onclick="shareRoom('${room.room_url}')" title="Share Room">
          <i class="fas fa-share"></i>
        </button>
      </div>
    </div>
  `;
}

function formatTime(dateString) {
  if (!dateString) return 'Unknown';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}

// Room filtering and sorting
function filterRooms() {
  const languageFilter = document.getElementById('language-filter')?.value || '';
  const topicFilter = document.getElementById('topic-filter')?.value || '';
  const sizeFilter = document.getElementById('size-filter')?.value || '';

  AppState.filteredRooms = AppState.rooms.filter(room => {
    const languageMatch = !languageFilter || room.language === languageFilter;
    const topicMatch = !topicFilter || room.topic === topicFilter;

    let sizeMatch = true;
    if (sizeFilter) {
      const participants = room.participants || 0;
      switch (sizeFilter) {
        case 'small':
          sizeMatch = participants <= 5;
          break;
        case 'medium':
          sizeMatch = participants > 5 && participants <= 15;
          break;
        case 'large':
          sizeMatch = participants > 15;
          break;
      }
    }

    return languageMatch && topicMatch && sizeMatch;
  });

  renderRooms();
  updateStats();
}

function sortRooms() {
  const sortBy = document.getElementById('sort-by')?.value || 'created';

  AppState.filteredRooms.sort((a, b) => {
    switch (sortBy) {
      case 'participants':
        return (b.participants || 0) - (a.participants || 0);
      case 'name':
        return a.room_id.localeCompare(b.room_id);
      case 'created':
      default:
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    }
  });

  renderRooms();
}

// View management
function setView(viewType) {
  AppState.currentView = viewType;

  // Update view buttons
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewType);
  });

  // Update container class
  const container = document.getElementById('rooms-container');
  if (container) {
    container.className = `container ${viewType === 'list' ? 'list-view' : ''}`;
  }
}

// Statistics update
function updateStats() {
  const activeRooms = AppState.filteredRooms.filter(room => !room.is_closed).length;
  const totalUsers = AppState.filteredRooms.reduce((sum, room) => sum + (room.participants || 0), 0);
  const countries = new Set(AppState.filteredRooms.map(room => room.country).filter(Boolean)).size;

  document.getElementById('active-rooms').textContent = activeRooms;
  document.getElementById('online-users').textContent = totalUsers;
  document.getElementById('countries').textContent = countries;
}

// Room actions
function joinRoom(roomUrl, roomName) {
  if (!roomUrl || !roomName) return;

  AppState.currentMeeting = {
    url: roomUrl,
    name: roomName
  };

  startJitsiMeeting(roomName, roomUrl);
}

function favoriteRoom(roomId) {
  // In a real app, this would save to user preferences
  console.log('Added to favorites:', roomId);
  showToast('Room added to favorites!', 'success');
}

function shareRoom(roomUrl) {
  if (navigator.share) {
    navigator.share({
      title: 'Join this room',
      url: roomUrl
    });
  } else {
    navigator.clipboard.writeText(roomUrl).then(() => {
      showToast('Room URL copied to clipboard!', 'success');
    });
  }
}

// Create room modal management
function showCreateRoomModal() {
  const modal = document.getElementById('create-room-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus on room name input
    setTimeout(() => {
      document.getElementById('room-name')?.focus();
    }, 300);
  }
}

function hideCreateRoomModal() {
  const modal = document.getElementById('create-room-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';

    // Reset form
    resetCreateRoomForm();
  }
}

function resetCreateRoomForm() {
  document.getElementById('room-name').value = '';
  document.getElementById('room-description').value = '';
  document.getElementById('room-language').value = 'en';
  document.getElementById('room-topic').value = 'tech';
  document.querySelector('input[name="privacy"][value="public"]').checked = true;
  document.getElementById('enable-recording').checked = false;

  // Reset character counters
  updateCharacterCount('room-name', 50);
  updateCharacterCount('room-description', 200);
}

// Form validation and character counting
function setupCharacterCounters() {
  const roomNameInput = document.getElementById('room-name');
  const roomDescInput = document.getElementById('room-description');

  if (roomNameInput) {
    roomNameInput.addEventListener('input', () => updateCharacterCount('room-name', 50));
  }

  if (roomDescInput) {
    roomDescInput.addEventListener('input', () => updateCharacterCount('room-description', 200));
  }
}

function updateCharacterCount(inputId, maxLength) {
  const input = document.getElementById(inputId);
  const counter = input?.parentElement.querySelector('.char-count');

  if (input && counter) {
    const currentLength = input.value.length;
    counter.textContent = `${currentLength}/${maxLength}`;
    counter.style.color = currentLength > maxLength * 0.9 ? 'var(--error-color)' : 'var(--text-muted)';
  }
}

function setupFormValidation() {
  const form = document.getElementById('create-room-modal');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    createRoom();
  });
}

// Room creation
async function createRoom() {
  const roomName = document.getElementById('room-name')?.value.trim();
  const description = document.getElementById('room-description')?.value.trim();
  const language = document.getElementById('room-language')?.value;
  const topic = document.getElementById('room-topic')?.value;
  const privacy = document.querySelector('input[name="privacy"]:checked')?.value;
  const enableRecording = document.getElementById('enable-recording')?.checked;

  // Validation
  if (!roomName) {
    showToast('Please enter a room name', 'error');
    return;
  }

  if (roomName.length > 50) {
    showToast('Room name is too long', 'error');
    return;
  }

  // Show loading state
  const createBtn = document.querySelector('.btn-primary');
  const originalText = createBtn.innerHTML;
  createBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
  createBtn.disabled = true;

  try {
    // Try to create room via API
    const roomData = {
      roomName,
      description,
      language,
      topic,
      privacy,
      enableRecording
    };

    let response;
    try {
      response = await fetch('/v1/jitsi/create-meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData)
      });
    } catch (error) {
      console.log('API not available, creating local room...');
    }

    // Create room locally and start meeting
    const newRoom = {
      room_id: roomName,
      email: AppState.currentUser.email,
      room_url: `https://meet.jit.si/${encodeURIComponent(roomName)}`,
      is_closed: false,
      participants: 1,
      topic,
      language,
      description,
      created_at: new Date().toISOString(),
      country: 'US'
    };

    // Add to rooms list
    AppState.rooms.unshift(newRoom);
    AppState.filteredRooms = [...AppState.rooms];

    // Hide modal and start meeting
    hideCreateRoomModal();
    showToast('Room created successfully!', 'success');

    // Start the meeting
    setTimeout(() => {
      startJitsiMeeting(roomName, newRoom.room_url);
    }, 500);

    // Update UI
    renderRooms();
    updateStats();

  } catch (error) {
    console.error('Error creating room:', error);
    showToast('Failed to create room. Please try again.', 'error');
  } finally {
    // Reset button state
    createBtn.innerHTML = originalText;
    createBtn.disabled = false;
  }
}

// Jitsi meeting management
function startJitsiMeeting(roomName, roomUrl) {
  const meetingOverlay = document.getElementById('meeting-overlay');
  const meetingTitle = document.getElementById('meeting-title');
  const jitsiContainer = document.getElementById('jitsi-container');

  if (!meetingOverlay || !jitsiContainer) return;

  // Show meeting overlay
  meetingOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Update meeting title
  if (meetingTitle) {
    meetingTitle.textContent = roomName;
  }

  // Clear previous meeting
  jitsiContainer.innerHTML = '';

  // Initialize Jitsi
  const options = {
    roomName: roomName,
    parentNode: jitsiContainer,
    width: '100%',
    height: '100%',
    userInfo: {
      displayName: AppState.currentUser.name,
      email: AppState.currentUser.email
    },
    configOverwrite: {
      startWithAudioMuted: true,
      startWithVideoMuted: false,
      enableWelcomePage: false,
      prejoinPageEnabled: false,
      toolbarButtons: [
        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
        'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
        'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone'
      ]
    }
  };

  try {
    const api = new JitsiMeetExternalAPI('meet.jit.si', options);

    // Event listeners
    api.addEventListener('videoConferenceJoined', function(event) {
      console.log('Joined meeting:', event);
      showToast('Successfully joined the meeting!', 'success');
    });

    api.addEventListener('videoConferenceLeft', function(event) {
      console.log('Left meeting:', event);
      closeMeeting();
    });

    api.addEventListener('participantJoined', function(event) {
      console.log('Participant joined:', event);
      updateParticipantCount(roomName, 1);
    });

    api.addEventListener('participantLeft', function(event) {
      console.log('Participant left:', event);
      updateParticipantCount(roomName, -1);
    });

    // Store API reference
    AppState.currentMeetingApi = api;

  } catch (error) {
    console.error('Error starting Jitsi meeting:', error);
    showToast('Failed to start meeting. Please try again.', 'error');
    closeMeeting();
  }
}

function updateParticipantCount(roomName, change) {
  const room = AppState.rooms.find(r => r.room_id === roomName);
  if (room) {
    room.participants = Math.max(0, (room.participants || 0) + change);
    renderRooms();
    updateStats();
  }
}

function toggleFullscreen() {
  const jitsiContainer = document.getElementById('jitsi-container');
  if (!jitsiContainer) return;

  if (!document.fullscreenElement) {
    jitsiContainer.requestFullscreen().catch(err => {
      console.error('Error attempting to enable fullscreen:', err);
    });
  } else {
    document.exitFullscreen();
  }
}

function closeMeeting() {
  const meetingOverlay = document.getElementById('meeting-overlay');
  if (!meetingOverlay) return;

  // Hide overlay
  meetingOverlay.classList.remove('active');
  document.body.style.overflow = '';

  // Clean up Jitsi API
  if (AppState.currentMeetingApi) {
    try {
      AppState.currentMeetingApi.dispose();
    } catch (error) {
      console.error('Error disposing Jitsi API:', error);
    }
    AppState.currentMeetingApi = null;
  }

  // Clear container
  const jitsiContainer = document.getElementById('jitsi-container');
  if (jitsiContainer) {
    jitsiContainer.innerHTML = '';
  }

  AppState.currentMeeting = null;
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showToast(message, type = 'info') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas ${getToastIcon(type)}"></i>
      <span>${message}</span>
    </div>
  `;

  // Add styles
  Object.assign(toast.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: type === 'error' ? 'var(--error-color)' :
                type === 'success' ? 'var(--success-color)' : 'var(--primary-color)',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-medium)',
    zIndex: '9999',
    opacity: '0',
    transform: 'translateX(100%)',
    transition: 'var(--transition)'
  });

  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  }, 10);

  // Remove after delay
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

function getToastIcon(type) {
  switch (type) {
    case 'success': return 'fa-check-circle';
    case 'error': return 'fa-exclamation-circle';
    case 'warning': return 'fa-exclamation-triangle';
    default: return 'fa-info-circle';
  }
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }

    // Ctrl/Cmd + N for new room
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      showCreateRoomModal();
    }

    // Ctrl/Cmd + T for theme toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

// Navigation management
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();

      // Remove active class from all items
      navItems.forEach(nav => nav.classList.remove('active'));

      // Add active class to clicked item
      this.classList.add('active');

      // Handle navigation
      const section = this.dataset.section;
      handleNavigation(section);
    });
  });
}

function handleNavigation(section) {
  switch (section) {
    case 'home':
      // Already on home page
      break;
    case 'explore':
      showToast('Explore page coming soon!', 'info');
      break;
    case 'friends':
      showToast('Friends page coming soon!', 'info');
      break;
    case 'messages':
      showToast('Messages page coming soon!', 'info');
      break;
    case 'profile':
      showToast('Profile page coming soon!', 'info');
      break;
  }
}

// Initialize navigation when DOM loads
document.addEventListener('DOMContentLoaded', function() {
  setupNavigation();
});

// Auto-refresh rooms every 30 seconds
setInterval(() => {
  if (!AppState.currentMeeting) {
    loadRooms();
  }
}, 30000);

// Handle online/offline status
window.addEventListener('online', function() {
  showToast('Connection restored!', 'success');
  loadRooms();
});

window.addEventListener('offline', function() {
  showToast('You are offline. Some features may not work.', 'warning');
});

// Export functions for global access
window.AppState = AppState;
window.toggleTheme = toggleTheme;
window.toggleNotifications = toggleNotifications;
window.toggleProfileMenu = toggleProfileMenu;
window.showCreateRoomModal = showCreateRoomModal;
window.hideCreateRoomModal = hideCreateRoomModal;
window.createRoom = createRoom;
window.joinRoom = joinRoom;
window.closeMeeting = closeMeeting;
window.toggleFullscreen = toggleFullscreen;
window.filterRooms = filterRooms;
window.sortRooms = sortRooms;
window.setView = setView;
window.performSearch = performSearch;
window.selectSearchSuggestion = selectSearchSuggestion;
window.favoriteRoom = favoriteRoom;
window.shareRoom = shareRoom;
window.editProfile = editProfile;
window.openSettings = openSettings;
window.viewHistory = viewHistory;
window.logout = logout;
