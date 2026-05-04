class UIController {
    constructor() {
        this.currentWeek = 1;
    }

    init() {
        this._renderStats();
        this._renderTabs();
        this._renderWeeks();
        this._bindEvents();
        this._updateProgressUI();
        
        console.log('📱 ModernAndroidWarrior Roadmap загружена!');
        console.log('   Горячие клавиши: Ctrl+1/2/3 — переключение недель, Ctrl+E — развернуть, Ctrl+C — свернуть');
        console.log('   Прогресс сохраняется в localStorage браузера.');
        console.log('   Всего блоков:', CONFIG.TOTAL_BLOCKS);
        console.log('   Старт: 4 мая 2026 | Финиш: 24 мая 2026 | 3 недели 🚀');
    }

    _renderStats() {
        const statsGrid = document.getElementById('statsGrid');
        if (!statsGrid) return;

        statsGrid.innerHTML = STATS_TEMPLATE.map(stat => `
            <div class="stat-card${stat.accent ? ' stat-card--accent' : ''}">
                <div class="stat-card__icon">${stat.icon}</div>
                <div class="stat-card__value"${stat.id ? ` id="${stat.id}"` : ''}>${stat.value}</div>
                <div class="stat-card__label">${stat.label}</div>
            </div>
        `).join('');
    }

    _renderTabs() {
        const tabsContainer = document.getElementById('tabsContainer');
        if (!tabsContainer) return;

        tabsContainer.innerHTML = courseData.weeks.map(week => `
            <button class="tab-btn${week.id === 1 ? ' tab-btn--active' : ''}" data-week="${week.id}">
                🗓 ${week.title} <small>(${week.subtitle})</small>
            </button>
        `).join('');

        tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const weekId = parseInt(btn.dataset.week);
                this.switchWeek(weekId);
            });
        });
    }

_applyGymDaysToWeek(weekData) {
        const gymDays = scheduleManager.getGymDays(weekData.id);
        const dayNameToNumber = {
            'Понедельник': 1, 'Вторник': 2, 'Среда': 3,
            'Четверг': 4, 'Пятница': 5, 'Суббота': 6, 'Воскресенье': 7
        };
        weekData.days.forEach(day => {
            const dayNum = dayNameToNumber[day.dayName];
            day.isGymDay = dayNum ? gymDays.indexOf(dayNum) !== -1 : false;
        });
    }

    _renderWeeks() {
        const weeksContainer = document.getElementById('weeksContainer');
        if (!weeksContainer) return;

        courseData.weeks.forEach(week => {
            this._applyGymDaysToWeek(week);
        });

        weeksContainer.innerHTML = courseData.weeks.map(week => `
            <div class="week-content${week.id === 1 ? ' week-content--active' : ''}" data-week="${week.id}">
                ${week.days.map(day => this._renderDay(day)).join('')}
            </div>
        `).join('');
    }

    _rerenderAllWeeks() {
        const currentWeekId = this.currentWeek;
        const weeksContainer = document.getElementById('weeksContainer');
        if (!weeksContainer) return;

        courseData.weeks.forEach(week => {
            this._applyGymDaysToWeek(week);
        });

        weeksContainer.innerHTML = courseData.weeks.map(week => `
            <div class="week-content${week.id === currentWeekId ? ' week-content--active' : ''}" data-week="${week.id}">
                ${week.days.map(day => this._renderDay(day)).join('')}
            </div>
        `).join('');
    }

