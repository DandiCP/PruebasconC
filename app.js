// Configuración global
let peer = null;
let currentConnection = null;
let myPeerId = null;
let myName = '';
let myLanguage = 'es';
let translationEnabled = false;
let connectedUsers = [];

// Elementos DOM
const elements = {
    myPeerIdSpan: document.getElementById('myPeerId'),
    copyIdBtn: document.getElementById('copyIdBtn'),
    myLanguageSelect: document.getElementById('myLanguage'),
    myNameInput: document.getElementById('myName'),
    statusDot: document.getElementById('statusDot'),
    statusText: document.getElementById('statusText'),
    friendIdInput: document.getElementById('friendId'),
    connectBtn: document.getElementById('connectBtn'),
    chatMessages: document.getElementById('chatMessages'),
    messageInput: document.getElementById('messageInput'),
    sendBtn: document.getElementById('sendBtn'),
    translateToggle: document.getElementById('translateToggle'),
    disconnectBtn: document.getElementById('disconnectBtn'),
    chatTitle: document.getElementById('chatTitle'),
    chatStatus: document.getElementById('chatStatus'),
    translationIndicator: document.getElementById('translationIndicator'),
    connectedUsers: document.getElementById('connectedUsers'),
    shareWhatsApp: document.getElementById('shareWhatsApp'),
    shareTelegram: document.getElementById('shareTelegram'),
    shareTwitter: document.getElementById('shareTwitter')
};

// Inicializar PeerJS
function initPeer() {
    // Usar el servidor público de PeerJS
    peer = new Peer({
        host: 'peerjs-server.herokuapp.com',
        secure: true,
        port: 443,
        config: {
            'iceServers': [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' }
            ]
        }
    });

    peer.on('open', function(id) {
        myPeerId = id;
        elements.myPeerIdSpan.textContent = id;
        updateStatus('connected', 'Conectado - Listo para chatear');
        console.log('Mi Peer ID:', id);
    });

    peer.on('connection', function(conn) {
        handleIncomingConnection(conn);
    });

    peer.on('error', function(err) {
        console.error('PeerJS Error:', err);
        if (err.type === 'peer-unavailable') {
            showMessage('system', '❌ Usuario no disponible. Verifica el ID.');
        } else if (err.type === 'network') {
            updateStatus('disconnected', 'Error de red. Intentando reconectar...');
        } else {
            showMessage('system', `Error: ${err.message}`);
        }
    });

    peer.on('disconnected', function() {
        updateStatus('disconnected', 'Desconectado del servidor');
        setTimeout(() => {
            if (peer && !peer.destroyed) {
                peer.reconnect();
            }
        }, 3000);
    });

    peer.on('close', function() {
        updateStatus('disconnected', 'Conexión cerrada');
    });
}

// Manejar conexión entrante
function handleIncomingConnection(conn) {
    if (currentConnection) {
        conn.close();
        return;
    }

    currentConnection = conn;
    setupConnection(conn);
    showMessage('system', `✅ ${conn.metadata?.name || 'Alguien'} se ha conectado contigo`);
    updateChatHeader(conn.metadata?.name || 'Usuario', conn.metadata?.language || 'unknown');
}

// Conectar con un amigo
function connectToFriend() {
    const friendId = elements.friendIdInput.value.trim();
    
    if (!friendId) {
        alert('Por favor ingresa un ID válido');
        return;
    }

    if (friendId === myPeerId) {
        alert('No puedes conectarte contigo mismo');
        return;
    }

    if (currentConnection) {
        alert('Ya estás conectado. Desconéctate primero.');
        return;
    }

    myName = elements.myNameInput.value.trim() || 'Anónimo';
    myLanguage = elements.myLanguageSelect.value;

    const conn = peer.connect(friendId, {
        metadata: {
            name: myName,
            language: myLanguage
        }
    });

    currentConnection = conn;
    setupConnection(conn);
}

// Configurar eventos de conexión
function setupConnection(conn) {
    conn.on('open', function() {
        showMessage('system', '🎉 ¡Conectado! Ya puedes empezar a chatear');
        elements.messageInput.disabled = false;
        elements.sendBtn.disabled = false;
        
        // Enviar información inicial
        const userInfo = {
            type: 'userInfo',
            name: elements.myNameInput.value.trim() || 'Anónimo',
            language: elements.myLanguageSelect.value
        };
        conn.send(userInfo);
    });

    conn.on('data', function(data) {
        handleIncomingData(data, conn);
    });

    conn.on('close', function() {
        showMessage('system', '👋 El usuario se ha desconectado');
        resetConnection();
    });

    conn.on('error', function(err) {
        console.error('Connection Error:', err);
        showMessage('system', `❌ Error de conexión: ${err.message}`);
    });
}

