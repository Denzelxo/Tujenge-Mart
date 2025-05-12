// AI Chatbot Assistant
class ChatbotAssistant {
    constructor() {
        this.isListening = false;
        this.recognition = null;
        this.synthesis = null;
        this.currentLanguage = 'en';
        this.initializeSpeechRecognition();
        this.initializeSpeechSynthesis();
    }

    // Initialize speech recognition
    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.processVoiceCommand(transcript);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };
        }
    }

    // Initialize speech synthesis
    initializeSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
        }
    }

    // Process voice command
    async processVoiceCommand(transcript) {
        try {
            // In a real app, this would call the OpenAI API
            const response = await this.simulateAIResponse(transcript);
            this.speak(response);
            return response;
        } catch (error) {
            console.error('Failed to process voice command:', error);
            throw error;
        }
    }

    // Start voice recognition
    startListening() {
        if (this.recognition) {
            this.isListening = true;
            this.recognition.lang = this.currentLanguage === 'sw' ? 'sw-KE' : 'en-KE';
            this.recognition.start();
        }
    }

    // Stop voice recognition
    stopListening() {
        if (this.recognition) {
            this.isListening = false;
            this.recognition.stop();
        }
    }

    // Speak response
    speak(text) {
        if (this.synthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = this.currentLanguage === 'sw' ? 'sw-KE' : 'en-KE';
            this.synthesis.speak(utterance);
        }
    }

    // Toggle language
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'sw' : 'en';
        return this.currentLanguage;
    }

    // Simulate AI response
    async simulateAIResponse(query) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simple response simulation
                const responses = {
                    'search': 'I found several products matching your search.',
                    'help': 'How can I assist you today?',
                    'order': 'I can help you track your order.',
                    'payment': 'We accept M-Pesa and card payments.',
                    'delivery': 'Delivery takes 2-3 business days.'
                };

                const response = Object.entries(responses).find(([key]) => 
                    query.toLowerCase().includes(key)
                );

                resolve(response ? response[1] : 'I\'m not sure how to help with that.');
            }, 1000);
        });
    }
}

// Vendor onboarding system
class VendorOnboarding {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
    }

    // Process document scan
    async processDocumentScan(imageData) {
        try {
            // In a real app, this would use OCR to extract text
            const extractedData = await this.simulateOCR(imageData);
            return extractedData;
        } catch (error) {
            console.error('Document scan failed:', error);
            throw error;
        }
    }

    // Simulate OCR
    async simulateOCR(imageData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    name: 'Denzel Odhiambo',
                    idNumber: '12345678',
                    businessName: 'Sample Business',
                    registrationNumber: 'REG123456'
                });
            }, 2000);
        });
    }

    // Next step
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            return this.currentStep;
        }
        return null;
    }

    // Previous step
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            return this.currentStep;
        }
        return null;
    }
}

// Initialize assistants
const chatbotAssistant = new ChatbotAssistant();
const vendorOnboarding = new VendorOnboarding();

// Export for use in other files
window.chatbotAssistant = chatbotAssistant;
window.vendorOnboarding = vendorOnboarding; 