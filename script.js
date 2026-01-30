const API_KEY = 'AIzaSyCkaZIlhHer8kMNg9jJo9yyvqbdCZ98G9E';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

const systemPrompt = `You are a friendly and helpful Customer Support Bot for a business. Your role is to:
- Answer frequently asked questions (FAQs)
- Help with product/service inquiries
- Guide customers through common issues
- Provide troubleshooting steps
- Process basic requests and complaints
- Offer helpful suggestions and alternatives
- Maintain a professional yet friendly tone
- Escalate complex issues to human support when needed

Always:
1. Be empathetic and patient
2. Provide clear, step-by-step solutions
3. Acknowledge customer concerns
4. Offer follow-up support if needed
5. Provide alternatives if the original request can't be fulfilled`;

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function showLoading() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.id = 'loading-message';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'loading';
    contentDiv.innerHTML = '<div class="loading-dot"></div><div class="loading-dot"></div><div class="loading-dot"></div>';
    
    messageDiv.appendChild(contentDiv);
    chatWindow.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function removeLoading() {
    const loadingMsg = document.getElementById('loading-message');
    if (loadingMsg) loadingMsg.remove();
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    sendBtn.disabled = true;

    showLoading();

    try {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemPrompt}\n\nCustomer: ${message}`
                    }]
                }]
            })
        });

        if (!response.ok) throw new Error('API request failed');
        const data = await response.json();
        removeLoading();

        const botMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Thank you for reaching out. We\'re here to help!';
        addMessage(botMessage, 'bot');
    } catch (error) {
        removeLoading();
        addMessage('Sorry, there was an error. Please check your API key and try again.', 'bot');
        console.error(error);
    } finally {
        sendBtn.disabled = false;
        userInput.focus();
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Welcome message
addMessage('Welcome! 🤝 Thank you for contacting us. How can we help you today? Feel free to ask about our products, services, or any issues you\'re experiencing.', 'bot');
