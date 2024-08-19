export interface Question {
    question: string;
    correctAnswer: number;
    answers: string[];
  }
  
export interface Objective {
    id: number;
    questions: Question[];
  }