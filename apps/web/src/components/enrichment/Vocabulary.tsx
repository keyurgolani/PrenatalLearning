/**
 * Word of the Day Component
 * Displays daily words with pronunciation, meaning, and cultural context
 * Supports both single-language words and multi-language concept view
 */

import React, { useState, useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { getWordsForDate, allWords, searchWords, getConceptsForDate, multiLanguageConcepts, searchConcepts } from '../../data/enrichment/vocabulary';
import type { DailyWord, MultiLanguageConcept, ConceptTranslation } from '../../types/daily';

const languageIcons: Record<string, string> = {
  sanskrit: 'SA',
  spanish: 'ES',
  french: 'FR',
  mandarin: 'ZH',
  hindi: 'HI',
  english: 'EN',
};

const languageColors: Record<string, string> = {
  sanskrit: '#FF6B35',
  spanish: '#E63946',
  french: '#457B9D',
  mandarin: '#2A9D8F',
  hindi: '#E9C46A',
  english: '#6D6875',
};

const languageNames: Record<string, string> = {
  sanskrit: 'Sanskrit',
  spanish: 'Spanish',
  french: 'French',
  mandarin: 'Mandarin',
  hindi: 'Hindi',
  english: 'English',
};

type ViewMode = 'words' | 'concepts';

interface WordCardProps {
  word: DailyWord;
  expanded: boolean;
  onToggle: () => void;
}

const WordCard: React.FC<WordCardProps> = ({ word, expanded, onToggle }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  const [isPlaying, setIsPlaying] = useState(false);

  const playPronunciation = () => {
    if (word.audioUrl) {
      const audio = new Audio(word.audioUrl);
      setIsPlaying(true);
      audio.play();
      audio.onended = () => setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(word.transliteration || word.word);
      utterance.lang = word.language === 'spanish' ? 'es-ES' 
        : word.language === 'french' ? 'fr-FR'
        : word.language === 'hindi' ? 'hi-IN'
        : 'en-US';
      setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        backgroundColor: isDark ? currentTheme.colors.surface : 'white',
        border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}`,
      }}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        aria-expanded={expanded}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="px-2 py-0.5 rounded text-xs font-bold text-white"
                style={{ backgroundColor: languageColors[word.language] }}
              >
                {languageIcons[word.language]}
              </span>
              <span className="text-xs" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>
                {word.partOfSpeech}
              </span>
            </div>
            <h3 className="text-xl font-bold mb-1" style={{ color: currentTheme.colors.text }}>
              {word.word}
              {word.transliteration && (
                <span className="ml-2 text-base font-normal" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>
                  ({word.transliteration})
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>
                {word.pronunciation}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); playPronunciation(); }}
                className="p-1.5 rounded-full transition-colors"
                style={{
                  backgroundColor: isPlaying ? currentTheme.colors.primary : isDark ? currentTheme.colors.surfaceHover : '#f3f4f6',
                  color: isPlaying ? 'white' : currentTheme.colors.primary,
                }}
                aria-label="Play pronunciation"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  {isPlaying ? <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /> : <path d="M8 5v14l11-7z" />}
                </svg>
              </button>
            </div>
          </div>
          <svg className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} style={{ color: isDark ? currentTheme.colors.textMuted : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <p className="mt-2 text-sm" style={{ color: currentTheme.colors.text }}>{word.meaning}</p>
      </div>
      {expanded && (
        <div className="px-4 pb-4 space-y-4 animate-fade-in" style={{ borderTop: `1px solid ${isDark ? currentTheme.colors.border : '#f3f4f6'}` }}>
          {word.etymology && (
            <div className="pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>Etymology</h4>
              <p className="text-sm" style={{ color: currentTheme.colors.text }}>{word.etymology}</p>
            </div>
          )}
          {word.culturalNote && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>Cultural Note</h4>
              <p className="text-sm" style={{ color: currentTheme.colors.text }}>{word.culturalNote}</p>
            </div>
          )}
          {word.examples.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>Examples</h4>
              <div className="space-y-2">
                {word.examples.map((example, idx) => (
                  <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb' }}>
                    <p className="text-sm font-medium mb-1" style={{ color: currentTheme.colors.text }}>{example.original}</p>
                    <p className="text-sm italic" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>{example.translation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {word.relatedWords && word.relatedWords.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>Related Words</h4>
              <div className="flex flex-wrap gap-2">
                {word.relatedWords.map((related, idx) => (
                  <span key={idx} className="px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f3f4f6', color: currentTheme.colors.text }}>{related}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


interface TranslationCardProps {
  translation: ConceptTranslation;
  isExpanded: boolean;
}

const TranslationCard: React.FC<TranslationCardProps> = ({ translation, isExpanded }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  const [isPlaying, setIsPlaying] = useState(false);

  const playPronunciation = () => {
    const utterance = new SpeechSynthesisUtterance(translation.transliteration || translation.word);
    utterance.lang = translation.language === 'spanish' ? 'es-ES' 
      : translation.language === 'french' ? 'fr-FR'
      : translation.language === 'hindi' ? 'hi-IN'
      : 'en-US';
    setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-3 rounded-xl" style={{ backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f9fafb', borderLeft: `3px solid ${languageColors[translation.language]}` }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: languageColors[translation.language] }}>
            {languageIcons[translation.language]}
          </span>
          <span className="text-xs" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>
            {languageNames[translation.language]}
          </span>
        </div>
        <button onClick={playPronunciation} className="p-1.5 rounded-full transition-colors" style={{ backgroundColor: isPlaying ? currentTheme.colors.primary : 'transparent', color: isPlaying ? 'white' : currentTheme.colors.primary }} aria-label="Play pronunciation">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            {isPlaying ? <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /> : <path d="M8 5v14l11-7z" />}
          </svg>
        </button>
      </div>
      <div className="text-lg font-bold" style={{ color: currentTheme.colors.text }}>
        {translation.word}
        {translation.transliteration && <span className="ml-2 text-sm font-normal" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>({translation.transliteration})</span>}
      </div>
      <div className="text-xs mt-1" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>{translation.pronunciation}</div>
      {isExpanded && (
        <div className="mt-3 space-y-2">
          {translation.nuance && <p className="text-sm italic" style={{ color: currentTheme.colors.text }}>"{translation.nuance}"</p>}
          {translation.etymology && <p className="text-xs" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}><span className="font-semibold">Origin:</span> {translation.etymology}</p>}
          {translation.example && (
            <div className="p-2 rounded-lg mt-2" style={{ backgroundColor: isDark ? currentTheme.colors.surface : 'white' }}>
              <p className="text-sm" style={{ color: currentTheme.colors.text }}>{translation.example.original}</p>
              <p className="text-xs italic" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>{translation.example.translation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ConceptCardProps {
  concept: MultiLanguageConcept;
  expanded: boolean;
  onToggle: () => void;
}

const ConceptCard: React.FC<ConceptCardProps> = ({ concept, expanded, onToggle }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;

  return (
    <div className="rounded-2xl overflow-hidden transition-all" style={{ backgroundColor: isDark ? currentTheme.colors.surface : 'white', border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}` }}>
      <div className="p-4 cursor-pointer" onClick={onToggle} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onToggle()} aria-expanded={expanded}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: isDark ? currentTheme.colors.surfaceHover : '#f3f4f6', color: currentTheme.colors.primary }}>{concept.category}</span>
              <span className="text-xs" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>{concept.translations.length} languages</span>
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: currentTheme.colors.text }}>{concept.concept}</h3>
            <p className="text-sm" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>{concept.description}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {concept.translations.map((t) => (
                <span key={t.language} className="px-2 py-1 rounded text-xs font-medium text-white" style={{ backgroundColor: languageColors[t.language] }}>{t.word}</span>
              ))}
            </div>
          </div>
          <svg className={`w-5 h-5 transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`} style={{ color: isDark ? currentTheme.colors.textMuted : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 space-y-4 animate-fade-in" style={{ borderTop: `1px solid ${isDark ? currentTheme.colors.border : '#f3f4f6'}` }}>
          <div className="pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>Across Languages</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {concept.translations.map((translation) => <TranslationCard key={translation.language} translation={translation} isExpanded={true} />)}
            </div>
          </div>
          {concept.culturalInsight && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>Cultural Insight</h4>
              <p className="text-sm" style={{ color: currentTheme.colors.text }}>{concept.culturalInsight}</p>
            </div>
          )}
          {concept.prenatalConnection && (
            <div className="p-4 rounded-xl" style={{ backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)', border: `1px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}` }}>
              <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#8b5cf6' }}>For You & Baby</h4>
              <p className="text-sm" style={{ color: currentTheme.colors.text }}>{concept.prenatalConnection}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export const Vocabulary: React.FC<{ compact?: boolean; refreshKey?: number }> = ({ compact, refreshKey }) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme.isDark;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  // When not compact, we default to showing all words (the list view)

  const [viewMode, setViewMode] = useState<ViewMode>('concepts');

  const todaysWords = useMemo(() => getWordsForDate(new Date()), []);
  const todaysConcepts = useMemo(() => getConceptsForDate(new Date()), []);
  
  // Randomize for refresh
  const [randomContent, setRandomContent] = useState<{ words: typeof allWords, concepts: typeof multiLanguageConcepts } | null>(null);

  React.useEffect(() => {
    if (!refreshKey) {
        setRandomContent(null);
        return;
    }
    const words = [...allWords].sort(() => 0.5 - Math.random()).slice(0, 2);
    const concepts = [...multiLanguageConcepts].sort(() => 0.5 - Math.random()).slice(0, 1);
    setRandomContent({ words, concepts });
  }, [refreshKey]);

  const searchResults = useMemo(() => searchTerm.trim() ? searchWords(searchTerm) : [], [searchTerm]);
  const conceptSearchResults = useMemo(() => searchTerm.trim() ? searchConcepts(searchTerm) : [], [searchTerm]);

  const displayWords = compact 
    ? (randomContent ? randomContent.words : todaysWords.words.slice(0, 2)) 
    : (searchTerm.trim() ? searchResults : allWords);

  const displayConcepts = compact 
    ? (randomContent ? randomContent.concepts : todaysConcepts.slice(0, 1)) 
    : (searchTerm.trim() ? conceptSearchResults : multiLanguageConcepts);

  return (
    <div className="space-y-6">
      {/* View Mode Toggle - Hidden in compact mode */}
      {!compact && (
        <div className="flex gap-2 p-1 rounded-xl" style={{ backgroundColor: isDark ? currentTheme.colors.surface : '#f3f4f6' }}>
          <button onClick={() => setViewMode('concepts')} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: viewMode === 'concepts' ? currentTheme.colors.primary : 'transparent', color: viewMode === 'concepts' ? 'white' : currentTheme.colors.text }}>
            Multi-Language Concepts
          </button>
          <button onClick={() => setViewMode('words')} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors" style={{ backgroundColor: viewMode === 'words' ? currentTheme.colors.primary : 'transparent', color: viewMode === 'words' ? 'white' : currentTheme.colors.text }}>
            Individual Words
          </button>
        </div>
      )}

      {/* Search - Hidden in compact mode */}
      {!compact && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={viewMode === 'concepts' ? "Search concepts..." : "Search words..."}
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); }}
              className="w-full px-4 py-2.5 pl-10 rounded-xl text-sm transition-colors focus-ring"
              style={{ backgroundColor: isDark ? currentTheme.colors.surface : 'white', color: currentTheme.colors.text, border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}` }}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: isDark ? currentTheme.colors.textMuted : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      )}

      {/* Results count - Hidden in compact mode */}
      {!compact && (
        <p className="text-sm" style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>
          {viewMode === 'concepts' 
            ? (searchTerm.trim() ? `${conceptSearchResults.length} results` : `${multiLanguageConcepts.length} concepts in collection`)
            : (searchTerm.trim() ? `${searchResults.length} results` : `${allWords.length} words in collection`)
          }
        </p>
      )}

      {/* Content */}
      {viewMode === 'concepts' ? (
        <div className="grid gap-4">
          {displayConcepts.map((concept) => (
            <ConceptCard key={concept.id} concept={concept} expanded={expandedId === concept.id} onToggle={() => setExpandedId(expandedId === concept.id ? null : concept.id)} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {displayWords.map((word) => (
            <WordCard key={word.id} word={word} expanded={expandedId === word.id} onToggle={() => setExpandedId(expandedId === word.id ? null : word.id)} />
          ))}
        </div>
      )}

      {((viewMode === 'concepts' && displayConcepts.length === 0) || (viewMode === 'words' && displayWords.length === 0)) && (
        <div className="text-center py-12 rounded-2xl" style={{ backgroundColor: isDark ? currentTheme.colors.surface : 'white', border: `1px solid ${isDark ? currentTheme.colors.border : '#e5e7eb'}` }}>
          <svg className="w-12 h-12 mx-auto mb-3" style={{ color: isDark ? currentTheme.colors.textMuted : '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p style={{ color: isDark ? currentTheme.colors.textMuted : '#6b7280' }}>No {viewMode === 'concepts' ? 'concepts' : 'words'} found matching your search</p>
        </div>
      )}
    </div>
  );
};

export default Vocabulary;
