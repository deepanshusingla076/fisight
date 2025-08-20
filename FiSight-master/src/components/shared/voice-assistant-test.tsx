'use client';

import { useVoiceAssistant } from '@/hooks/use-voice-assistant';
import { useVoiceTest } from '@/hooks/use-voice-test';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, TestTube, Bug } from 'lucide-react';

export function VoiceAssistantTest() {
  const {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isRecognitionSupported,
    audioLevel
  } = useVoiceAssistant();

  const { runQuickTest, testErrorHandling } = useVoiceTest();

  const testSpeak = () => {
    speak('Hello! This is a test of the voice assistant. The voice functionality is working correctly.');
  };

  const testLongSpeak = () => {
    speak('This is a longer test to check if the voice assistant can handle extended speech. The financial advisor chatbot uses this voice system to provide spoken responses to your financial questions. You can ask about investments, budgeting, financial planning, and more.');
  };

  if (!isRecognitionSupported) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Voice Assistant Not Supported</h3>
        <p className="text-red-600">
          Your browser does not support speech recognition. Please use a modern browser like Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-base font-semibold mb-3">Voice Assistant Test</h3>
      
      {/* Status indicators */}
      <div className="flex gap-2 mb-3">
        <div className={`px-2 py-1 rounded text-xs ${isListening ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
          {isListening ? '🎤 Listening' : '🔇 Not Listening'}
        </div>
        <div className={`px-2 py-1 rounded text-xs ${isSpeaking ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}>
          {isSpeaking ? '🔊 Speaking' : '🔇 Silent'}
        </div>
        {isListening && (
          <div className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
            Audio: {Math.round(audioLevel)}%
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex gap-2 mb-3">
        <Button
          onClick={startListening}
          disabled={isListening}
          variant={isListening ? "secondary" : "default"}
          size="sm"
          className="flex items-center gap-1"
        >
          <Mic className="w-3 h-3" />
          Listen
        </Button>
        
        <Button
          onClick={stopListening}
          disabled={!isListening}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <MicOff className="w-3 h-3" />
          Stop
        </Button>
        
        <Button
          onClick={testSpeak}
          disabled={isSpeaking}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Volume2 className="w-3 h-3" />
          Test
        </Button>
        
        <Button
          onClick={stopSpeaking}
          disabled={!isSpeaking}
          variant="destructive"
          size="sm"
          className="flex items-center gap-1"
        >
          <VolumeX className="w-3 h-3" />
          Stop
        </Button>

        <Button
          onClick={runQuickTest}
          disabled={isSpeaking}
          variant="secondary"
          size="sm"
          className="flex items-center gap-1"
        >
          <TestTube className="w-3 h-3" />
          Quick Test
        </Button>

        <Button
          onClick={testErrorHandling}
          disabled={isSpeaking}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Bug className="w-3 h-3" />
          Error Test
        </Button>
      </div>

      {/* Transcript display */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Speech Transcript:
        </label>
        <div className="p-2 bg-gray-50 border border-gray-200 rounded min-h-[60px] text-sm">
          {transcript || (
            <span className="text-gray-400 italic">
              {isListening ? 'Listening for speech...' : 'Click "Listen" to begin'}
            </span>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-600">
        <p><strong>Quick Test:</strong> Click "Listen" → speak → click "Test" to hear voice</p>
        <p><strong>Advanced:</strong> "Quick Test" runs automated tests, "Error Test" checks error handling</p>
      </div>
    </div>
  );
}