_renderDay(day) {
        const isRest = day.type === 'rest';
        const blocks = day.blocks || [];
        const blocksCount = blocks.length;
        const extraBadges = day.extraBadges || [];
        const isGymDay = day.isGymDay;
        
        const badgeClass = isRest ? 'day-card--rest' : '';
        
        return `
            <div class="day-card ${badgeClass}${isGymDay ? ' day-card--has-gym' : ''}" data-day="${day.id}" data-blocks="${blocksCount}">
                <div class="day-header">
                    <div class="day-indicator">${this._getDayShortName(day.dayName)}<br><small>${day.date}</small></div>
                    <div class="day-info">
                        <span class="day-name">${day.dayName}</span><br>
                        <span class="day-date">${day.timeInfo}</span>
                    </div>
${day.type === 'study' ? '<span class="day-badge day-badge--study">📚 Учёба</span>' : ''}
                    ${isRest ? '<span class="day-badge day-badge--rest">😴 Отдых</span>' : ''}
                    ${isGymDay ? '<span class="day-badge day-badge--gym">🏋️ Спортзал</span>' : ''}
                    ${(extraBadges || []).map(badge => {
                        const badgeTypeClass = badge.type === 'gym' ? 'day-badge--gym' : 'day-badge--home';
                        const emoji = badge.type === 'gym' ? '🏋️' : '🏠';
                        return `<span class="day-badge ${badgeTypeClass}">${emoji} ${badge.label}</span>`;
                    }).join('')}
                    <span class="day-arrow">▾</span>
                </div>
                ${blocksCount > 0 ? `
                <div class="day-body">
                    ${blocks.map(block => this._renderBlock(block)).join('')}
                </div>
                ` : ''}
            </div>
        `;
    }

    _renderBlock(block) {
        const isCompleted = progressManager.isBlockCompleted(block.id);
        return `
            <div class="block-item${isCompleted ? ' block-item--completed' : ''}" data-block-id="${block.id}">
                <div class="block-checkbox"></div>
                <div class="block-info">
                    <span class="block-title">${block.title}</span><br>
                    <span class="block-meta">${block.meta}</span>
                </div>
                <span class="block-time">${block.time}</span>
            </div>
        `;
    }

    _getDayShortName(dayName) {
        const map = {
            'Воскресенье': 'ВС',
            'Понедельник': 'ПН',
            'Вторник': 'ВТ',
            'Среда': 'СР',
            'Четверг': 'ЧТ',
            'Пятница': 'ПТ',
            'Суббота': 'СБ'
        };
        return map[dayName] || dayName;
    }

    switchWeek(weekId) {
        this.currentWeek = weekId;
        
        document.querySelectorAll('.week-content').forEach(wc => {
            wc.classList.remove('week-content--active');
        });
        document.querySelectorAll('.tab-btn').forEach(tb => {
            tb.classList.remove('tab-btn--active');
        });
        
        const targetContent = document.querySelector(`.week-content[data-week="${weekId}"]`);
        const targetTab = document.querySelector(`.tab-btn[data-week="${weekId}"]`);
        
        if (targetContent) targetContent.classList.add('week-content--active');
        if (targetTab) targetTab.classList.add('tab-btn--active');
        
        // Прокрутка к началу контента
        const weeksContainer = document.getElementById('weeksContainer');
        if (weeksContainer) {
            weeksContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    _updateProgressUI() {
        const completed = progressManager.getCompletedCount();
        const total = CONFIG.TOTAL_BLOCKS;
        const percent = progressManager.getProgressPercent();

        const fill = document.getElementById('progressFill');
        const percentEl = document.getElementById('progressPercent');
        const completedCountEl = document.getElementById('completedCount');
        const remainingBlocksEl = document.getElementById('remainingBlocks');
        const totalBlocksCountEl = document.getElementById('totalBlocksCount');

        if (fill) fill.style.width = percent + '%';
        if (percentEl) percentEl.textContent = percent + '%';
        if (completedCountEl) completedCountEl.textContent = completed;
        if (remainingBlocksEl) remainingBlocksEl.textContent = total - completed;
        if (totalBlocksCountEl) totalBlocksCountEl.textContent = total;

        this._updateBlockStates();
        this._updateDayStates();

        if (completed >= total && total > 0) {
            this._showCongrats();
        }
    }

    _updateBlockStates() {
        document.querySelectorAll('.block-item[data-block-id]').forEach(item => {
            const bid = item.dataset.blockId;
            if (progressManager.isBlockCompleted(bid)) {
                item.classList.add('block-item--completed');
            } else {
                item.classList.remove('block-item--completed');
            }
        });
    }

    _updateDayStates() {
        document.querySelectorAll('.day-card[data-blocks]').forEach(dayCard => {
            const blocksCount = parseInt(dayCard.dataset.blocks) || 0;
            if (blocksCount === 0) return;
            
            const blockItems = dayCard.querySelectorAll('.block-item[data-block-id]');
            const allDone = blockItems.length > 0 && 
                Array.from(blockItems).every(bi => progressManager.isBlockCompleted(bi.dataset.blockId));
            
            if (allDone) {
                dayCard.classList.add('day-card--completed');
            } else {
                dayCard.classList.remove('day-card--completed');
            }
        });
    }

    _bindEvents() {
        // Делегирование событий на контейнер недель
        const weeksContainer = document.getElementById('weeksContainer');
        if (weeksContainer) {
            weeksContainer.addEventListener('click', (e) => {
                // Клик по блоку
                const blockItem = e.target.closest('.block-item[data-block-id]');
                if (blockItem) {
                    const blockId = blockItem.dataset.blockId;
                    progressManager.toggleBlock(blockId);
                    this._updateProgressUI();
                    
                    // Анимация
                    blockItem.classList.add('block-item--highlight');
                    setTimeout(() => blockItem.classList.remove('block-item--highlight'), 600);
                    
                    if (progressManager.isBlockCompleted(blockId)) {
                        const checkbox = blockItem.querySelector('.block-checkbox');
                        if (checkbox) {
                            checkbox.style.transform = 'scale(1.4)';
                            setTimeout(() => { checkbox.style.transform = 'scale(1)'; }, 250);
                        }
                    }
                    return;
                }
                
                // Клик по заголовку дня
                const dayHeader = e.target.closest('.day-header');
                if (dayHeader) {
                    const dayCard = dayHeader.closest('.day-card');
                    if (dayCard) {
                        dayCard.classList.toggle('day-card--open');
                    }
                    return;
                }
            });
        }

        // Кнопки управления
        document.getElementById('expandAllBtn')?.addEventListener('click', () => this.expandAllDays());
        document.getElementById('collapseAllBtn')?.addEventListener('click', () => this.collapseAllDays());
        document.getElementById('resetProgressBtn')?.addEventListener('click', () => this.resetProgress());
        document.getElementById('scrollTopBtn')?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

// Горячие клавиши
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                this.expandAllDays();
            }
            if (e.ctrlKey && e.key === 'c') {
                e.preventDefault();
                this.collapseAllDays();
            }
            if (e.ctrlKey && e.key === '1') {
                e.preventDefault();
                this.switchWeek(1);
            }
            if (e.ctrlKey && e.key === '2') {
                e.preventDefault();
                this.switchWeek(2);
            }
            if (e.ctrlKey && e.key === '3') {
                e.preventDefault();
                this.switchWeek(3);
            }
            if (e.ctrlKey && e.key === 'g') {
                e.preventDefault();
                this.openGymPlanner();
            }
        });

        // Кнопка планировщика зала
        document.getElementById('gymPlannerBtn')?.addEventListener('click', () => this.openGymPlanner());
    }

    expandAllDays() {
        document.querySelectorAll('.day-card').forEach(card => card.classList.add('day-card--open'));
    }

    collapseAllDays() {
        document.querySelectorAll('.day-card').forEach(card => card.classList.remove('day-card--open'));
    }

