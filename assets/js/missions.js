const ELDORIA_MISSIONS_KEY = "eldoria_missions_v1";

const ELDORIA_REQUIRED_MISSIONS = [
    "scene03",
    "scene04",
    "scene05",
    "scene06",
    "scene07",
    "scene08",
    "scene09"
];

function readMissionData() {
    try {
        const value = JSON.parse(
            localStorage.getItem(
                ELDORIA_MISSIONS_KEY
            ) || "{}"
        );

        if (
            typeof value !== "object" ||
            value === null ||
            Array.isArray(value)
        ) {
            return {};
        }

        return value;
    } catch {
        return {};
    }
}

function writeMissionData(data) {
    localStorage.setItem(
        ELDORIA_MISSIONS_KEY,
        JSON.stringify(data)
    );

    window.dispatchEvent(
        new Event(
            "eldoriaMissionsChanged"
        )
    );
}

function getMission(sceneId) {
    const data =
        readMissionData();

    return (
        data[sceneId] || {
            complete: false,
            progress: {}
        }
    );
}

function getProgress(
    sceneId,
    role
) {
    const mission =
        getMission(
            sceneId
        );

    const progress =
        mission.progress || {};

    return Number(
        progress[role] || 0
    );
}

function setProgress(
    sceneId,
    role,
    value
) {
    const data =
        readMissionData();

    if (!data[sceneId]) {
        data[sceneId] = {
            complete: false,
            progress: {}
        };
    }

    if (!data[sceneId].progress) {
        data[sceneId].progress = {};
    }

    data[sceneId].progress[role] =
        Math.max(
            0,
            Number(value) || 0
        );

    writeMissionData(
        data
    );
}

function markComplete(
    sceneId,
    role
) {
    const data =
        readMissionData();

    if (!data[sceneId]) {
        data[sceneId] = {
            complete: false,
            progress: {}
        };
    }

    data[sceneId].complete =
        true;

    data[sceneId].completedRole =
        role;

    data[sceneId].completedAt =
        Date.now();

    writeMissionData(
        data
    );
}

function isComplete(
    sceneId
) {
    return Boolean(
        getMission(
            sceneId
        ).complete
    );
}

function allComplete() {
    return ELDORIA_REQUIRED_MISSIONS.every(
        (sceneId) =>
            isComplete(
                sceneId
            )
    );
}

function isEndingSeen() {
    return Boolean(
        readMissionData()
            .endingSeen
    );
}

function markEndingSeen() {
    const data =
        readMissionData();

    data.endingSeen =
        true;

    writeMissionData(
        data
    );
}

function clearMissions() {
    localStorage.removeItem(
        ELDORIA_MISSIONS_KEY
    );

    window.dispatchEvent(
        new Event(
            "eldoriaMissionsChanged"
        )
    );
}

window.EldoriaMissions = {
    required:
        ELDORIA_REQUIRED_MISSIONS,

    get:
        getMission,

    getProgress,
    setProgress,
    markComplete,
    isComplete,
    allComplete,
    isEndingSeen,
    markEndingSeen,
    clear:
        clearMissions
};
