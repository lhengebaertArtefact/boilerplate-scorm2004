import React from "react";

function CompleteButton({ completeActivity }) {
  const handleClick = () => {
    completeActivity();
  };

  return (
    <div>
      <p tabIndex="0">
        Cliquez sur le bouton pour terminer le cours et soumettre le score au
        LMS.
      </p>
      <button
        tabIndex="0"
        aria-label="Bouton pour finir le cours et soumettre le score au LMS"
        onClick={handleClick}
      >
        Complete
      </button>
    </div>
  );
}

export default CompleteButton;
