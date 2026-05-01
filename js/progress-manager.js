class ProgressManager {
    constructor() {
        this.progress = this._loadProgress();
    }

    _loadProgress() {
        try {
            const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (typeof parsed === 'object' && parsed !== null) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('Failed to load progress from localStorage', e);
        }
        return {};
    }

    _saveProgress() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(this.progress));
        } catch (e) {
            console.error('Failed to save progress', e);
        }
    }

    isBlockCompleted(blockId) {
        return this.progress[blockId] === true;
    }

    toggleBlock(blockId) {
        if (this.progress[blockId]) {
            delete this.progress[blockId];
            this._saveProgress();
            return false;
        } else {
            this.progress[blockId] = true;
            this._saveProgress();
            return true;
        }
    }

    getCompletedCount() {
        return Object.keys(this.progress).filter(key => this.progress[key] === true).length;
    }

    getAllBlockIds() {
        return Object.keys(this.progress);
    }

    reset() {
        this.progress = {};
        this._saveProgress();
    }

    getProgressPercent() {
        const completed = this.getCompletedCount();
        const total = CONFIG.TOTAL_BLOCKS;
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }
}

window.progressManager = new ProgressManager();