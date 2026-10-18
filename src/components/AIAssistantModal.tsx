import React, { useState, useRef } from 'react';
import {
  X,
  Send,
  Mic,
  MicOff,
  Sparkles,
  Search,
  MapPin,
  Bot,
  ExternalLink,
  Loader2,
  PhoneCall,
  Volume2,
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomizer?: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  sources?: { title: string; uri: string }[];
  places?: { title: string; uri: string }[];
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onOpenCustomizer,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'search' | 'maps'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Namaste! I am Ustaad Ji, master wood craftsman at Satkkabir Furniture Udhyog. How may I assist you with custom dimensions, solid Sheesham or Teak wood selection, or room planning today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Audio Recording & Transcription
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Search Grounding State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{ text: string; sources: any[] } | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Maps Grounding State
  const [mapsQuery, setMapsQuery] = useState('');
  const [mapsResult, setMapsResult] = useState<{ text: string; places: any[] } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    const updatedMessages = [...messages, { role: 'user' as const, content: userText }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await resp.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Our carpenters recommend pure seasoned Sheesham with 8-12% moisture content.' },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Apologies, workshop connection busy. Please try asking again in a moment.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start Mic Recording for Audio Transcription (gemini-3.5-transcribe)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          if (base64Audio) {
            setIsLoading(true);
            try {
              const resp = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/webm' }),
              });
              const data = await resp.json();
              if (data.transcription) {
                setInput(data.transcription);
              }
            } catch (err) {
              console.error('Transcription error:', err);
            } finally {
              setIsLoading(false);
            }
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access denied or unavailable in this environment.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Handle Google Search Grounding
  const handleRunSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setSearchResult(data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Google Maps Grounding
  const handleRunMaps = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapsQuery.trim() || isLocating) return;
    setIsLocating(true);
    try {
      const res = await fetch('/api/maps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mapsQuery }),
      });
      const data = await res.json();
      setMapsResult(data);
    } catch (err) {
      console.error('Maps error:', err);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[85vh] shadow-2xl border border-[#dec099] flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-4 bg-[#f5ede1] border-b border-[#dec099] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#7e4b2c] text-[#f5ede1] flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-base text-[#301a11]">
                  Ustaad Ji • AI Woodcraft Consultant
                </h3>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Gemini 3.8 Powered
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Satkkabir Furniture Udhyog Expert Consultation & Grounded Knowledge
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-white/80 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 px-4 bg-stone-50 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-2.5 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'chat'
                ? 'border-[#7e4b2c] text-[#7e4b2c]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Artisan Consultation Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`py-2.5 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'search'
                ? 'border-[#7e4b2c] text-[#7e4b2c]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Google Search Timber Rates</span>
          </button>

          <button
            onClick={() => setActiveTab('maps')}
            className={`py-2.5 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'maps'
                ? 'border-[#7e4b2c] text-[#7e4b2c]'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Google Maps Workshop Locator</span>
          </button>
        </div>

        {/* TAB 1: ARTISAN CHAT & VOICE TRANSCRIBE */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden p-4">
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2.5 text-xs ${
                    m.role === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white ${
                      m.role === 'user' ? 'bg-stone-700' : 'bg-[#7e4b2c]'
                    }`}
                  >
                    {m.role === 'user' ? 'You' : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#7e4b2c] text-white rounded-tr-none'
                        : 'bg-[#fcfaf7] border border-[#dec099]/70 text-stone-800 rounded-tl-none shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-stone-400 pl-9">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#7e4b2c]" />
                  <span>Ustaad Ji is analyzing timber measurements...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-stone-200 flex items-center gap-2">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2.5 rounded-xl border transition ${
                  isRecording
                    ? 'bg-red-600 text-white border-red-700 animate-pulse'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-600 border-stone-300'
                }`}
                title={isRecording ? 'Stop Recording' : 'Speak Requirements (Audio Transcribe)'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isRecording ? 'Listening to your voice...' : 'Ask about wood types, dimensions, or custom bed design...'}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2.5 rounded-xl bg-[#7e4b2c] hover:bg-[#683d28] disabled:opacity-50 text-white transition shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: GOOGLE SEARCH GROUNDING */}
        {activeTab === 'search' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <h4 className="font-serif font-bold text-base text-[#301a11] mb-1">
                Google Search Grounded Timber Intelligence
              </h4>
              <p className="text-xs text-stone-500 mb-3">
                Live web grounded queries on Indian timber market prices, seasoning kiln techniques, and lumber availability.
              </p>
            </div>

            <form onSubmit={handleRunSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="E.g., Sheesham vs CP Teak wood price per cubic foot in Rajasthan"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="px-4 py-2 bg-[#7e4b2c] hover:bg-[#683d28] text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                {isSearching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                <span>Search</span>
              </button>
            </form>

            {searchResult && (
              <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#cb9f6a]/60 space-y-3">
                <div className="text-xs text-stone-800 leading-relaxed whitespace-pre-wrap">
                  {searchResult.text}
                </div>

                {searchResult.sources && searchResult.sources.length > 0 && (
                  <div className="pt-2 border-t border-stone-200">
                    <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                      Web Grounding Citations:
                    </span>
                    <div className="space-y-1">
                      {searchResult.sources.map((s, i) => (
                        <a
                          key={i}
                          href={s.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[#7e4b2c] hover:underline flex items-center gap-1 font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{s.title || s.uri}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GOOGLE MAPS GROUNDING */}
        {activeTab === 'maps' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div>
              <h4 className="font-serif font-bold text-base text-[#301a11] mb-1">
                Google Maps Workshop & Certified Carpentry Fitters
              </h4>
              <p className="text-xs text-stone-500 mb-3">
                Locate timber markets, local furniture clusters, and certified white-glove installation centers across India.
              </p>
            </div>

            <form onSubmit={handleRunMaps} className="flex gap-2">
              <input
                type="text"
                value={mapsQuery}
                onChange={(e) => setMapsQuery(e.target.value)}
                placeholder="E.g., Furniture market and timber yards near Jaipur or Delhi"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#7e4b2c]"
              />
              <button
                type="submit"
                disabled={isLocating}
                className="px-4 py-2 bg-[#7e4b2c] hover:bg-[#683d28] text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                <span>Locate</span>
              </button>
            </form>

            {mapsResult && (
              <div className="bg-[#fcfaf7] p-4 rounded-2xl border border-[#cb9f6a]/60 space-y-3">
                <div className="text-xs text-stone-800 leading-relaxed whitespace-pre-wrap">
                  {mapsResult.text}
                </div>

                {mapsResult.places && mapsResult.places.length > 0 && (
                  <div className="pt-2 border-t border-stone-200">
                    <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                      Google Maps Links:
                    </span>
                    <div className="space-y-1">
                      {mapsResult.places.map((p, i) => (
                        <a
                          key={i}
                          href={p.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-800 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{p.title}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