// Manejar datos entrantes
function handleIncomingData(data, conn) {
    if (data.type === 'userInfo') {
        updateChatHeader(data.name, data.language);
        addConnectedUser({
            name: data.name,
            language: data.language,
            peerId: conn.peer
        });
    } else if (data.type === 'message') {
        displayMessage('received', data);
    }
}

// Enviar mensaje
function sendMessage() {
    const message = elements.messageInput.value.trim();
    
    if (!message || !currentConnection) {
        return;
    }

    const messageData = {
        type: 'message',
        text: message,
        name: elements.myNameInput.value.trim() || 'Anónimo',
        language: elements.myLanguageSelect.value,
        timestamp: new Date().toISOString()
    };

    // Traducir si está habilitado
    if (translationEnabled) {
        translateText(message, elements.myLanguageSelect.value, 'auto')
            .then(translation => {
                messageData.translation = translation;
                currentConnection.send(messageData);
                displayMessage('sent', messageData);
            });
    } else {
        currentConnection.send(messageData);
        displayMessage('sent', messageData);
    }

    elements.messageInput.value = '';
    elements.messageInput.style.height = 'auto';
}

// Mostrar mensaje en el chat
function displayMessage(type, data) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';

    const headerDiv = document.createElement('div');
    headerDiv.className = 'message-header';
    
    const flag = getLanguageFlag(data.language);
    headerDiv.innerHTML = `<span>${flag}</span><strong>${data.name}</strong>`;

    const textDiv = document.createElement('div');
    textDiv.className = 'message-text';
    textDiv.textContent = data.text;

    contentDiv.appendChild(headerDiv);
    contentDiv.appendChild(textDiv);

    // Agregar traducción si existe
    if (data.translation && translationEnabled) {
        const translationDiv = document.createElement('div');
        translationDiv.className = 'message-translation';
        translationDiv.textContent = `📝 ${data.translation}`;
        contentDiv.appendChild(translationDiv);
    }

    // Agregar timestamp
    const timeDiv = document.createElement('div');
    timeDiv.className = 'message-time';
    timeDiv.textContent = formatTime(data.timestamp);
    contentDiv.appendChild(timeDiv);

    messageDiv.appendChild(contentDiv);
    elements.chatMessages.appendChild(messageDiv);

    // Scroll al final
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;

    // Quitar mensaje de bienvenida
    const welcomeMsg = elements.chatMessages.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
}

