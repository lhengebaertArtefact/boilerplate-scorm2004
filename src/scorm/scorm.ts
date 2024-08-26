const SCORM: any = require("pipwerks-scorm-api-wrapper").SCORM;

let Scorm = {
  
  init() {
    const initialized = SCORM.init();
    if (!initialized) {
      console.error("SCORM API failed to initialize.");
    } else {
      console.log("SCORM API initialized successfully.");
    }
  },

  terminate() {
    const terminated = SCORM.quit();
    if (!terminated) {
      console.error("SCORM API failed to terminate.");
    } else {
      console.log("SCORM API terminated successfully.");
    }
  },

  setObjectiveStatus(objectiveId: string, status: "completed" | "incomplete") {
    const objectiveIndex = this.getObjectiveIndex(objectiveId);
    if (objectiveIndex !== -1) {
      SCORM.set(`cmi.objectives.${objectiveIndex}.completion_status`, status);
      SCORM.save();
    } else {
      console.error(`Objective ${objectiveId} not found.`);
    }
  },

  setCompletionStatus(status: "completed" | "incomplete") {
    SCORM.set("cmi.completion_status", status);
    SCORM.save();
  },

  getObjectiveIndex(objectiveId: string) {
    const count = parseInt(SCORM.get("cmi.objectives._count") || "0", 10);
    for (let i = 0; i < count; i++) {
      if (SCORM.get(`cmi.objectives.${i}.id`) === objectiveId) {
        return i;
      }
    }
    return -1;
  },

  getSuspendData() {
    const data = SCORM.get("cmi.suspend_data");
    return data ? JSON.parse(data) : null;
  },

  setSuspendData(data: object) {
    SCORM.set("cmi.suspend_data", JSON.stringify(data));
    SCORM.save();
  },

  get(element: string) {
    return SCORM.get(element);
  },

  set(element: string, value: string) {
    SCORM.set(element, value);
    SCORM.save();
  },

  save() {
    SCORM.save();
  }
};

export default Scorm;
