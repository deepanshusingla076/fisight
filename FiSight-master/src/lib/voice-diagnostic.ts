/**
 * Voice Assistant Diagnostic and Fix
 * This file helps identify and fix common voice assistant issues
 */

// Test voice assistant functionality
export const testVoiceAssistant = () => {
  console.log('🎤 Testing Voice Assistant Functionality...\n');
  
  // 1. Check browser support
  console.log('1. Browser Support Check:');
  const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  const speechSynthesis = window.speechSynthesis;
  const getUserMedia = navigator.mediaDevices?.getUserMedia;
  
  console.log('   Speech Recognition:', SpeechRecognition ? '✅ Supported' : '❌ Not supported');
  console.log('   Speech Synthesis:', speechSynthesis ? '✅ Supported' : '❌ Not supported');
  console.log('   Media Devices:', typeof getUserMedia === 'function' ? '✅ Supported' : '❌ Not supported');
  
  // 2. Check permissions
  console.log('\n2. Permissions Check:');
  navigator.permissions?.query({ name: 'microphone' as PermissionName })
    .then(result => {
      console.log('   Microphone Permission:', result.state);
      if (result.state === 'denied') {
        console.log('   ⚠️ Microphone access denied. Please enable microphone permissions.');
      }
    })
    .catch(() => {
      console.log('   ⚠️ Could not check microphone permissions');
    });
  
  // 3. Test speech synthesis
  console.log('\n3. Speech Synthesis Test:');
  if (speechSynthesis) {
    try {
      const voices = speechSynthesis.getVoices();
      console.log(`   Available voices: ${voices.length}`);
      
      if (voices.length === 0) {
        console.log('   ⚠️ No voices loaded yet, trying to load...');
        speechSynthesis.onvoiceschanged = () => {
          const newVoices = speechSynthesis.getVoices();
          console.log(`   Voices loaded: ${newVoices.length}`);
        };
      } else {
        const englishVoices = voices.filter(v => v.lang.startsWith('en'));
        console.log(`   English voices: ${englishVoices.length}`);
        englishVoices.slice(0, 3).forEach(voice => {
          console.log(`     - ${voice.name} (${voice.lang})`);
        });
      }
    } catch (error) {
      console.error('   ❌ Speech synthesis error:', error);
    }
  }
  
  // 4. Test speech recognition
  console.log('\n4. Speech Recognition Test:');
  if (SpeechRecognition) {
    try {
      const recognition = new SpeechRecognition();
      console.log('   ✅ Speech recognition instance created');
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => console.log('   🎤 Recognition started');
      recognition.onend = () => console.log('   🛑 Recognition ended');
      recognition.onerror = (event) => console.error('   ❌ Recognition error:', event.error);
      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log('   📝 Transcript:', transcript);
      };
      
      console.log('   ✅ Speech recognition configured successfully');
    } catch (error) {
      console.error('   ❌ Speech recognition setup error:', error);
    }
  }
  
  console.log('\n✅ Voice assistant diagnostic complete!');
};

// Quick fixes for common issues
export const fixVoiceAssistant = {
  // Fix 1: Request microphone permission
  requestMicrophonePermission: async () => {
    try {
      console.log('🎤 Requesting microphone permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Microphone permission granted');
      stream.getTracks().forEach(track => track.stop()); // Stop the stream
      return true;
    } catch (error) {
      console.error('❌ Microphone permission denied:', error);
      return false;
    }
  },
  
  // Fix 2: Initialize speech synthesis
  initializeSpeechSynthesis: () => {
    console.log('🔊 Initializing speech synthesis...');
    if (window.speechSynthesis) {
      // Create a dummy utterance to initialize
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
      window.speechSynthesis.cancel();
      
      // Load voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log(`✅ Loaded ${voices.length} voices`);
        return voices;
      };
      
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      } else {
        loadVoices();
      }
    }
  },
  
  // Fix 3: Test speech with user interaction
  testSpeech: (text: string = 'Hello, this is a test of the speech synthesis') => {
    console.log('🔊 Testing speech synthesis...');
    if (window.speechSynthesis) {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        
        utterance.onstart = () => console.log('✅ Speech started');
        utterance.onend = () => console.log('✅ Speech ended');
        utterance.onerror = (event) => console.error('❌ Speech error:', event.error);
        
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('❌ Speech test failed:', error);
      }
    }
  }
};

// Run diagnostic on window load
if (typeof window !== 'undefined') {
  (window as any).testVoiceAssistant = testVoiceAssistant;
  (window as any).fixVoiceAssistant = fixVoiceAssistant;
  
  console.log('🎤 Voice Assistant Diagnostic Tools Loaded');
  console.log('Run testVoiceAssistant() to check functionality');
  console.log('Run fixVoiceAssistant.requestMicrophonePermission() to fix permissions');
  console.log('Run fixVoiceAssistant.testSpeech() to test speech synthesis');
}