// Mostrar mensaje del sistema
function showMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.width = '100%';

    const contentDiv = document.createElement('div');
    contentDiv.style.background = '#e3f2fd';
    contentDiv.style.color = '#1976d2';
    contentDiv.style.padding = '10px 15px';
    contentDiv.style.borderRadius = '20px';
    contentDiv.style.fontSize = '0.9rem';
    contentDiv.style.display = 'inline-block';
    contentDiv.style.maxWidth = '80%';
    contentDiv.textContent = text;

    messageDiv.appendChild(contentDiv);
    elements.chatMessages.appendChild(messageDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

// Traducir texto usando LibreTranslate API pública
async function translateText(text, sourceLang, targetLang) {
    try {
        // Usar API pública gratuita de LibreTranslate (limitada pero funcional)
        const response = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                source: sourceLang,
                target: targetLang,
                format: 'text'
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        return data.translatedText || text;
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Devolver texto original si falla
    }
}

// Actualizar estado de conexión
function updateStatus(status, text) {
    elements.statusText.textContent = text;
    
    if (status === 'connected') {
        elements.statusDot.classList.add('connected');
    } else {
        elements.statusDot.classList.remove('connected');
    }
}

// Actualizar encabezado del chat
function updateChatHeader(name, language) {
    const flag = getLanguageFlag(language);
    elements.chatTitle.textContent = `${flag} ${name}`;
    elements.chatStatus.textContent = `Hablando ${getLanguageName(language)}`;
}

// Resetear conexión
function resetConnection() {
    currentConnection = null;
    elements.messageInput.disabled = true;
    elements.sendBtn.disabled = true;
    elements.chatTitle.textContent = 'Esperando conexión...';
    elements.chatStatus.textContent = 'Sin conexión';
    
    // Limpiar usuarios conectados
    connectedUsers = [];
    updateConnectedUsersList();
}

// Desconectar
function disconnect() {
    if (currentConnection) {
        currentConnection.close();
        resetConnection();
        showMessage('system', '👋 Te has desconectado');
    }
}

// Copiar ID al portapapeles
function copyId() {
    navigator.clipboard.writeText(myPeerId).then(() => {
        elements.copyIdBtn.textContent = '✓';
        setTimeout(() => {
            elements.copyIdBtn.textContent = '📋';
        }, 2000);
    });
}

// Toggle traducción
function toggleTranslation() {
    translationEnabled = !translationEnabled;
    elements.translateToggle.classList.toggle('active', translationEnabled);
    elements.translationIndicator.style.display = translationEnabled ? 'block' : 'none';
}

// Compartir en redes sociales
function shareOnWhatsApp() {
    const message = `¡Chatea conmigo en Chat Global! 🌍\nMi ID: ${myPeerId}\nÚsalo aquí: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
}

function shareOnTelegram() {
    const message = `¡Chatea conmigo en Chat Global! 🌍\nMi ID: ${myPeerId}\nÚsalo aquí: ${window.location.href}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`, '_blank');
}

function shareOnTwitter() {
    const message = `¡Chatea conmigo en Chat Global! 🌍\nMi ID: ${myPeerId}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
}

// Agregar usuario conectado a la lista
function addConnectedUser(user) {
    connectedUsers.push(user);
    updateConnectedUsersList();
}

// Actualizar lista de usuarios conectados
function updateConnectedUsersList() {
    if (connectedUsers.length === 0) {
        elements.connectedUsers.innerHTML = '<p class="no-users">No hay usuarios conectados</p>';
        return;
    }

    elements.connectedUsers.innerHTML = connectedUsers.map(user => `
        <div class="user-item">
            <span class="user-flag">${getLanguageFlag(user.language)}</span>
            <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-lang">${getLanguageName(user.language)}</div>
            </div>
        </div>
    `).join('');
}

// Obtener bandera de idioma
function getLanguageFlag(lang) {
    const flags = {
        'es': '🇪🇸',
        'en': '🇺🇸',
        'zh': '🇨🇳',
        'ja': '🇯🇵',
        'ko': '🇰🇷',
        'fr': '🇫🇷',
        'de': '🇩🇪',
        'pt': '🇧🇷',
        'unknown': '🌍'
    };
    return flags[lang] || '🌍';
}

// Obtener nombre de idioma
function getLanguageName(lang) {
    const names = {
        'es': 'Español',
        'en': 'English',
        'zh': '中文',
        'ja': '日本語',
        'ko': '한국어',
        'fr': 'Français',
        'de': 'Deutsch',
        'pt': 'Português',
        'unknown': 'Desconocido'
    };
    return names[lang] || 'Desconocido';
}

// Formatear timestamp
function formatTime(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

// Auto-resize textarea
elements.messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Event Listeners
elements.copyIdBtn.addEventListener('click', copyId);
elements.connectBtn.addEventListener('click', connectToFriend);
elements.sendBtn.addEventListener('click', sendMessage);
elements.translateToggle.addEventListener('click', toggleTranslation);
elements.disconnectBtn.addEventListener('click', disconnect);
elements.shareWhatsApp.addEventListener('click', shareOnWhatsApp);
elements.shareTelegram.addEventListener('click', shareOnTelegram);
elements.shareTwitter.addEventListener('click', shareOnTwitter);

// Enter para enviar mensaje
elements.messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Enter en campo de ID para conectar
elements.friendIdInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        connectToFriend();
    }
});

// Guardar preferencias en localStorage
elements.myNameInput.addEventListener('change', function() {
    localStorage.setItem('chatName', this.value);
});

elements.myLanguageSelect.addEventListener('change', function() {
    myLanguage = this.value;
    localStorage.setItem('chatLanguage', this.value);
});

// Cargar preferencias guardadas
function loadPreferences() {
    const savedName = localStorage.getItem('chatName');
    const savedLanguage = localStorage.getItem('chatLanguage');
    
    if (savedName) {
        elements.myNameInput.value = savedName;
    }
    
    if (savedLanguage) {
        elements.myLanguageSelect.value = savedLanguage;
        myLanguage = savedLanguage;
    }
}

// Inicializar aplicación
function init() {
    loadPreferences();
    initPeer();
    console.log('Chat Global inicializado 🌍');
}

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
