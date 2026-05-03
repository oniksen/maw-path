// Данные курса
const courseData = {
    weeks: [
        {
            id: 1,
            title: 'Неделя 1',
subtitle: '4–10 мая',
days: [
                {
                    id: 'mon-1',
                    dayName: 'Понедельник',
                    date: '4 мая',
                    timeInfo: '18:00–21:00',
                    type: 'study',
                    blocks: [
                        { id: '1-1', title: 'Глава 1, Блок 1. Android Structure', meta: 'Просмотр + практика AIDL + конспект', time: '2ч 48м' },
                        { id: '1-5', title: 'Глава 1, Блок 2. AOT vs JIT', meta: 'Микроблок ~40 мин', time: '40м' }
                    ]
                },
                {
                    id: 'tue-1',
                    dayName: 'Вторник',
                    date: '5 мая',
                    timeInfo: '18:30–21:00',
                    type: 'study',
                    blocks: [
                        { id: '1-2', title: 'Глава 1, Блок 1.5. Сеть (часть 1)', meta: 'Полный просмотр видео + конспект', time: '2ч 30м' },
                        { id: '1-6', title: 'Глава 1, Блок 3. Java Memory Model', meta: 'Микроблок ~1 ч', time: '1ч' }
                    ]
                },
                {
                    id: 'wed-1',
                    dayName: 'Среда',
                    date: '6 мая',
                    timeInfo: 'Выходной',
                    type: 'rest',
                    extraBadges: [{ type: 'gym', label: 'Спортзал' }]
                },
                {
                    id: 'thu-1',
                    dayName: 'Четверг',
                    date: '7 мая',
                    timeInfo: '18:00–21:00',
                    type: 'study',
                    blocks: [
                        { id: '1-3', title: 'Глава 1, Блок 1.5. Сеть (часть 2)', meta: 'Повтор практики: с видео + без видео', time: '3ч' }
                    ]
                },
                {
                    id: 'fri-1',
                    dayName: 'Пятница',
                    date: '8 мая',
                    timeInfo: 'Домашние дела',
                    type: 'rest',
                    extraBadges: [
                        { type: 'home', label: 'Дела' },
                        { type: 'gym', label: 'Спортзал' }
                    ]
                },
                {
                    id: 'sat-1',
                    dayName: 'Суббота',
                    date: '9 мая',
                    timeInfo: '7:00–12:15',
                    type: 'study',
                    blocks: [
                        { id: '1-4', title: 'Глава 1, Блок 4. Background Work', meta: 'Просмотр + практика + конспект (часть 1)', time: '2ч 15м' },
                        { id: '1-8', title: 'Глава 1, Блок 6. UI', meta: 'Микроблок ~53 мин', time: '53м' }
                    ]
                },
                {
                    id: 'sun-1',
                    dayName: 'Воскресенье',
                    date: '10 мая',
                    timeInfo: '10:00–15:30 (спортзал утром)',
                    type: 'study',
                    extraBadges: [{ type: 'gym', label: 'Зал' }],
                    blocks: [
                        { id: '1-7', title: 'Глава 1, Блок 5. Performance', meta: 'Микроблок ~50 мин', time: '50м' },
                        { id: '1-9', title: 'Глава 2, Блок 2. Clean Architecture', meta: 'Микроблок ~45 мин', time: '45м' },
                        { id: '1-10', title: 'Глава 2, Блок 3. SOLID', meta: 'Микроблок ~30 мин', time: '30м' },
                        { id: '1-4b', title: 'Глава 1, Блок 4. Background Work', meta: 'Повтор практики + конспект (часть 2)', time: '2ч' }
                    ]
                }
            ]
        },
        {
            id: 2,
            title: 'Неделя 2',
subtitle: '11–17 мая',
days: [
                {
                    id: 'mon-2',
                    dayName: 'Понедельник',
                    date: '11 мая',
                    timeInfo: '18:00–21:00',
                    type: 'study',
                    blocks: [
                        { id: '2-1', title: 'Глава 2, Блок 1. Многомодульность (часть 1)', meta: 'Просмотр + конспект', time: '3ч' },
                        { id: '2-2', title: 'Глава 2, Блок 1. Многомодульность (часть 2)', meta: 'Практика + повтор', time: '3ч 6м' }
                    ]
                },
                {
                    id: 'tue-2',
                    dayName: 'Вторник',
                    date: '12 мая',
                    timeInfo: '18:00–21:10',
                    type: 'study',
                    blocks: [
                        { id: '2-7', title: 'Глава 2, Блок 7. Ошибки в проекте', meta: '~30 мин', time: '30м' }
                    ]
                },
                {
                    id: 'wed-2',
                    dayName: 'Среда',
                    date: '13 мая',
                    timeInfo: 'Выходной',
                    type: 'rest',
                    extraBadges: [{ type: 'gym', label: 'Спортзал' }]
                },
                {
                    id: 'thu-2',
                    dayName: 'Четверг',
                    date: '14 мая',
                    timeInfo: '18:00–21:03',
                    type: 'study',
                    blocks: [
                        { id: '2-8', title: 'Глава 3, Блок 1. Зачем нам сборка', meta: '~30 мин', time: '30м' },
                        { id: '2-9', title: 'Глава 3, Блок 2. Основы Gradle', meta: '~1ч 48м', time: '1ч 48м' },
                        { id: '2-10', title: 'Глава 3, Блок 3. Зависимости', meta: '~2ч 02м', time: '2ч 02м' },
                        { id: '2-11', title: 'Глава 3, Блок 4. Kotlin Multiplatform', meta: '~39 мин', time: '39м' }
                    ]
                },
{
                    id: 'fri-2',
                    dayName: 'Пятница',
                    date: '15 мая',
                    timeInfo: 'Домашние дела',
                    type: 'rest',
                    extraBadges: [
                        { type: 'home', label: 'Дела' },
                        { type: 'gym', label: 'Спортзал' }
                    ]
                },
                {
                    id: 'sat-2',
                    dayName: 'Суббота',
                    date: '16 мая',
                    timeInfo: '7:00–12:30',
                    type: 'study',
                    blocks: [
                        { id: '2-12', title: 'Глава 3, Блок 5. Flavors, Builds & Execution', meta: '~4ч 47м', time: '4ч 47м' },
                        { id: '2-13', title: 'Глава 4, Блок 1. Тайны XML', meta: '~1ч 08м', time: '1ч 08м' }
                    ]
                },
                {
                    id: 'sun-2',
                    dayName: 'Воскресенье',
                    date: '17 мая',
                    timeInfo: 'Выходной',
                    type: 'rest',
                    extraBadges: [{ type: 'gym', label: 'Спортзал' }]
                }
            ]
        },
        {
            id: 3,
            title: 'Неделя 3',
subtitle: '18–24 мая',
            days: [
                {
                    id: 'mon-3',
                    dayName: 'Понедельник',
                    date: '18 мая',
                    timeInfo: '18:00–20:40',
                    type: 'study',
                    blocks: [
                        { id: '3-1', title: 'Глава 3, Блок 6. Публикация артефакта', meta: '~2ч 40м', time: '2ч 40м' }
                    ]
                },
                {
                    id: 'tue-3',
                    dayName: 'Вторник',
                    date: '19 мая',
                    timeInfo: '18:30–21:00',
                    type: 'study',
                    blocks: [
                        { id: '3-2', title: 'Глава 4, Блок 2. Jetpack Compose Internals', meta: '~1ч 17м', time: '1ч 17м' },
                        { id: '3-3', title: 'Глава 4, Блок 3. UI Performance (часть 1)', meta: '~1ч 13м', time: '1ч 13м' }
                    ]
                },
                {
                    id: 'wed-3',
                    dayName: 'Среда',
                    date: '20 мая',
                    timeInfo: 'Выходной',
                    type: 'rest',
                    extraBadges: [{ type: 'gym', label: 'Спортзал' }]
                },
                {
                    id: 'thu-3',
                    dayName: 'Четверг',
                    date: '21 мая',
                    timeInfo: '18:00–21:00',
                    type: 'study',
                    blocks: [
                        { id: '3-4', title: 'Глава 4, Блок 3. UI Performance (окончание)', meta: '~1ч 07м', time: '1ч 07м' },
                        { id: '3-5', title: 'Глава 4, Блок 3.5. Обзор Tracer', meta: '~35 мин', time: '35м' },
                        { id: '3-6', title: 'Глава 4, Блок 4. Custom Views (начало)', meta: '~1ч 18м', time: '1ч 18м' }
                    ]
                },
                {
                    id: 'fri-3',
                    dayName: 'Пятница',
                    date: '22 мая',
                    timeInfo: 'Домашние дела',
                    type: 'rest',
                    extraBadges: [
                        { type: 'home', label: 'Дела' },
                        { type: 'gym', label: 'Спортзал' }
                    ]
                },
                {
                    id: 'sat-3',
                    dayName: 'Суббота',
                    date: '23 мая',
                    timeInfo: '7:00–13:10',
                    type: 'study',
                    blocks: [
                        { id: '3-7', title: 'Глава 4, Блок 4. Custom Views (окончание)', meta: '~4ч 52м', time: '4ч 52м' },
                        { id: '3-8', title: 'Глава 4, Блок 5. BDUI', meta: '~1ч 25м', time: '1ч 25м' }
                    ]
                },
                {
                    id: 'sun-3',
                    dayName: 'Воскресенье',
                    date: '24 мая',
                    timeInfo: '10:00–16:10 (спортзал утром)',
                    type: 'study',
                    extraBadges: [{ type: 'gym', label: 'Зал' }],
                    blocks: [
                        { id: '3-9', title: 'Глава 4, Блок 6. Animations and Magic', meta: '🎉 Финальный блок! ~6ч 10м', time: '6ч 10м' }
                    ]
                }
            ]
}
    ]
};

