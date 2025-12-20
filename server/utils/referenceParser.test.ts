import { describe, it, expect } from 'vitest';
import {
  parseTopicMentions,
  parseJourneyMentions,
  parseReferences,
  validateTopicReferences,
  validateJourneyReferences,
  type TopicData,
  type JourneyData,
} from './referenceParser.js';

// Test data
const testTopics: TopicData[] = [
  { id: 1, title: 'The Story of Everything: From Big Bang to You' },
  { id: 2, title: 'Dancing with Gravity: The Force That Holds Us' },
  { id: 5, title: 'The Thinking Machine: How Computers Work' },
  { id: 9, title: 'The Dance of DNA: Your Genetic Blueprint' },
];

const testJourneys: JourneyData[] = [
  { id: 'first-trimester', name: 'First Trimester Journey' },
  { id: 'science-tech', name: 'Science & Technology' },
  { id: 'mind-body', name: 'Mind & Body' },
  { id: 'default', name: 'All In One Journey' },
];

describe('parseTopicMentions', () => {
  it('should parse topic mentions by ID (@1)', () => {
    const content = 'Today I learned about @1 and it was fascinating!';
    const result = parseTopicMentions(content, testTopics);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      topicId: 1,
      title: 'The Story of Everything: From Big Bang to You',
    });
  });

  it('should parse topic mentions by title (@[title])', () => {
    const content = 'I read @[The Dance of DNA: Your Genetic Blueprint] today.';
    const result = parseTopicMentions(content, testTopics);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      topicId: 9,
      title: 'The Dance of DNA: Your Genetic Blueprint',
    });
  });

  it('should parse multiple topic mentions', () => {
    const content = 'Learned about @1 and @5 today. Both were great!';
    const result = parseTopicMentions(content, testTopics);
    
    expect(result).toHaveLength(2);
    expect(result[0].topicId).toBe(1);
    expect(result[1].topicId).toBe(5);
  });

  it('should deduplicate topic mentions', () => {
    const content = 'I read @1 twice today. @1 was really good!';
    const result = parseTopicMentions(content, testTopics);
    
    expect(result).toHaveLength(1);
    expect(result[0].topicId).toBe(1);
  });

  it('should ignore invalid topic IDs', () => {
    const content = 'I tried to read @999 but it does not exist.';
    const result = parseTopicMentions(content, testTopics);
    
    expect(result).toHaveLength(0);
  });

  it('should ignore invalid topic titles', () => {
    const content = 'I tried to read @[Non-existent Topic] but it does not exist.';
    const result = parseTopicMentions(content, testTopics);
    
    expect(result).toHaveLength(0);
  });

  it('should be case-insensitive for title matching', () => {
    const content = 'I read @[the dance of dna: your genetic blueprint] today.';
    const result = parseTopicMentions(content, testTopics);
    
    expect(result).toHaveLength(1);
    expect(result[0].topicId).toBe(9);
  });

  it('should return empty array for content with no mentions', () => {
    const content = 'Just a regular journal entry with no mentions.';
    const result = parseTopicMentions(content, testTopics);
    
    expect(result).toHaveLength(0);
  });

  it('should handle mixed ID and title mentions', () => {
    const content = 'Read @1 and @[The Thinking Machine: How Computers Work] today.';
    const result = parseTopicMentions(content, testTopics);
    
    expect(result).toHaveLength(2);
    expect(result[0].topicId).toBe(1);
    expect(result[1].topicId).toBe(5);
  });
});

