import React, { useState, useEffect } from 'react';

interface TextInputExercise {
  word?: string;
  sounds?: string[];
  instruction: string;
  answer: string;
  hint: string;
}

interface TimedGridExercise {
  items: string[];
  type: string;
  rows: number;
  cols: number;
  targetTime: number;
}

interface TimedReadingExercise {
  passage: string;
  wordCount: number;
  targetTime: number;
  targetWPM: number;
}

interface SequenceRecallExercise {
  sequence?: number[];
  words?: string[];
  length: number;
  reverse?: boolean;
  displayTime: number;
}

interface MultipleChoiceExercise {
  passage?: string;
  sentence?: string;
  scenario?: string;
  word?: string;
  sounds?: string[];
  pattern?: string;
  sequence?: string[];
  task?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
}

interface VisualFeedbackExercise {
  letter?: string;
  sound?: string;
  prompt: string;
  visualHint: string;
  pattern?: string;
  focus?: string;
  technique?: string;
  number?: number;
  quantity?: string;
  task?: string;
}

interface ExerciseLevel {
  id: number;
  name: string;
  instructions: string;
  exerciseType: 'text-input' | 'timed-grid' | 'timed-reading' | 'sequence-recall' | 'multiple-choice' | 'visual-feedback';
  exercises: TextInputExercise[] | TimedGridExercise[] | TimedReadingExercise[] | SequenceRecallExercise[] | MultipleChoiceExercise[] | VisualFeedbackExercise[];
}

interface TrainingData {
  name: string;
  description: string;
  levels: ExerciseLevel[];
}

interface TrainingExerciseProps {
  interventionId: string;
  trainingData: TrainingData;
  onComplete?: (score: number) => void;
}