resetProgress() {
        const choice = confirm(
            'Вы уверены, что хотите сбросить прогресс?\n\n' +
            'OK — сбросить прогресс и настройки спортзала\n' +
            'Отмена — сбросить только прогресс'
        );
        
        if (choice) {
            progressManager.reset();
            if (window.settingsManager) {
                window.settingsManager.resetGymDays();
            }
            this._rerenderAllWeeks();
        } else {
            progressManager.reset();
        }
        
        this._updateProgressUI();
        this.collapseAllDays();
        const toast = document.getElementById('congratsToast');
        if (toast) toast.remove();
    }

    _showCongrats() {
        if (document.getElementById('congratsToast')) return;
        
        this._spawnConfetti();
        
        const toast = document.createElement('div');
        toast.id = 'congratsToast';
        toast.style.cssText = `
            position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
            background: var(--gradient-primary); color: white; padding: 16px 28px;
            border-radius: var(--radius-full); font-weight: 700; font-size: 1rem;
            z-index: 10000; box-shadow: var(--shadow-xl); 
            animation: fadeSlideIn 0.5s var(--transition-bouncy);
            cursor: pointer; text-align: center;
        `;
        toast.textContent = '🎉 Поздравляем! Курс полностью пройден! Вы — Modern Android Warrior! 🚀';
        toast.onclick = () => toast.remove();
        document.body.appendChild(toast);
        
        setTimeout(() => {
            const t = document.getElementById('congratsToast');
            if (t) t.remove();
        }, 8000);
    }

