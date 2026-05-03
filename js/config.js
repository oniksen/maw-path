// Конфигурация приложения
const CONFIG = {
    STORAGE_KEY: 'maw_roadmap_progress',
    TOTAL_BLOCKS: 25,
    START_DATE: '2026-05-04',
    END_DATE: '2026-05-24',
    VERSION: '1.0.0'
};

const STATS_TEMPLATE = [
    { icon: '🎬', value: '29 ч', label: 'Видеоматериалов' },
    { icon: '📝', value: '58 ч', label: 'С учётом практики', id: 'totalStudyHours' },
    { icon: '📦', value: '24', label: 'Учебных блоков', id: 'totalBlocks', accent: true },
    { icon: '🗓️', value: '15', label: 'Учебных дней', id: 'totalStudyDays' },
    { icon: '💪', value: '0', label: 'Дней спортзала / нед.' },
    { icon: '🧘', value: '9', label: 'Дней отдыха' }
];

const KEYBOARD_SHORTCUTS = {
    'KeyE': { ctrl: true, action: 'expandAll' },
    'KeyC': { ctrl: true, action: 'collapseAll' },
    'Digit1': { ctrl: true, action: 'week1' },
    'Digit2': { ctrl: true, action: 'week2' },
    'Digit3': { ctrl: true, action: 'week3' }
};

window.CONFIG = CONFIG;
window.STATS_TEMPLATE = STATS_TEMPLATE;
window.KEYBOARD_SHORTCUTS = KEYBOARD_SHORTCUTS;