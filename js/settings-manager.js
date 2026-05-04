class SettingsManager {
    constructor() {
        this._storageKey = 'maw_app_settings';
        this._data = this._load();
    }

    _load() {
        try {
            const stored = localStorage.getItem(this._storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (typeof parsed === 'object' && parsed !== null) {
                    return {
                        progress: parsed.progress || {},
                        gymDays: parsed.gymDays || {}
                    };
                }
            }
        } catch (e) {
            console.warn('Failed to load settings from localStorage', e);
        }
        return {
            progress: {},
            gymDays: {}
        };
    }

    _save() {
        try {
            localStorage.setItem(this._storageKey, JSON.stringify(this._data));
        } catch (e) {
            console.error('Failed to save settings', e);
        }
    }

    get(key) {
        return this._data[key];
    }

    set(key, value) {
        this._data[key] = value;
        this._save();
    }

    reset() {
        this._data = {
            progress: {},
            gymDays: {}
        };
        this._save();
    }

    getProgress() {
        return this._data.progress || {};
    }

    setProgress(progress) {
        this._data.progress = progress;
        this._save();
    }

    getGymDays(weekNumber) {
        const weekData = this._data.gymDays[weekNumber];
        if (weekData && Array.isArray(weekData.days)) {
            return weekData.days;
        }
        return [];
    }

    setGymDays(weekNumber, days) {
        if (!this._data.gymDays[weekNumber]) {
            this._data.gymDays[weekNumber] = {};
        }
        this._data.gymDays[weekNumber].days = days.slice ? days.slice() : [];
        this._save();
    }

    resetGymDays() {
        this._data.gymDays = {};
        this._save();
    }

    getAllGymDays() {
        return this._data.gymDays || {};
    }
}

window.settingsManager = new SettingsManager();