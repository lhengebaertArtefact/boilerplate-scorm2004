import React, { useEffect } from "react";
import Scorm from "./scorm/scorm";

const App: React.FC = () => {
  useEffect(() => {
    // Initialisation de SCORM
    Scorm.init();

    // Optionnel : Récupérer des données suspendues ou effectuer d'autres opérations
    const savedData = Scorm.getSuspendData();
    if (savedData) {
      // Traiter les données sauvegardées si nécessaire
      console.log("Données suspendues récupérées:", savedData);
    }

    return () => {
      // Nettoyage à la fin de la session, si nécessaire
      Scorm.terminate();
    };
  }, []);

  const completeObjective = (objectiveId: string) => {
    Scorm.setObjectiveStatus(objectiveId, "completed");
    Scorm.setCompletionStatus("completed");

    const isContinueValid = Scorm.get("adl.nav.request_valid.continue");
    if (isContinueValid === "true") {
      Scorm.set("adl.nav.request", "continue");
      Scorm.terminate();
    } else {
      console.log("La navigation vers l'objectif suivant n'est pas valide.");
    }
  };

  return (
    <div>
      <h1>Quiz 1</h1>
      <button onClick={() => completeObjective("objective_1")}>
        Compléter Objectif 1 et Passer à l'Objectif 2
      </button>
    </div>
  );
};

export default App;
