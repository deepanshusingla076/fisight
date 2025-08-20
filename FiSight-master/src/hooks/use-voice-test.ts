import { useVoiceAssistant } from '@/hooks/use-voice-assistant';

export function useVoiceTest() {
  const voice = useVoiceAssistant();

  const runQuickTest = async () => {
    console.log('🧪 Starting Voice Assistant Quick Test...');
    
    // Test 1: Speech Synthesis
    console.log('1. Testing speech synthesis...');
    try {
      await voice.speak('Hello! This is a quick test of the speech synthesis.');
      console.log('✅ Speech synthesis test completed');
    } catch (error) {
      console.error('❌ Speech synthesis test failed:', error);
    }

    // Test 2: Check capabilities
    console.log('2. Checking voice capabilities...');
    console.log('   - Speech Recognition:', voice.isRecognitionSupported ? '✅ Supported' : '❌ Not supported');
    console.log('   - Available Voices:', voice.voices.length);
    console.log('   - Current Voice:', voice.settings.voice?.name || 'None selected');
    console.log('   - Speech Rate:', voice.settings.rate);
    console.log('   - Speech Volume:', voice.settings.volume);

    // Test 3: Voice Settings
    console.log('3. Testing voice settings...');
    const originalRate = voice.settings.rate;
    voice.updateSettings({ rate: 1.2 });
    console.log('   - Updated speech rate to 1.2');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    voice.updateSettings({ rate: originalRate });
    console.log('   - Restored original speech rate');

    console.log('✅ Voice Assistant Quick Test completed!');
  };

  const testErrorHandling = async () => {
    console.log('🧪 Testing error handling...');
    
    // Test error handling by canceling speech quickly
    voice.speak('This speech will be interrupted');
    voice.stopSpeaking(); // This should trigger "interrupted" error (now handled gracefully)
    
    console.log('✅ Error handling test completed - check for no error logs');
  };

  return {
    ...voice,
    runQuickTest,
    testErrorHandling
  };
}
