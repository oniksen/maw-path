(function() {
    function parseTimeToMinutes(timeStr) {
        if (!timeStr) return 0;
        
        var total = 0;
        
        var hoursMatch = timeStr.match(/(\d+)\s*ч/);
        if (hoursMatch) {
            total += parseInt(hoursMatch[1]) * 60;
        }
        
        var minutesMatch = timeStr.match(/(\d+)\s*м/);
        if (minutesMatch) {
            total += parseInt(minutesMatch[1]);
        }
        
        if (total === 0) {
            var simpleMatch = timeStr.match(/(\d+)/);
            if (simpleMatch) {
                total = parseInt(simpleMatch[1]);
            }
        }
        
        return total;
    }

    function getGymScheduleStorage() {
        try {
            var stored = localStorage.getItem('maw_gym_schedule');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Failed to load gym schedule from localStorage', e);
        }
        return {};
    }

    function saveGymScheduleStorage(data) {
        try {
            localStorage.setItem('maw_gym_schedule', JSON.stringify(data));
        } catch (e) {
            console.error('Failed to save gym schedule', e);
        }
    }

    var scheduleManager = {
        DEFAULT_GYM_DAYS: [],

        getGymDays: function(weekNumber) {
            var storage = getGymScheduleStorage();
            var weekData = storage[weekNumber];
            if (weekData && Array.isArray(weekData.days)) {
                return weekData.days;
            }
            return this.DEFAULT_GYM_DAYS.slice();
        },

        setGymDays: function(weekNumber, days) {
            var storage = getGymScheduleStorage();
            if (!storage[weekNumber]) {
                storage[weekNumber] = {};
            }
            storage[weekNumber].days = days.slice ? days.slice() : [];
            saveGymScheduleStorage(storage);
            return true;
        },

        getTemplates: function() {
            return [
                { name: 'standard', label: 'Стандарт (СР, ПТ, ВС)', days: [3, 5, 7] },
                { name: 'intense', label: 'Интенсив (ПН, СР, ЧТ, СБ)', days: [1, 3, 4, 6] },
                { name: 'light', label: 'Лайт (только ВС)', days: [7] }
            ];
        },

        recalculateWeek: function(weekNumber, weekData) {
            if (!weekData || !weekData || !weekData.days) {
                return { success: false, message: 'Некорректные данные недели', schedule: [] };
            }

            var gymDays = this.getGymDays(weekNumber);
            var allBlocks = [];

            weekData.days.forEach(function(day, dayIndex) {
                var dayNum = dayIndex + 1;
                if (day.blocks && day.blocks.length > 0) {
                    day.blocks.forEach(function(block) {
                        allBlocks.push({
                            block: block,
                            originalDay: dayNum,
                            dayIndex: dayIndex
                        });
                    });
                }
            });

            var hard = [];
            var medium = [];
            var easy = [];

            allBlocks.forEach(function(item) {
                var blockId = item.block.id;
                var meta = window.blocksMeta && window.blocksMeta[blockId];
                var difficulty = (meta && meta.difficulty) || 'medium';
                
                if (progressManager && progressManager.isBlockCompleted && progressManager.isBlockCompleted(blockId)) {
                    return;
                }
                
                if (difficulty === 'hard') {
                    hard.push(item);
                } else if (difficulty === 'easy') {
                    easy.push(item);
                } else {
                    medium.push(item);
                }
            });

            var buffer = [];
            var newSchedule = [];
            var MAX_MINUTES_PER_DAY = 240;

            for (var dayNum = 1; dayNum <= 7; dayNum++) {
                var isGymDay = gymDays.indexOf(dayNum) !== -1;
                var dayBlocks = [];
                var dayMinutes = 0;

                if (isGymDay) {
                    while (easy.length > 0 && dayMinutes < MAX_MINUTES_PER_DAY) {
                        var block = easy.shift();
                        var time = parseTimeToMinutes(block.block.time);
                        if (dayMinutes + time <= MAX_MINUTES_PER_DAY) {
                            dayBlocks.push(block);
                            dayMinutes += time;
                        } else {
                            easy.unshift(block);
                            break;
                        }
                    }
                    while (buffer.length > 0 && dayMinutes < MAX_MINUTES_PER_DAY) {
                        var block = buffer.shift();
                        var time = parseTimeToMinutes(block.block.time);
                        if (dayMinutes + time <= MAX_MINUTES_PER_DAY) {
                            dayBlocks.push(block);
                            dayMinutes += time;
                        } else {
                            buffer.unshift(block);
                            break;
                        }
                    }
                } else {
                    while (buffer.length > 0 && dayMinutes < MAX_MINUTES_PER_DAY) {
                        var block = buffer.shift();
                        var time = parseTimeToMinutes(block.block.time);
                        if (dayMinutes + time <= MAX_MINUTES_PER_DAY) {
                            dayBlocks.push(block);
                            dayMinutes += time;
                        } else {
                            buffer.unshift(block);
                            break;
                        }
                    }
                    while (hard.length > 0 && dayMinutes < MAX_MINUTES_PER_DAY) {
                        var block = hard.shift();
                        var time = parseTimeToMinutes(block.block.time);
                        if (dayMinutes + time <= MAX_MINUTES_PER_DAY) {
                            dayBlocks.push(block);
                            dayMinutes += time;
                        } else {
                            hard.unshift(block);
                            break;
                        }
                    }
                    while (medium.length > 0 && dayMinutes < MAX_MINUTES_PER_DAY) {
                        var block = medium.shift();
                        var time = parseTimeToMinutes(block.block.time);
                        if (dayMinutes + time <= MAX_MINUTES_PER_DAY) {
                            dayBlocks.push(block);
                            dayMinutes += time;
                        } else {
                            medium.unshift(block);
                            break;
                        }
                    }
                    while (easy.length > 0 && dayMinutes < MAX_MINUTES_PER_DAY) {
                        var block = easy.shift();
                        var time = parseTimeToMinutes(block.block.time);
                        if (dayMinutes + time <= MAX_MINUTES_PER_DAY) {
                            dayBlocks.push(block);
                            dayMinutes += time;
                        } else {
                            easy.unshift(block);
                            break;
                        }
                    }
                }

                newSchedule.push({
                    day: dayNum,
                    isGymDay: isGymDay,
                    blocks: dayBlocks
                });
            }

            var overflowBlocks = buffer.concat(hard).concat(medium).concat(easy);

            if (overflowBlocks.length > 0) {
                var ids = overflowBlocks.map(function(item) {
                    return item.block.id;
                });
                return {
                    success: false,
                    message: 'Не удалось разместить все блоки. Переполнение: ' + ids.join(', '),
                    overflowBlocks: ids
                };
            }

            return {
                success: true,
                message: 'Расписание успешно перераспределено',
                schedule: newSchedule
            };
        }
    };

    window.scheduleManager = scheduleManager;
})();