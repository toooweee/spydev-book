import dayjs, { Dayjs } from 'dayjs';


export enum Conflict {
    GreatPatrioticWar = "Великая отечественная война",
    AfghanWar = "Боевые действия в Афганистане",
    ChechenConflict = "Вооруженный конфликт в Чеченской Республике и на прилегающих к ней территориях Российской Федерации",
    SyriaOperations = "Выполнение специальных задач на территории Сирийской Арабской Республики",
    TajikistanOperations = "Выполнение специальных задач на территории Таджикистана, Ингушетии, в Грузино-Абхазских событиях",
    UkraineSpecialOperation = "Специальная военная операция на Украине"
}

export interface PageInfo {
    info: string;
    num: number;
    lifeDate: Dayjs | null;
    deathDate: Dayjs | null;
    firstName: string;
    middleName: string;
    lastName: string;
    photo?: Blob;
    doc: Blob[];
    kontrakt: Conflict[];
    nagrads: string;
    raion: string;
}

export const mockPageInfoList: PageInfo[] = [
    {
        info: "Джон Майкл Доу (1900–1950) был видным ученым и общественным деятелем, внёс значительный вклад в развитие медицины и физики. Его исследования оказали влияние на многие поколения, а достижения были отмечены престижными наградами, включая Медаль Почёта. Родившись в Нью-Йорке, он посвятил свою жизнь научным открытиям и улучшению качества жизни людей.",
        num: 1,
        lifeDate: dayjs("1900-01-01"),
        deathDate: dayjs("1950-01-01"),
        firstName: "John",
        middleName: "Michael",
        lastName: "Doe",
        photo: undefined,
        doc: [new Blob(["Document 1"], { type: "text/plain" })],
        kontrakt: [Conflict.GreatPatrioticWar, Conflict.AfghanWar],
        nagrads: "Medal of Honor",
        raion: "New York",
    },
    {
        info: "Джейн Элизабет Смит (1920–1980) была влиятельной общественной деятельницей, известной своими реформаторскими инициативами в сфере образования и здравоохранения. Её жизненный путь вдохновлял многих, а вклад в развитие социальной политики сделал её символом перемен и прогресса. Живя и работая в Лос-Анджелесе, она оставила глубокий след в истории города.",
        num: 2,
        lifeDate: dayjs("1920-05-15"),
        deathDate: dayjs("1980-12-10"),
        firstName: "Jane",
        middleName: "Elizabeth",
        lastName: "Smith",
        photo: undefined,
        doc: [new Blob(["Document 2"], { type: "text/plain" })],
        kontrakt: [Conflict.ChechenConflict],
        nagrads: "Order of Merit",
        raion: "Los Angeles",
    },
    {
        info: "Альберт Фрэнсис Браун (1875–1945) был выдающимся учёным, чьи исследования в области химии и физики принесли ему мировую известность. Его научные труды оказали значительное влияние на развитие фундаментальных наук в начале XX века. Родившийся в Чикаго, он посвятил свою жизнь поиску новых знаний и инновационных идей.",
        num: 3,
        lifeDate: dayjs("1875-03-22"),
        deathDate: dayjs("1945-07-09"),
        firstName: "Albert",
        middleName: "Francis",
        lastName: "Brown",
        photo: undefined,
        doc: [new Blob(["Document 3"], { type: "text/plain" })],
        kontrakt: [Conflict.SyriaOperations],
        nagrads: "Nobel Prize",
        raion: "Chicago",
    },
    {
        info: "Эмили Грейс Уилсон (1895–1965) была знаменитой художницей, чьи работы оставили неизгладимый след в мире искусства. Её уникальный стиль и оригинальное видение отражались в каждой картине, завоёвывая сердца ценителей по всему миру. Родом из Сан-Франциско, она стала символом творчества и художественной свободы.",
        num: 4,
        lifeDate: dayjs("1895-08-30"),
        deathDate: dayjs("1965-06-20"),
        firstName: "Emily",
        middleName: "Grace",
        lastName: "Wilson",
        photo: undefined,
        doc: [new Blob(["Document 4"], { type: "text/plain" })],
        kontrakt: [Conflict.TajikistanOperations],
        nagrads: "Art Award",
        raion: "San Francisco",
    },
    {
        info: "Роберт Александр Джонсон (1910–1990) был выдающимся политическим лидером и реформатором, чья деятельность оказала огромное влияние на развитие современного общества. Его мудрость, решительность и стремление к справедливости сделали его одним из самых уважаемых деятелей своего времени. Родившийся в Вашингтоне, он посвятил свою жизнь служению народу и борьбе за мир.",
        num: 5,
        lifeDate: dayjs("1910-11-11"),
        deathDate: dayjs("1990-04-05"),
        firstName: "Robert",
        middleName: "Alexander",
        lastName: "Johnson",
        photo: undefined,
        doc: [new Blob(["Document 5"], { type: "text/plain" })],
        kontrakt: [Conflict.UkraineSpecialOperation],
        nagrads: "Peace Prize",
        raion: "Washington D.C.",
    },
];




export enum OrenburgMunicipalities {
    Abdulinsky = "Абдулинский ГО",
    Adamovsky = "Адамовский район",
    Alexandrovsky = "Александровский район",
    Asekeevsky = "Асекеевский район",
    Belyaevsky = "Беляевский район",
    Buguruslansky = "Бугурусланский район",
    Buguruslan = "Бугуруслан ГО",
    Buzuluksky = "Бузулукский район",
    Buzuluk = "Бузулук ГО",
    Gaisky = "Гайский ГО",
    Grachevsky = "Грачевский район",
    Dombarovsky = "Домбаровский район",
    Ileksky = "Илекский район",
    Krasnogvardeysky = "Красногвардейский район",
    Kuvandyksky = "Кувандыкский ГО",
    Kvarkensky = "Кваркенский район",
    Matveevsky = "Матвеевский район",
    Mednogorsky = "Медногорск ГО",
    Novoorsk = "Новоорский район",
    Novosergievsky = "Новосергиевский район",
    Oktyabrsky = "Октябрьский район",
    Orenburg = "Оренбург ГО",
    Orenburgsky = "Оренбургский район",
    Orsky = "Орск ГО",
    Ponomarevsky = "Пономаревский район",
    Perevolotsky = "Переволоцкий район",
    Sakmarsky = "Сакмарский район",
    Svetlinsky = "Светлинский район",
    Severny = "Северный район",
    Sorochinsky = "Сорочинский ГО",
    SolIletsky = "Соль-Илецкий ГО",
    Sharliksky = "Шарлыкский район",
    Tashlinsky = "Ташлинский район",
    Totsky = "Тоцкий район",
    Tyulgansky = "Тюльганский район",
    Yasnensky = "Ясненский ГО",
    Akbulaksky = "Акбулакский район",
    Saraktashsky = "Саракташский район",
    Novotroitsk = "Новотроицк ГО",
    Krymsky = "Крымский район",
    Energetiksky = "Энергетикский район"
}
