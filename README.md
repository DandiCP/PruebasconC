# 🌍 Chat Global - Aplicación de Mensajería P2P

Una aplicación de chat en tiempo real que te permite conectarte con personas de todo el mundo **sin necesidad de servidor propio**. Perfecta para comunicarte con personas que hablan chino, japonés u otros idiomas.

## ✨ Características

- 🔗 **Conexión P2P (Peer-to-Peer)**: No necesitas servidor propio, usa tecnología WebRTC
- 🌐 **Traducción automática**: Comunícate con personas en diferentes idiomas
- 🎯 **100% Gratis**: Sin costos de servidor ni pagos
- 🔒 **Privado**: Las conversaciones van directamente entre usuarios
- 📱 **Responsive**: Funciona en móvil, tablet y escritorio
- 🎨 **Interfaz moderna**: Diseño limpio y fácil de usar

## 🚀 Cómo usar

### Opción 1: Abrir directamente en el navegador

1. Descarga los archivos:
   - `index.html`
   - `style.css`
   - `app.js`

2. Abre `index.html` en tu navegador (Chrome, Firefox, Edge, Safari)

3. ¡Ya estás listo para chatear!

### Opción 2: Servidor local (opcional)

```bash
# Si tienes Python 3
python -m http.server 8000

# Si tienes Node.js
npx http-server

# Luego abre: http://localhost:8000
```

## 💬 Cómo chatear con alguien

### Para conectarte con un amigo:

1. **Comparte tu ID**:
   - Copia tu ID (aparece arriba a la izquierda)
   - Envíaselo a tu amigo por WhatsApp, Telegram, etc.

2. **Conecta con tu amigo**:
   - Pide a tu amigo su ID
   - Pégalo en el campo "ID del Amigo"
   - Haz clic en "🔗 Conectar"

3. **¡Empieza a chatear!**
   - Escribe mensajes y presiona Enter
   - Activa la traducción automática si hablan idiomas diferentes

### Compartir tu ID fácilmente:

Usa los botones de compartir para enviar tu ID por:
- WhatsApp
- Telegram  
- Twitter

## 🌐 Traducción automática

1. Haz clic en el botón 🌐 en la esquina superior derecha del chat
2. Los mensajes se traducirán automáticamente
3. Verás el mensaje original y la traducción

**Idiomas soportados:**
- 🇪🇸 Español
- 🇺🇸 English
- 🇨🇳 中文 (Chino)
- 🇯🇵 日本語 (Japonés)
- 🇰🇷 한국어 (Coreano)
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇧🇷 Português

## 🔧 Tecnologías usadas

- **PeerJS**: Conexiones P2P sobre WebRTC
- **LibreTranslate**: Traducción automática gratuita
- **HTML/CSS/JavaScript**: Sin frameworks, puro y simple

## 📱 Desplegar online GRATIS

### GitHub Pages (Recomendado):

1. Sube los archivos a un repositorio de GitHub
2. Ve a Settings → Pages
3. Selecciona la rama `main` y guarda
4. Tu chat estará en: `https://tuusuario.github.io/nombre-repo`

### Netlify:

1. Arrastra la carpeta a [netlify.com/drop](https://app.netlify.com/drop)
2. ¡Listo! Te dan un link instantáneo

### Vercel:

```bash
npm i -g vercel
vercel
```

## 🤝 Encontrar personas para chatear

Como no hay un servidor central, necesitas compartir IDs manualmente:

1. **Crea un grupo público**:
   - Crea un grupo de Telegram/Discord para usuarios de tu chat
   - Los usuarios comparten sus IDs ahí
   - Ejemplo: "Chat Global - Comparte tu ID"

2. **Reddit/Twitter**:
   - Publica tu ID en subreddits de idiomas
   - Usa hashtags como #ChatGlobal #LanguageExchange

3. **Con amigos**:
   - Comparte tu link + ID por WhatsApp
   - Perfecto para practicar idiomas

## 🔒 Privacidad y Seguridad

- ✅ Las conversaciones son P2P (directas entre usuarios)
- ✅ No se almacenan en ningún servidor
- ✅ Solo necesitas compartir tu ID público
- ⚠️ No compartas información personal sensible
- ⚠️ Los IDs son públicos, cualquiera con tu ID puede conectarse

## ⚙️ Personalización

### Cambiar servidor STUN:

En `app.js`, línea 37-42, puedes agregar más servidores:

```javascript
'iceServers': [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' }
]
```

### Cambiar colores:

En `style.css`, busca:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
Y cambia los colores a tu gusto.

## ❓ Solución de problemas

### "Usuario no disponible"
- Verifica que el ID sea correcto
- Asegúrate de que tu amigo esté conectado
- Ambos deben tener la página abierta

### "Error de red"
- Revisa tu conexión a Internet
- Algunos firewalls/VPNs pueden bloquear WebRTC
- Intenta desde otra red

### "No se conecta"
- Ambos usuarios deben estar en la página al mismo tiempo
- Refresca la página si llevas mucho tiempo conectado
- Verifica que tu navegador soporte WebRTC (Chrome, Firefox, Edge, Safari)

## 🌟 Próximas características

- [ ] Videollamadas
- [ ] Compartir archivos
- [ ] Chat grupal
- [ ] Cifrado end-to-end
- [ ] Salas públicas por idioma
- [ ] Modo oscuro

## 📄 Licencia

MIT - Usa, modifica y comparte libremente

## 🙋 Soporte

¿Problemas o preguntas? Abre un issue en GitHub o contacta al desarrollador.

---

**¡Hecho con ❤️ para conectar personas alrededor del mundo!** 🌍