describe('parseJourneyMentions', () => {
  it('should parse journey mentions by ID (#id)', () => {
    const content = 'Started the #science-tech journey today!';
    const result = parseJourneyMentions(content, testJourneys);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      journeyId: 'science-tech',
      title: 'Science & Technology',
    });
  });

  it('should parse journey mentions by name (#[name])', () => {
    const content = 'Following #[Mind & Body] path.';
    const result = parseJourneyMentions(content, testJourneys);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      journeyId: 'mind-body',
      title: 'Mind & Body',
    });
  });

  it('should parse multiple journey mentions', () => {
    const content = 'Exploring #science-tech and #mind-body journeys.';
    const result = parseJourneyMentions(content, testJourneys);
    
    expect(result).toHaveLength(2);
    expect(result[0].journeyId).toBe('science-tech');
    expect(result[1].journeyId).toBe('mind-body');
  });

  it('should deduplicate journey mentions', () => {
    const content = 'Love #science-tech! #science-tech is the best!';
    const result = parseJourneyMentions(content, testJourneys);
    
    expect(result).toHaveLength(1);
    expect(result[0].journeyId).toBe('science-tech');
  });

  it('should ignore invalid journey IDs', () => {
    const content = 'Trying #non-existent-journey today.';
    const result = parseJourneyMentions(content, testJourneys);
    
    expect(result).toHaveLength(0);
  });

  it('should be case-insensitive for ID matching', () => {
    const content = 'Started #SCIENCE-TECH journey.';
    const result = parseJourneyMentions(content, testJourneys);
    
    expect(result).toHaveLength(1);
    expect(result[0].journeyId).toBe('science-tech');
  });

  it('should be case-insensitive for name matching', () => {
    const content = 'Following #[mind & body] path.';
    const result = parseJourneyMentions(content, testJourneys);
    
    expect(result).toHaveLength(1);
    expect(result[0].journeyId).toBe('mind-body');
  });

  it('should return empty array for content with no mentions', () => {
    const content = 'Just a regular journal entry with no journey mentions.';
    const result = parseJourneyMentions(content, testJourneys);
    
    expect(result).toHaveLength(0);
  });
});

describe('parseReferences', () => {
  it('should parse both topic and journey references', () => {
    const content = 'Today I read @1 as part of my #science-tech journey.';
    const result = parseReferences(content, testTopics, testJourneys);
    
    expect(result.topicReferences).toHaveLength(1);
    expect(result.topicReferences[0].topicId).toBe(1);
    expect(result.journeyReferences).toHaveLength(1);
    expect(result.journeyReferences[0].journeyId).toBe('science-tech');
  });

  it('should handle content with only topic references', () => {
    const content = 'Read @1 and @2 today.';
    const result = parseReferences(content, testTopics, testJourneys);
    
    expect(result.topicReferences).toHaveLength(2);
    expect(result.journeyReferences).toHaveLength(0);
  });

  it('should handle content with only journey references', () => {
    const content = 'Following #science-tech and #mind-body paths.';
    const result = parseReferences(content, testTopics, testJourneys);
    
    expect(result.topicReferences).toHaveLength(0);
    expect(result.journeyReferences).toHaveLength(2);
  });

  it('should handle content with no references', () => {
    const content = 'Just a regular entry.';
    const result = parseReferences(content, testTopics, testJourneys);
    
    expect(result.topicReferences).toHaveLength(0);
    expect(result.journeyReferences).toHaveLength(0);
  });
});

describe('validateTopicReferences', () => {
  it('should validate and return only valid topic references', () => {
    const refs = [
      { topicId: 1, title: 'Valid Topic' },
      { topicId: 999, title: 'Invalid Topic' },
      { topicId: 5, title: 'Another Valid Topic' },
    ];
    const result = validateTopicReferences(refs, testTopics);
    
    expect(result).toHaveLength(2);
    expect(result[0].topicId).toBe(1);
    expect(result[1].topicId).toBe(5);
  });

  it('should return empty array when all references are invalid', () => {
    const refs = [
      { topicId: 999, title: 'Invalid Topic' },
      { topicId: 1000, title: 'Another Invalid Topic' },
    ];
    const result = validateTopicReferences(refs, testTopics);
    
    expect(result).toHaveLength(0);
  });

  it('should return empty array for empty input', () => {
    const result = validateTopicReferences([], testTopics);
    expect(result).toHaveLength(0);
  });
});

describe('validateJourneyReferences', () => {
  it('should validate and return only valid journey references', () => {
    const refs = [
      { journeyId: 'science-tech', title: 'Valid Journey' },
      { journeyId: 'non-existent', title: 'Invalid Journey' },
      { journeyId: 'mind-body', title: 'Another Valid Journey' },
    ];
    const result = validateJourneyReferences(refs, testJourneys);
    
    expect(result).toHaveLength(2);
    expect(result[0].journeyId).toBe('science-tech');
    expect(result[1].journeyId).toBe('mind-body');
  });

  it('should return empty array when all references are invalid', () => {
    const refs = [
      { journeyId: 'non-existent', title: 'Invalid Journey' },
      { journeyId: 'also-non-existent', title: 'Another Invalid Journey' },
    ];
    const result = validateJourneyReferences(refs, testJourneys);
    
    expect(result).toHaveLength(0);
  });

  it('should return empty array for empty input', () => {
    const result = validateJourneyReferences([], testJourneys);
    expect(result).toHaveLength(0);
  });
});
