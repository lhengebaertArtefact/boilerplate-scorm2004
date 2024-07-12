import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import Learner from "./components/Learner";
import Scorm from "./scorm/scorm";
import CompleteButton from "./components/CompleteButton";
import Mcq from "./components/Mcq";

function App() {
  const [learnerName, setLearnerName] = useState("cher visiteur");
  const [tabKeyPressed, setTabKeyPressed] = useState(false);
  const [assessment, setAssessment] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [completedObjectives, setCompletedObjectives] = useState([]); // Nouvel état
  const [searchParams] = useSearchParams();
  const objectiveId = parseInt(searchParams.get("objective"), 10);

  const objectives = [
    {
      id: 1,
      questions: [
        {
          question: "What is 10*10?",
          correctAnswer: 0,
          answers: ["100", "20"],
        },
        {
          question: "What is the capital of Spain?",
          correctAnswer: 2,
          answers: ["Barcelona", "Lisbon", "Madrid"],
        },
        {
          question:
            "Which US President's office commissioned the creation of SCORM?",
          correctAnswer: 3,
          answers: [
            "Donald Trump",
            "Barack Obama",
            "Ronald Reagan",
            "Bill Clinton",
          ],
        },
      ],
    },
    {
      id: 2,
      questions: [
        {
          question: "What is 5+5?",
          correctAnswer: 0,
          answers: ["10", "15"],
        },
        {
          question: "What is the capital of France?",
          correctAnswer: 1,
          answers: ["Rome", "Paris", "Berlin"],
        },
        {
          question: "Who developed the theory of relativity?",
          correctAnswer: 2,
          answers: [
            "Isaac Newton",
            "Galileo Galilei",
            "Albert Einstein",
            "Nikola Tesla",
          ],
        },
      ],
    },
  ];

  const currentObjective = objectives.find((obj) => obj.id === objectiveId);

  const currentQuestions = currentObjective ? currentObjective.questions : [];

  useEffect(() => {
    console.log("Initializing SCORM...");
    Scorm.init();
    Scorm.setSuccessStatus("unknown");
    Scorm.setCompletionStatus("incomplete");
    const savedData = Scorm.getSuspendData();

    if (savedData) {
      setCurrentQuestionIndex(savedData.currentQuestionIndex);
      setAssessment(savedData.assessment);
      setCompletedObjectives(savedData.completedObjectives || []); // Charger les objectifs complétés
    }

    const handleKeyDown = (event) => {
      if (event.key === "Tab") {
        setTabKeyPressed(true);
        requestAnimationFrame(() => {
          const activeElement = document.activeElement;
          if (activeElement) {
            const label =
              activeElement.getAttribute("aria-label") ||
              activeElement.innerText;
            if (label) {
              const utterance = new SpeechSynthesisUtterance(label);
              window.speechSynthesis.speak(utterance);
            }
          }
        });
      }
    };

    const handleMouseDown = (event) => {
      event.preventDefault();
      setTabKeyPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      console.log("Terminating SCORM");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [objectiveId]);

  const updateAssessment = useCallback(
    (correct, response) => {
      setAssessment((prevAssessment) => [...prevAssessment, correct]);
      Scorm.submitMCQ(correct, response);
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      if (nextIndex >= currentQuestions.length) {
        setQuizComplete(true);
        Scorm.setCompletionStatus("completed");
      } else {
        Scorm.setSuspendData({
          currentQuestionIndex: nextIndex,
          assessment,
          objectiveId,
          completedObjectives,
        });
        const progress = nextIndex / currentQuestions.length;
        Scorm.setProgress(progress);
      }
    },
    [
      currentQuestionIndex,
      currentQuestions,
      assessment,
      objectiveId,
      completedObjectives,
    ]
  );

  const completeObjective = useCallback(() => {
    const correctAnswers = assessment.filter(
      (answer) => answer === true
    ).length;
    const totalQuestionsAnswered = currentQuestions.length;
    const scorePercent = (correctAnswers / totalQuestionsAnswered) * 100;
    const scoreScaled = correctAnswers / totalQuestionsAnswered;
    Scorm.setScore(scorePercent, 100, 0, scoreScaled);

    const isPassed = correctAnswers >= 2;
    Scorm.setSuccessStatus(isPassed ? "passed" : "failed");
    Scorm.setObjectiveCompletion(`objective_${objectiveId}`, "completed");

    // Ajouter l'objectif actuel à la liste des objectifs complétés
    setCompletedObjectives((prevCompleted) => [...prevCompleted, objectiveId]);
    Scorm.setSuspendData({
      completedObjectives: [...completedObjectives, objectiveId],
    });

    // Réinitialiser l'état du quiz pour l'objectif actuel
    setCurrentQuestionIndex(0);
    setAssessment([]);
    setQuizComplete(false);
  }, [assessment, currentQuestions.length, objectiveId, completedObjectives]);

  const progressText = `${currentQuestionIndex + 1} / ${
    currentQuestions.length
  } (${Math.round(
    ((currentQuestionIndex + 1) / currentQuestions.length) * 100
  )}%)`;

  if (completedObjectives.includes(objectiveId)) {
    return (
      <div className="App">
        <header className="App-header">
          <img
            src={logo}
            className="App-logo"
            alt="logo de l'application"
            tabIndex="0"
            aria-label="logo de l'application"
          />
          <Learner name={learnerName} />
          <div className="progress">Progress: {progressText}</div>
        </header>
        <main>
          <p>Vous avez déjà complété cet objectif.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          className="App-logo"
          alt="logo de l'application"
          tabIndex="0"
          aria-label="logo de l'application"
        />
        <Learner name={learnerName} />
        <div className="progress">Progress: {progressText}</div>
      </header>
      <main>
        {quizComplete ? (
          <div>
            <p>Merci d'avoir terminé le quiz!</p>
            <CompleteButton completeActivity={completeObjective} />
          </div>
        ) : (
          <Mcq
            key={currentQuestionIndex}
            result={updateAssessment}
            question={currentQuestions[currentQuestionIndex]?.question}
            correctAnswer={
              currentQuestions[currentQuestionIndex]?.correctAnswer
            }
            answers={currentQuestions[currentQuestionIndex]?.answers}
          />
        )}
      </main>
    </div>
  );
}

export default App;