const TrainingExercise: React.FC<TrainingExerciseProps> = ({ interventionId, trainingData, onComplete }) => {
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [textInput, setTextInput] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // Timed grid state (RAN)
  const [gridItems, setGridItems] = useState<string[]>([]);
  const [gridIndex, setGridIndex] = useState<number>(0);
  const [gridStartTime, setGridStartTime] = useState<number>(0);
  const [gridComplete, setGridComplete] = useState<boolean>(false);
  const [gridTimes, setGridTimes] = useState<number[]>([]);

  // Sequence recall state (Working Memory)
  const [memoryInput, setMemoryInput] = useState<string>('');
  const [memorySequence, setMemorySequence] = useState<number[] | string[]>([]);
  const [showMemoryInput, setShowMemoryInput] = useState<boolean>(false);
  const [memoryDisplayTime, setMemoryDisplayTime] = useState<number>(0);

  // Multiple choice state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Visual feedback state
  const [visualComplete, setVisualComplete] = useState<boolean>(false);

  const level = trainingData.levels[currentLevel];
  const exercise = level.exercises[currentExercise];
  const totalExercises = level.exercises.length;

  useEffect(() => {
    setStartTime(Date.now());
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    // Reset state when exercise changes
    setTextInput('');
    setFeedback(null);
    setGridComplete(false);
    setGridIndex(0);
    setShowMemoryInput(false);
    setMemoryInput('');
    setSelectedOption(null);
    setVisualComplete(false);

    const exerciseType = level.exerciseType;

    if (exerciseType === 'timed-grid' && !gridComplete) {
      const gridExercise = exercise as TimedGridExercise;
      setGridItems(gridExercise.items);
      setGridIndex(0);
      setGridStartTime(Date.now());
    }

    if (exerciseType === 'sequence-recall' && !showMemoryInput) {
      const memExercise = exercise as SequenceRecallExercise;
      if (memExercise.sequence) {
        setMemorySequence(memExercise.sequence);
      } else if (memExercise.words) {
        setMemorySequence(memExercise.words);
      }
      setMemoryDisplayTime(memExercise.displayTime);
      setShowMemoryInput(false);
      setMemoryInput('');
    }
  }, [currentExercise, interventionId]);

  const handleTextInputSubmit = () => {
    const textExercise = exercise as TextInputExercise;
    const isCorrect = textInput.toLowerCase().trim() === textExercise.answer.toLowerCase().trim();

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      if (currentExercise < totalExercises - 1) {
        setCurrentExercise(currentExercise + 1);
        setTextInput('');
        setFeedback(null);
      } else {
        setIsComplete(true);
        if (onComplete) onComplete(score + (isCorrect ? 1 : 0));
      }
    }, 1500);
  };

  const handleGridComplete = () => {
    const timeTaken = (Date.now() - gridStartTime) / 1000;
    setGridTimes([...gridTimes, timeTaken]);
    setGridComplete(true);
    const gridExercise = exercise as TimedGridExercise;
    const isSuccessful = timeTaken <= gridExercise.targetTime;
    if (isSuccessful) setScore(score + 1);

    setTimeout(() => {
      if (currentExercise < totalExercises - 1) {
        setCurrentExercise(currentExercise + 1);
        setGridComplete(false);
        setGridIndex(0);
        setGridStartTime(Date.now());
      } else {
        setIsComplete(true);
        if (onComplete) onComplete(score + (isSuccessful ? 1 : 0));
      }
    }, 2000);
  };

  const handleMemorySubmit = () => {
    const memExercise = exercise as SequenceRecallExercise;
    let isCorrect = false;

    if (memExercise.sequence) {
      const inputNumbers = memoryInput.split(',').map(n => parseInt(n.trim()));
      if (memExercise.reverse) {
        isCorrect = JSON.stringify(inputNumbers) === JSON.stringify([...memExercise.sequence].reverse());
      } else {
        isCorrect = JSON.stringify(inputNumbers) === JSON.stringify(memExercise.sequence);
      }
    } else if (memExercise.words) {
      const inputWords = memoryInput.split(',').map(w => w.trim());
      if (memExercise.reverse) {
        isCorrect = JSON.stringify(inputWords) === JSON.stringify([...memExercise.words].reverse());
      } else {
        isCorrect = JSON.stringify(inputWords) === JSON.stringify(memExercise.words);
      }
    }

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      if (currentExercise < totalExercises - 1) {
        setCurrentExercise(currentExercise + 1);
        setMemoryInput('');
        setFeedback(null);
        setShowMemoryInput(false);
      } else {
        setIsComplete(true);
        if (onComplete) onComplete(score + (isCorrect ? 1 : 0));
      }
    }, 1500);
  };

  const handleMultipleChoiceSubmit = () => {
    const mcExercise = exercise as MultipleChoiceExercise;
    const isCorrect = selectedOption === mcExercise.correctAnswer;

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(score + 1);

    setTimeout(() => {
      if (currentExercise < totalExercises - 1) {
        setCurrentExercise(currentExercise + 1);
        setSelectedOption(null);
        setFeedback(null);
      } else {
        setIsComplete(true);
        if (onComplete) onComplete(score + (isCorrect ? 1 : 0));
      }
    }, 1500);
  };

  const handleVisualFeedbackComplete = () => {
    setVisualComplete(true);
    setScore(score + 1);

    setTimeout(() => {
      if (currentExercise < totalExercises - 1) {
        setCurrentExercise(currentExercise + 1);
        setVisualComplete(false);
      } else {
        setIsComplete(true);
        if (onComplete) onComplete(score + 1);
      }
    }, 2000);
  };

  const handleNextLevel = () => {
    if (currentLevel < trainingData.levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setCurrentExercise(0);
      setScore(0);
      setIsComplete(false);
      setFeedback(null);
      setGridComplete(false);
      setGridTimes([]);
      setShowMemoryInput(false);
      setSelectedOption(null);
      setVisualComplete(false);
    } else {
      alert('All levels completed!');
    }
  };

  if (isComplete) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Level Complete!</h2>
        <div className="text-center py-8">
          <p className="text-4xl font-bold text-blue-600 mb-2">
            {score} / {totalExercises}
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Score: {Math.round((score / totalExercises) * 100)}%
          </p>
          {currentLevel < trainingData.levels.length - 1 ? (
            <button
              onClick={handleNextLevel}
              className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              Next Level
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentLevel(0);
                setCurrentExercise(0);
                setScore(0);
                setIsComplete(false);
                setFeedback(null);
                setGridComplete(false);
                setGridTimes([]);
                setShowMemoryInput(false);
                setSelectedOption(null);
                setVisualComplete(false);
              }}
              className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    );
  }

  // Multiple choice exercises
  if (level.exerciseType === 'multiple-choice') {
    const mcExercise = exercise as MultipleChoiceExercise;
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{level.name}</h3>
          <p className="text-gray-600 mb-4">{level.instructions}</p>
          <p className="text-sm text-gray-500">Exercise {currentExercise + 1} of {totalExercises}</p>
        </div>

        <div className="text-center py-8">
          {mcExercise.passage && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-gray-700 italic">"{mcExercise.passage}"</p>
            </div>
          )}
          {mcExercise.sentence && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-gray-700 italic">"{mcExercise.sentence}"</p>
            </div>
          )}
          {mcExercise.scenario && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-blue-800"><strong>Scenario:</strong> {mcExercise.scenario}</p>
            </div>
          )}
          {mcExercise.word && (
            <div className="text-4xl font-bold text-blue-600 mb-6">
              Word: {mcExercise.word}
            </div>
          )}
          {mcExercise.sounds && (
            <div className="text-2xl font-bold text-blue-600 mb-6">
              Sounds: {mcExercise.sounds.join(', ')}
            </div>
          )}
          {mcExercise.pattern && (
            <div className="text-2xl font-bold text-blue-600 mb-6">
              Pattern: {mcExercise.pattern}
            </div>
          )}
          {mcExercise.sequence && (
            <div className="text-2xl font-bold text-blue-600 mb-6">
              Sequence: {mcExercise.sequence.join(', ')}
            </div>
          )}
          {mcExercise.task && (
            <div className="text-xl font-bold text-gray-700 mb-6">
              Task: {mcExercise.task}
            </div>
          )}

          <p className="text-xl font-bold text-gray-900 mb-6">{mcExercise.question}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
            {mcExercise.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(index)}
                disabled={feedback !== null}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedOption === index
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                } ${feedback !== null ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={handleMultipleChoiceSubmit}
            disabled={selectedOption === null || feedback !== null}
            className="px-8 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>

          {mcExercise.hint && (
            <p className="mt-4 text-sm text-gray-500 italic">Hint: {mcExercise.hint}</p>
          )}

          {feedback && (
            <p className={`mt-6 text-xl font-bold ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
              {feedback === 'correct' ? 'Correct!' : 'Try again'}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Visual feedback exercises
  if (level.exerciseType === 'visual-feedback') {
    const vfExercise = exercise as VisualFeedbackExercise;
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{level.name}</h3>
          <p className="text-gray-600 mb-4">{level.instructions}</p>
          <p className="text-sm text-gray-500">Exercise {currentExercise + 1} of {totalExercises}</p>
        </div>

        {!visualComplete ? (
          <div className="text-center py-12">
            {vfExercise.letter && (
              <div className="text-8xl font-bold text-blue-600 mb-8">
                {vfExercise.letter}
              </div>
            )}
            {vfExercise.sound && (
              <div className="text-4xl font-bold text-blue-600 mb-8">
                Sound: {vfExercise.sound}
              </div>
            )}
            {vfExercise.number && (
              <div className="text-8xl font-bold text-blue-600 mb-8">
                {vfExercise.number}
              </div>
            )}
            {vfExercise.quantity && (
              <div className="text-4xl font-bold text-blue-600 mb-8">
                {vfExercise.quantity}
              </div>
            )}
            {vfExercise.pattern && (
              <div className="text-2xl font-bold text-blue-600 mb-8">
                Pattern: {vfExercise.pattern}
              </div>
            )}
            {vfExercise.focus && (
              <div className="text-2xl font-bold text-blue-600 mb-8">
                Focus: {vfExercise.focus}
              </div>
            )}
            {vfExercise.technique && (
              <div className="text-2xl font-bold text-blue-600 mb-8">
                Technique: {vfExercise.technique}
              </div>
            )}
            {vfExercise.task && (
              <div className="text-xl font-bold text-gray-700 mb-8">
                Task: {vfExercise.task}
              </div>
            )}

            <p className="text-xl text-gray-700 mb-6">{vfExercise.prompt}</p>

            <div className="bg-blue-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
              <p className="text-blue-800 text-sm">
                <strong>Visual Hint:</strong> {vfExercise.visualHint}
              </p>
            </div>

            <button
              onClick={handleVisualFeedbackComplete}
              className="px-8 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
            >
              Complete Exercise
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl font-bold text-green-600 mb-4">Exercise Complete!</p>
            <p className="text-lg text-gray-600">Great job practicing this technique.</p>
            <p className="text-lg text-gray-600 mt-4">Next exercise starting...</p>
          </div>
        )}
      </div>
    );
  }

  // Text input exercises (Phonological Training)
  if (level.exerciseType === 'text-input') {
    const textExercise = exercise as TextInputExercise;
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{level.name}</h3>
          <p className="text-gray-600 mb-4">{level.instructions}</p>
          <p className="text-sm text-gray-500">Exercise {currentExercise + 1} of {totalExercises}</p>
        </div>

        <div className="text-center py-12">
          {textExercise.word && (
            <div className="text-6xl font-bold text-blue-600 mb-8">
              {textExercise.word}
            </div>
          )}
          {textExercise.sounds && (
            <div className="text-4xl font-bold text-blue-600 mb-8 tracking-wider">
              {textExercise.sounds.join(' - ')}
            </div>
          )}
          <p className="text-lg text-gray-700 mb-6">{textExercise.instruction}</p>

          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleTextInputSubmit()}
            placeholder="Type your answer..."
            className="w-64 p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            aria-label="Type your answer"
            disabled={feedback !== null}
          />
          <br />
          <button
            onClick={handleTextInputSubmit}
            disabled={feedback !== null || textInput.trim() === ''}
            className="px-8 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
          {textExercise.hint && (
            <p className="mt-4 text-sm text-gray-500 italic">Hint: {textExercise.hint}</p>
          )}

          {feedback && (
            <p className={`mt-6 text-xl font-bold ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
              {feedback === 'correct' ? 'Correct!' : 'Try again'}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Timed grid exercises (RAN Training)
  if (level.exerciseType === 'timed-grid') {
    const gridExercise = exercise as TimedGridExercise;
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{level.name}</h3>
          <p className="text-gray-600 mb-4">{level.instructions}</p>
          <p className="text-sm text-gray-500">Exercise {currentExercise + 1} of {totalExercises}</p>
        </div>

        {!gridComplete ? (
          <div className="text-center py-12">
            <div
              className="inline-grid gap-4 mb-8"
              style={{ gridTemplateColumns: `repeat(${gridExercise.cols}, 1fr)` }}
            >
              {gridItems.map((item, index) => (
                <div
                  key={index}
                  className={`w-20 h-20 flex items-center justify-center text-3xl font-bold rounded-lg border-2 ${
                    index === gridIndex
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : index < gridIndex
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : 'border-gray-300 bg-gray-50 text-gray-400'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                if (gridIndex < gridItems.length - 1) {
                  setGridIndex(gridIndex + 1);
                } else {
                  handleGridComplete();
                }
              }}
              className="px-8 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
            >
              {gridIndex < gridItems.length - 1 ? 'Next' : 'Complete'}
            </button>
            <p className="mt-4 text-gray-500">Time: {elapsedTime}s</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-2xl font-bold text-gray-900 mb-4">Exercise Complete!</p>
            <p className="text-lg text-gray-600">Time taken: {((Date.now() - gridStartTime) / 1000).toFixed(1)}s</p>
            <p className="text-lg text-gray-600">Target time: {gridExercise.targetTime}s</p>
            <p className="text-lg text-gray-600 mt-4">Next exercise starting...</p>
          </div>
        )}
      </div>
    );
  }

  // Timed reading exercises (Fluency Training)
  if (level.exerciseType === 'timed-reading') {
    const readingExercise = exercise as TimedReadingExercise;
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{level.name}</h3>
          <p className="text-gray-600 mb-4">{level.instructions}</p>
          <p className="text-sm text-gray-500">Exercise {currentExercise + 1} of {totalExercises}</p>
        </div>

        <div className="text-center py-12">
          <div className="text-left max-w-3xl mx-auto mb-8">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="text-xl text-gray-900 leading-relaxed font-serif">
                {readingExercise.passage}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg text-gray-700 mb-2">Word count: {readingExercise.wordCount}</p>
            <p className="text-lg text-gray-700 mb-2">Target time: {readingExercise.targetTime}s</p>
            <p className="text-lg text-gray-700 mb-2">Target speed: {readingExercise.targetWPM} WPM</p>
            <p className="text-lg text-gray-700">Current time: {elapsedTime}s</p>
          </div>

          <button
            onClick={() => {
              const wpm = Math.round((readingExercise.wordCount / elapsedTime) * 60);
              const isSuccessful = wpm >= readingExercise.targetWPM;
              if (isSuccessful) setScore(score + 1);

              if (currentExercise < totalExercises - 1) {
                setCurrentExercise(currentExercise + 1);
              } else {
                setIsComplete(true);
                if (onComplete) onComplete(score + (isSuccessful ? 1 : 0));
              }
            }}
            className="px-8 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
          >
            Complete
          </button>
        </div>
      </div>
    );
  }

  // Sequence recall exercises (Working Memory)
  if (level.exerciseType === 'sequence-recall') {
    const memExercise = exercise as SequenceRecallExercise;
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{level.name}</h3>
          <p className="text-gray-600 mb-4">{level.instructions}</p>
          <p className="text-sm text-gray-500">Exercise {currentExercise + 1} of {totalExercises}</p>
        </div>

        {!showMemoryInput ? (
          <div className="text-center py-12">
            <div className="text-4xl font-bold text-blue-600 mb-8 tracking-wider">
              {Array.isArray(memorySequence) ? memorySequence.join(' - ') : ''}
            </div>
            <button
              onClick={() => setShowMemoryInput(true)}
              className="px-8 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl"
            >
              I Remember It
            </button>
            <p className="mt-4 text-gray-500">Memorize the sequence above</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl font-bold text-gray-900 mb-4">Enter the sequence {memExercise.reverse ? '(in reverse order)' : ''}</p>
            <input
              type="text"
              value={memoryInput}
              onChange={(e) => setMemoryInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleMemorySubmit()}
              placeholder="e.g., 3, 7, 2"
              className="w-64 p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              aria-label="Enter remembered sequence"
            />
            <br />
            <button
              onClick={handleMemorySubmit}
              disabled={memoryInput.trim() === ''}
              className="px-8 py-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
            {feedback && (
              <p className={`mt-4 text-lg font-bold ${feedback === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                {feedback === 'correct' ? 'Correct!' : 'Try again'}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  return <div className="text-center py-12">Exercise type not yet implemented</div>;
};

export default TrainingExercise;
