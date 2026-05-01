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
        console.log('   Старт: 3 мая 2026 | Финиш: 23 мая 2026 | 3 недели 🚀');
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

    _renderWeeks() {
        const weeksContainer = document.getElementById('weeksContainer');
        if (!weeksContainer) return;

        weeksContainer.innerHTML = courseData.weeks.map(week => `
            <div class="week-content${week.id === 1 ? ' week-content--active' : ''}" data-week="${week.id}">
                ${week.days.map(day => this._renderDay(day)).join('')}
            </div>
        `).join('');
    }

    _renderDay(day) {
        const isRest = day.type === 'rest';
        const blocks = day.blocks || [];
        const blocksCount = blocks.length;
        const extraBadges = day.extraBadges || [];
        
        const badgeClass = isRest ? 'day-card--rest' : '';
        
        return `
            <div class="day-card ${badgeClass}${day.type === 'study' ? '' : ''}" data-day="${day.id}" data-blocks="${blocksCount}">
                <div class="day-header">
                    <div class="day-indicator">${this._getDayShortName(day.dayName)}<br><small>${day.date}</small></div>
                    <div class="day-info">
                        <span class="day-name">${day.dayName}</span><br>
                        <span class="day-date">${day.timeInfo}</span>
                    </div>
${day.type === 'study' ? '<span class="day-badge day-badge--study">📚 Учёба</span>' : ''}
                    ${isRest ? '<span class="day-badge day-badge--rest">😴 Отдых</span>' : ''}
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
        });
    }

    expandAllDays() {
        document.querySelectorAll('.day-card').forEach(card => card.classList.add('day-card--open'));
    }

    collapseAllDays() {
        document.querySelectorAll('.day-card').forEach(card => card.classList.remove('day-card--open'));
    }

    resetProgress() {
        if (confirm('Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить.')) {
            progressManager.reset();
            this._updateProgressUI();
            this.collapseAllDays();
            const toast = document.getElementById('congratsToast');
            if (toast) toast.remove();
        }
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
}

window.uiController = new UIController();