window.courseData = courseData;

window.blocksMeta = {
    '1-1': { difficulty: 'hard', gymSensitive: true },
    '1-2': { difficulty: 'medium', gymSensitive: false },
    '1-3': { difficulty: 'hard', gymSensitive: true },
    '1-4': { difficulty: 'hard', gymSensitive: true },
    '1-4b': { difficulty: 'hard', gymSensitive: true },
    '1-5': { difficulty: 'easy', gymSensitive: false },
    '1-6': { difficulty: 'easy', gymSensitive: false },
    '1-7': { difficulty: 'easy', gymSensitive: false },
    '1-8': { difficulty: 'easy', gymSensitive: false },
    '1-9': { difficulty: 'medium', gymSensitive: false },
    '1-10': { difficulty: 'medium', gymSensitive: false },
    '2-1': { difficulty: 'hard', gymSensitive: true },
    '2-2': { difficulty: 'hard', gymSensitive: true },
    '2-3': { difficulty: 'easy', gymSensitive: false },
    '2-4': { difficulty: 'medium', gymSensitive: false },
    '2-5': { difficulty: 'medium', gymSensitive: false },
    '2-6': { difficulty: 'easy', gymSensitive: false },
    '2-7': { difficulty: 'easy', gymSensitive: false },
    '2-8': { difficulty: 'easy', gymSensitive: false },
    '2-9': { difficulty: 'hard', gymSensitive: true },
    '2-10': { difficulty: 'hard', gymSensitive: true },
    '2-11': { difficulty: 'medium', gymSensitive: false },
    '2-12': { difficulty: 'hard', gymSensitive: true },
    '2-13': { difficulty: 'medium', gymSensitive: false },
    '3-1': { difficulty: 'hard', gymSensitive: true },
    '3-2': { difficulty: 'hard', gymSensitive: true },
    '3-3': { difficulty: 'hard', gymSensitive: true },
    '3-4': { difficulty: 'hard', gymSensitive: true },
    '3-5': { difficulty: 'easy', gymSensitive: false },
    '3-6': { difficulty: 'medium', gymSensitive: false },
    '3-7': { difficulty: 'hard', gymSensitive: true },
    '3-8': { difficulty: 'medium', gymSensitive: false },
    '3-9': { difficulty: 'hard', gymSensitive: true }
};