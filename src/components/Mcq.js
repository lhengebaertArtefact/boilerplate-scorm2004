import React, { useState } from "react";

function Mcq({ question, answers, correctAnswer, result }) {
  const [selectedOption, setSelectedOption] = useState(0);
  const [answered, setAnswered] = useState(false);

  const handleOptionChange = (changeEvent) => {
    setSelectedOption(Number(changeEvent.target.value));
  };

  const handleFormSubmit = (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    setAnswered(true);
    result(selectedOption === correctAnswer, answers[selectedOption]);
  };

  const renderAnswers = () => {
    return answers.map((answer, index) => (
      <div className="answer" key={index}>
        <input
          type="radio"
          value={index}
          checked={selectedOption === index}
          onChange={handleOptionChange}
          aria-label={`radio de sélection numéro ${
            index + 1
          } qui sélectionne la réponse ${answer}`}
          tabIndex="0"
        />
        <label tabIndex="0">{answer}</label>
      </div>
    ));
  };

  const checkCorrectAnswer = () => {
    if (selectedOption === correctAnswer) {
      return `Yes, ${answers[correctAnswer]} est la bonne réponse.`;
    } else {
      return `Vous avez répondu ${answers[selectedOption]}. Pardon, la bonne réponse est ${answers[correctAnswer]}.`;
    }
  };

  return (
    <div className="Mcq">
      <p tabIndex="0">{question}</p>
      {!answered ? (
        <form onSubmit={handleFormSubmit}>
          {renderAnswers()}
          <button
            type="submit"
            aria-label="bouton pour soumettre votre réponse"
            tabIndex="0"
          >
            Submit
          </button>
        </form>
      ) : (
        <div tabIndex="0">{checkCorrectAnswer()}</div>
      )}
    </div>
  );
}

export default Mcq;
