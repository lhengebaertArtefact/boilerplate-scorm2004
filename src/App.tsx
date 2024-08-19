import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import "./App.css";
import Learner from "./components/Learner";
import Scorm from "./scorm/scorm";
import CompleteButton from "./components/CompleteButton";
import Mcq from "./components/Mcq";
import { useTranslation } from "react-i18next";
import { Objective } from "./types/types";
import { SHOW_CHANGE_LOCALE } from "./config/config";

const App: React.FC = () => {
  const { t } = useTranslation();

  const [learnerName, setLearnerName] = useState<string>("");
  const [tabKeyPressed, setTabKeyPressed] = useState<boolean>(false);
  const [assessment, setAssessment] = useState<boolean[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [quizComplete, setQuizComplete] = useState<boolean>(false);
  const [completedObjectives, setCompletedObjectives] = useState<number[]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const objectiveId = parseInt(searchParams.get("objective") || "0", 10);

  const { i18n } = useTranslation();

  const changeLanguage = (lang: any) => {
    i18n.changeLanguage(lang);
  };

  const objectives: Objective[] = [
    {
      id: 1,
      questions: [
        {
          question: t("questions.0.question"),
          correctAnswer: 0,
          answers: [t("questions.0.answers.0"), t("questions.0.answers.1")],
        },
        {
          question: t("questions.1.question"),
          correctAnswer: 2,
          answers: [
            t("questions.1.answers.0"),
            t("questions.1.answers.1"),
            t("questions.1.answers.2"),
          ],
        },
        {
          question: t("questions.2.question"),
          correctAnswer: 3,
          answers: [
            t("questions.2.answers.0"),
            t("questions.2.answers.1"),
            t("questions.2.answers.2"),
            t("questions.2.answers.3"),
          ],
        },
      ],
    },
    {
      id: 2,
      questions: [
        {
          question: t("questions.3.question"),
          correctAnswer: 0,
          answers: [t("questions.3.answers.0"), t("questions.3.answers.1")],
        },
        {
          question: t("questions.4.question"),
          correctAnswer: 1,
          answers: [
            t("questions.4.answers.0"),
            t("questions.4.answers.1"),
            t("questions.4.answers.2"),
          ],
        },
        {
          question: t("questions.5.question"),
          correctAnswer: 2,
          answers: [
            t("questions.5.answers.0"),
            t("questions.5.answers.1"),
            t("questions.5.answers.2"),
            t("questions.5.answers.3"),
          ],
        },
      ],
    },
  ];

  const currentObjective = objectives.find((obj) => obj.id === objectiveId);
  const currentQuestions = currentObjective ? currentObjective.questions : [];

  useEffect(() => {
    Scorm.init(); // Initialisation du SCORM
    Scorm.setSuccessStatus("unknown"); // mettre le statut de succès à unknown sinon le LMS le met à passed
    Scorm.setCompletionStatus("incomplete"); // mettre le statut de complétion à incomplete sinon le LMS le met à completed
    const savedData = Scorm.getSuspendData();

    if (savedData) {
      setCurrentQuestionIndex(savedData.currentQuestionIndex);
      setAssessment(savedData.assessment);
      setCompletedObjectives(savedData.completedObjectives || []);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        setTabKeyPressed(true);
        requestAnimationFrame(() => {
          const activeElement: any = document.activeElement;
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

    const handleMouseDown = (event: MouseEvent) => {
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
  }, []);

  const updateAssessment = useCallback(
    (correct: boolean, response: string) => {
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
    const scoreScaled: any = correctAnswers / totalQuestionsAnswered;
    Scorm.setScore(scorePercent, 100, 0, scoreScaled);

    const isPassed = correctAnswers >= 2;
    Scorm.setSuccessStatus(isPassed ? "passed" : "failed");
    Scorm.setObjectiveCompletion(`objective_${objectiveId}`, "completed");

    setCompletedObjectives((prevCompleted) => [...prevCompleted, objectiveId]);
    Scorm.setSuspendData({
      completedObjectives: [...completedObjectives, objectiveId],
    });

    setCurrentQuestionIndex(0);
    setAssessment([]);
    setQuizComplete(false);
    navigate("/"); // Retour à la page d'accueil
  }, [
    assessment,
    currentQuestions.length,
    objectiveId,
    completedObjectives,
    navigate,
  ]);

  const progressText = `${currentQuestionIndex + 1} / ${
    currentQuestions.length
  } (${Math.round(
    ((currentQuestionIndex + 1) / currentQuestions.length) * 100
  )}%)`;

  return (
    <div className="App">
      <header className="App-header">
        <Learner name={learnerName} />
        {SHOW_CHANGE_LOCALE && (
          <div>
            <button onClick={() => changeLanguage("en")}>English</button>
            <button onClick={() => changeLanguage("fr")}>Français</button>
          </div>
        )}

        {searchParams.get("objective") && (
          <div className="progress">Progress: {progressText}</div>
        )}
      </header>
      <main>
        {searchParams.get("objective") ? (
          completedObjectives.includes(objectiveId) ? (
            <p>{t("objectiveCompleted")}</p>
          ) : quizComplete ? (
            <div>
              <p>{t("buttons.completeQuiz")}</p>
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
          )
        ) : (
          <>
            <h1>{t("welcome")}</h1>
            <button
              onClick={() => navigate("/?objective=1")}
              disabled={completedObjectives.includes(1)}
            >
              {t("buttons.startObjective1")}
            </button>
            <button
              onClick={() => navigate("/?objective=2")}
              disabled={
                !completedObjectives.includes(1) ||
                completedObjectives.includes(2)
              }
            >
              {t("buttons.startObjective2")}
            </button>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
