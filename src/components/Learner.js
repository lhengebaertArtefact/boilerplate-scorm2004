import React from "react";

function Learner({ name }) {
  const lmsCheck = () => {
    if (name === "null") {
      return "Oops! Il semble que votre nom ne soit pas enregistré dans le LMS.";
    }
    return "";
  };

  return (
    <div>
      <p tabIndex="0" aria-label={`Bonjour, ${name}!`}>
        Hi, {name}!
      </p>

      <p>{lmsCheck()}</p>
    </div>
  );
}

export default Learner;
