import { SCORM } from "pipwerks-scorm-api-wrapper";

let Scorm = {
  init() {
    SCORM.init();
  },

  getLearnerName() {
    return SCORM.get("cmi.core.student_name");
  },

  submitMCQ(correct, response) {
    let nextIndex = SCORM.get("cmi.interactions._count", true);
    SCORM.set("cmi.interactions." + nextIndex + ".id", "round_" + nextIndex);
    SCORM.set("cmi.interactions." + nextIndex + ".type", "choice");
    SCORM.set("cmi.interactions." + nextIndex + ".student_response", response);
    SCORM.set(
      "cmi.interactions." + nextIndex + ".result",
      correct ? "correct" : "incorrect"
    );
  },

  setScormData(key, value) {
    SCORM.set(key, value);
    SCORM.save();
  },

  setSuspendData(data) {
    this.setScormData("cmi.suspend_data", JSON.stringify(data));
  },

  getSuspendData() {
    const data = SCORM.get("cmi.suspend_data");
    return data ? JSON.parse(data) : null;
  },

  setProgress(progress) {
    this.setScormData("cmi.progress_measure", progress);
  },

  setScore(score, maxScore = 100, minScore = 0, scaledScore = null) {
    this.setScormData("cmi.score.raw", score);
    this.setScormData("cmi.score.max", maxScore);
    this.setScormData("cmi.score.min", minScore);
    if (scaledScore !== null) {
      this.setScormData("cmi.score.scaled", scaledScore);
    }
    SCORM.save(); // Assurez-vous de sauvegarder après la mise à jour du score
  },

  // setScore(correctAnswers, totalQuestions) {
  //   this.setScormData("cmi.score.raw", (correctAnswers / totalQuestions) * 100); // Convertir en pourcentage pour SCORM
  // },

  setCompletionStatus(status) {
    this.setScormData("cmi.completion_status", status);
  },

  setSuccessStatus(status) {
    this.setScormData("cmi.success_status", status);
  },

  setObjectiveCompletion(identifier, status) {
    const index = this.getObjectiveIndex(identifier);
    if (index !== -1) {
      this.setScormData(`cmi.objectives.${index}.completion_status`, status);
    }
  },

  getObjectiveIndex(identifier) {
    const count = SCORM.get("cmi.objectives._count", true);
    for (let i = 0; i < count; i++) {
      const id = SCORM.get(`cmi.objectives.${i}.id`);
      if (id === identifier) {
        return i;
      }
    }
    return -1;
  },

  completeAndCloseCourse() {
    SCORM.save();
    SCORM.quit();
    window.close(); // Ferme la fenêtre du cours
  },
};

export default Scorm;