_spawnConfetti() {
        const colors = [
            '#6750A4', '#E040FB', '#FF4081', '#FF6E40', '#536DFE', 
            '#448AFF', '#B388FF', '#7C4DFF', '#00E676', '#FFD740', '#FF6D00'
        ];
        
        for (let i = 0; i < 60; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = -(Math.random() * 60 + 20) + 'px';
                confetti.style.width = (Math.random() * 12 + 6) + 'px';
                confetti.style.height = (Math.random() * 12 + 6) + 'px';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '3px';
                confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
                document.body.appendChild(confetti);
                setTimeout(() => confetti.remove(), 3000);
            }, i * 25);
        }
    }

    openGymPlanner() {
        const existing = document.getElementById('gymPlannerOverlay');
        if (existing) {
            existing.remove();
        }

        const weekNumber = this.currentWeek;
        const gymDays = scheduleManager.getGymDays(weekNumber);
        const templates = scheduleManager.getTemplates();

        const overlay = document.createElement('div');
        overlay.id = 'gymPlannerOverlay';
        overlay.className = 'gym-planner-overlay';

        overlay.innerHTML = `
            <div class="gym-planner-modal">
                <div class="gym-planner-header">
                    <h2 class="gym-planner-title">🏋️ Неделя ${weekNumber}</h2>
                    <button class="gym-planner-close" id="gymPlannerCloseBtn">&times;</button>
                </div>
                <div class="gym-planner-body">
                    <div class="gym-planner-section-title">Выберите дни тренировок</div>
                    ${this._renderDayPickerCells(gymDays)}
                    
                    <div class="gym-planner-section-title">Шаблоны</div>
                    <div class="template-chips">
                        ${templates.map(t => `
                            <div class="template-chip" data-days="${t.days.join(',')}" data-template="${t.name}">${t.label}</div>
                        `).join('')}
                    </div>
                    
                    <div class="gym-planner-warning" id="gymPlannerWarning">
                        <strong>Внимание:</strong> Выберите хотя бы один день без тренировок для сложных тем.
                    </div>
                </div>
                <div class="gym-planner-footer">
                    <button class="btn btn--outline btn--sm" id="cancelPlanner">Отмена</button>
                    <button class="btn btn--primary btn--sm" id="applyPlanner">Применить</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this._bindPlannerEvents(overlay, weekNumber);
    }

    _renderDayPickerCells(activeDays) {
        const dayNames = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];
        
        return `
            <div class="day-picker-grid">
                ${dayNames.map((name, index) => {
                    const dayNum = index + 1;
                    const isActive = activeDays.indexOf(dayNum) !== -1;
                    const icon = isActive ? '🏋️' : '⚪';
                    return `
                        <div class="day-picker-cell${isActive ? ' day-picker-cell--active' : ''}" data-day="${dayNum}">
                            <span class="day-picker-cell__icon">${icon}</span>
                            <span class="day-picker-cell__label">${name}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    _closeGymPlanner() {
        const overlay = document.getElementById('gymPlannerOverlay');
        if (overlay) {
            overlay.remove();
        }
    }

    _bindPlannerEvents(overlay, weekNumber) {
        const self = this;
        const currentGymDays = scheduleManager.getGymDays(weekNumber);
        let selectedDays = currentGymDays.slice();

        const updateCells = function() {
            const cells = overlay.querySelectorAll('.day-picker-cell');
            cells.forEach(function(cell) {
                const dayNum = parseInt(cell.dataset.day);
                if (selectedDays.indexOf(dayNum) !== -1 && selectedDays.indexOf(dayNum) !== -1) {
                    cell.classList.add('day-picker-cell--active');
                    cell.querySelector('.day-picker-cell__icon').textContent = '🏋️';
                } else {
                    cell.classList.remove('day-picker-cell--active');
                    cell.querySelector('.day-picker-cell__icon').textContent = '⚪';
                }
            });

            const warning = document.getElementById('gymPlannerWarning');
            if (warning) {
                const hasGymEveryDay = selectedDays.length >= 7;
                warning.classList.toggle('gym-planner-warning--visible', hasGymEveryDay);
            }
        };

        overlay.querySelectorAll('.day-picker-cell').forEach(function(cell) {
            cell.addEventListener('click', function() {
                const dayNum = parseInt(cell.dataset.day);
                const idx = selectedDays.indexOf(dayNum);
                if (idx !== -1) {
                    selectedDays.splice(idx, 1);
                } else {
                    selectedDays.push(dayNum);
                }
                updateCells();
            });
        });

        overlay.querySelectorAll('.template-chip').forEach(function(chip) {
            chip.addEventListener('click', function() {
                const daysStr = chip.dataset.days;
                selectedDays = daysStr.split(',').map(function(d) { return parseInt(d); });
                
                overlay.querySelectorAll('.template-chip').forEach(function(c) {
                    c.classList.remove('template-chip--active');
                });
                chip.classList.add('template-chip--active');
                
                updateCells();
            });
        });

        document.getElementById('gymPlannerCloseBtn').addEventListener('click', function() {
            self._closeGymPlanner();
        });

        document.getElementById('cancelPlanner').addEventListener('click', function() {
            self._closeGymPlanner();
        });

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                self._closeGymPlanner();
            }
        });

        document.addEventListener('keydown', function escapeHandler(e) {
            if (e.key === 'Escape') {
                self._closeGymPlanner();
                document.removeEventListener('keydown', escapeHandler);
            }
        });

        document.getElementById('applyPlanner').addEventListener('click', function() {
            scheduleManager.setGymDays(weekNumber, selectedDays);
            self._closeGymPlanner();
            self._reRenderCurrentWeek();
            self._showToast('Расписание сохранено!', 'success');
        });
    }

    _reRenderCurrentWeek() {
        const self = this;
        const weekNumber = this.currentWeek;
        const weekData = courseData.weeks.find(function(w) { return w.id === weekNumber; });
        if (!weekData) return;

        const gymDays = scheduleManager.getGymDays(weekNumber);

        const dayNameToNumber = {
            'Понедельник': 1,
            'Вторник': 2,
            'Среда': 3,
            'Четверг': 4,
            'Пятница': 5,
            'Суббота': 6,
            'Воскресенье': 7
        };

        weekData.days.forEach(function(day) {
            const dayNum = dayNameToNumber[day.dayName];
            day.isGymDay = dayNum ? gymDays.indexOf(dayNum) !== -1 : false;
        });

        const weekContainer = document.querySelector('.week-content[data-week="' + weekNumber + '"]');
        if (weekContainer) {
            weekContainer.innerHTML = weekData.days.map(function(day) {
                return self._renderDay(day);
            }).join('');
        }

        this._updateProgressUI();
    }

    _showToast(message, type) {
        const existing = document.querySelector('.gym-planner-toast');
        if (existing) {
            existing.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'gym-planner-toast gym-planner-toast--' + type;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(function() {
            toast.remove();
        }, 3000);
    }
}

window.uiController = new UIController();