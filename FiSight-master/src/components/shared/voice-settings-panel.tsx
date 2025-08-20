'use client';

import { useState } from 'react';
import { Settings, Volume2, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface VoiceSettings {
  language: string;
  voice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
  volume: number;
}

interface VoiceSettingsPanelProps {
  voices: SpeechSynthesisVoice[];
  settings: VoiceSettings;
  updateSettings: (newSettings: Partial<VoiceSettings>) => void;
  isRecognitionSupported: boolean;
  isAudioSupported: boolean;
  speak: (text: string) => void;
  isSpeaking: boolean;
}

export function VoiceSettingsPanel({
  voices,
  settings,
  updateSettings,
  isRecognitionSupported,
  isAudioSupported,
  speak,
  isSpeaking,
}: VoiceSettingsPanelProps) {
  const handleTestVoice = () => {
    const testText = "Hello! I'm your AI financial advisor. How can I assist you today?";
    speak(testText);
  };

  const languages = [
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'hi-IN', name: 'Hindi (India)', flag: '🇮🇳' },
    { code: 'es-ES', name: 'Spanish (Spain)', flag: '🇪🇸' },
    { code: 'fr-FR', name: 'French (France)', flag: '🇫🇷' },
    { code: 'de-DE', name: 'German (Germany)', flag: '🇩🇪' },
    { code: 'ja-JP', name: 'Japanese (Japan)', flag: '🇯🇵' },
    { code: 'ko-KR', name: 'Korean (Korea)', flag: '🇰🇷' },
  ];

  const filteredVoices = voices.filter(voice => 
    voice.lang.startsWith(settings.language.split('-')[0])
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Volume2 className="h-4 w-4" />
          Voice Settings
        </h3>
        
        {/* Browser Support Status */}
        <div className="flex gap-1">
          <Badge variant={isRecognitionSupported ? "default" : "destructive"} className="text-xs px-1">
            {isRecognitionSupported ? <Mic className="h-2 w-2" /> : <MicOff className="h-2 w-2" />}
          </Badge>
          <Badge variant={isAudioSupported ? "default" : "destructive"} className="text-xs px-1">
            <Volume2 className="h-2 w-2" />
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Language Selection */}
        <div className="space-y-1">
          <Label className="text-xs">Language</Label>
          <Select 
            value={settings.language} 
            onValueChange={(value) => updateSettings({ language: value })}
          >
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code} className="text-xs">
                  {lang.flag} {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Voice Selection */}
        <div className="space-y-1">
          <Label className="text-xs">Voice</Label>
          <Select 
            value={settings.voice?.name || ''} 
            onValueChange={(value) => {
              const selectedVoice = filteredVoices.find(v => v.name === value);
              updateSettings({ voice: selectedVoice });
            }}
          >
            <SelectTrigger className="h-7 text-xs">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {filteredVoices.map((voice) => (
                <SelectItem key={voice.name} value={voice.name} className="text-xs">
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* Speed */}
        <div className="space-y-1">
          <Label className="text-xs">Speed: {settings.rate.toFixed(1)}</Label>
          <Slider
            value={[settings.rate]}
            onValueChange={([value]) => updateSettings({ rate: value })}
            min={0.5}
            max={2}
            step={0.1}
            className="h-4"
          />
        </div>

        {/* Pitch */}
        <div className="space-y-1">
          <Label className="text-xs">Pitch: {settings.pitch.toFixed(1)}</Label>
          <Slider
            value={[settings.pitch]}
            onValueChange={([value]) => updateSettings({ pitch: value })}
            min={0.5}
            max={2}
            step={0.1}
            className="h-4"
          />
        </div>

        {/* Volume */}
        <div className="space-y-1">
          <Label className="text-xs">Volume: {Math.round(settings.volume * 100)}%</Label>
          <Slider
            value={[settings.volume]}
            onValueChange={([value]) => updateSettings({ volume: value })}
            min={0}
            max={1}
            step={0.1}
            className="h-4"
          />
        </div>
      </div>

      {/* Test Button */}
      <Button
        onClick={handleTestVoice}
        disabled={isSpeaking}
        size="sm"
        variant="outline"
        className="w-full h-7 text-xs"
      >
        <Volume2 className="h-3 w-3 mr-1" />
        {isSpeaking ? 'Speaking...' : 'Test Voice'}
      </Button>

      {/* Support Warnings */}
      {!isRecognitionSupported && (
        <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
          ⚠️ Speech recognition not supported. Use Chrome, Edge, or Safari.
        </div>
      )}
    </div>
  );
}
