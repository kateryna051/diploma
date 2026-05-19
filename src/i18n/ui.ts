import { create } from "domain";
import { write } from "fs";
import { Edit } from "lucide-react";

export const ui = {
  EN: {
    account: "Account",
    logout: "Logout",

    // Main Page
    explore: "Explore Your Lithuanian Journey",
    chooseCategory:
      "Choose your category and start learning — vocabulary, grammar, dialogues, and more!",
    noCategories: "No categories found.",

    // Words Page
    words: "Words",
    example: "Example",

    // Category Page
    chooseActivity: "Choose an Activity",
    test: "Test",
    game: "Game",

    // Test Interface
    testTitle: "Test",
    results: "Results",
    yourAnswer: "Your answer",
    correctAnswer: "Correct",
    backToCategory: "Back to Category",
    back: "Back",
    next: "Next",
    finishTest: "Finish Test",
    timeLeft: "Time left",
    question: "Question",

    // Test Question Templates (EN)
    translateWordToLT: "Translate this word to Lithuanian:",
    translateWordToEN: "Translate this word to English:",
    translateSentenceToLT: "Translate this sentence to Lithuanian:",
    translateSentenceToEN: "Translate this sentence to English:",

    menuAccount: "My Account",
    menuChangePassword: "Change Password",
    menuLogout: "Logout",
    menuHelp: "Help",

    // Welcome Page
    about: "About",
    contact: "Contact",
    signIn: "Sign In",
    signUp: "Sign Up",
    getStarted: "Get Started",
    heroTitle: "Become Fluent In Lithuanian Language With",
    heroSubtitle: "Learn Lithuanian interactively and effectively. Start today!",

// Change Password Page
    changePasswordTitle: "Change Your Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    submit: "Save Password",
    goBack: "Go Back",

        // Reset Password Request Page
    forgotPasswordTitle: "Forgot Password",
    email: "Email",
    sendResetLink: "Send Reset Link",

    // Reset Password Page (with token)
    resetPasswordTitle: "Reset Your Password",

    // About Page
    aboutTitle: "About Us",
    aboutParagraph1:
      "Lith&Talk was created mainly to support Ukrainian refugees in learning Lithuanian with interactive word lists, quizzes, and games.",
    aboutParagraph2:
      "Our goal is to make language learning simple, engaging, and fun, helping learners to practice effectively in a friendly environment.",
    aboutParagraph3:
      "Users can explore categories, take short quizzes, and play games that make learning memorable and enjoyable.",
    aboutFeaturesTitle: "What’s Inside",
    aboutFeature1: "Interactive word lists for daily practice",
    aboutFeature2: "Fun quizzes and mini-games to reinforce learning",
    aboutFeature3: "Supportive community and resources for practice",
    categories: "Categories",

    reviews: "Reviews",

    typingChallenge: "Typing Challenge",
    pictureChallenge: "Picture Challenge",

    chooseGame: "Choose a Game",
    deleteAccount: "Delete Account",
    edit: " Edit",
    delete: " Delete",
    writeReview: "Write a Review",
    login: "Login",
    forgetPassword: "Forgot Password?",
    register: "Register",
    welcomeBack: "Welcome Back",
    password: "Password",
    donthaveAccount: "Don’t have an account?",
    name: "Name",
    surname: "Surname",
    phone: "Phone",
    confirmPassword: "Confirm Password",
    location: "Location",
    clickHere: "Click here",
    loginSuccessful: "Login successful!",
    invalidCredentials: "Invalid email or password.",
    litlearn: "Learn Lithuanian interactively with fun games and daily practice.",
    createAccount: "Create your Account",
    alreadyHaveAccount: "Already have an account?",
    loggingIn: "Logging in...",

  },

  UA: {
    account: "Обліковий запис",
    logout: "Вийти",

    // Main Page
    explore: "Відкрийте для себе шлях до вивчення литовської мови",
    chooseCategory:
      "Оберіть категорію та почніть навчання — словниковий запас, граматика, діалоги та багато іншого!",
    noCategories: "Категорій не знайдено.",

    // Words Page
    words: "Слова",
    example: "Приклад",

    // Category Page
    chooseActivity: "Оберіть активність",
    test: "Тест",
    game: "Гра",

    // Test Interface
    testTitle: "Тест",
    results: "Результати",
    yourAnswer: "Ваша відповідь",
    correctAnswer: "Правильна відповідь",
    backToCategory: "Повернутись до категорії",
    back: "Назад",
    next: "Далі",
    finishTest: "Завершити тест",
    timeLeft: "Залишилось часу",
    question: "Питання",
    writeReview: "Написати відгук",

    edit: " Редагувати",
    delete: " Видалити",

    // Test Question Templates (UA)
    translateWordToLT: "Перекладіть це слово литовською:",
    translateWordToUA: "Перекладіть це слово українською:",
    translateSentenceToLT: "Перекладіть це речення литовською:",
    translateSentenceToUA: "Перекладіть це речення українською:",

    menuAccount: "Мій профіль",
    menuChangePassword: "Змінити пароль",
    menuLogout: "Вийти",
    menuHelp: "Допомога",


    // Welcome Page
    about: "Про нас",
    contact: "Контакти",
    signIn: "Увійти",
    signUp: "Реєстрація",
    getStarted: "Почати навчання",
    heroTitle: "Досягніть вільного володіння литовською мовою з",
    heroSubtitle: "Вивчайте литовську інтерактивно та ефективно. Почніть вже сьогодні!",


    changePasswordTitle: "Змінити пароль",
    currentPassword: "Поточний пароль",
    newPassword: "Новий пароль",
    confirmNewPassword: "Підтвердіть новий пароль",
    submit: "Зберегти пароль",
    goBack: "Назад",

        // Reset Password Request Page
    forgotPasswordTitle: "Забули пароль",
    email: "Електронна пошта",
    sendResetLink: "Надіслати посилання для скидання",

    // Reset Password Page (with token)
    resetPasswordTitle: "Скинути пароль",

     // About Page
    aboutTitle: "Про нас",
    aboutParagraph1:
      "Lith&Talk створено головним чином для підтримки українських біженців у вивченні литовської мови за допомогою інтерактивних списків слів, тестів та ігор.",
    aboutParagraph2:
      "Наша мета — зробити вивчення мови простим, цікавим та веселим, допомагаючи учням ефективно практикуватися у дружньому середовищі.",
    aboutParagraph3:
      "Користувачі можуть досліджувати категорії, проходити короткі тести та грати в ігри, які роблять навчання запам'ятовуваним і цікавим.",
    aboutFeaturesTitle: "Що всередині",
    aboutFeature1: "Інтерактивні списки слів для щоденної практики",
    aboutFeature2: "Веселі тести та міні-ігри для закріплення знань",
    aboutFeature3: "Підтримка спільноти та ресурси для практики",
    categories: "Категоріі",

    reviews: "Відгуки",

    typingChallenge: "Гра на друкування",
    pictureChallenge: "Гра зображень",
    chooseGame: "Оберіть гру",
    deleteAccount: "Видалити акаунт",
    login: "Увійти",
    forgetPassword: "Забули пароль?",
    register: "Реєстрація",
    welcomeBack: "Ласкаво просимо!",
    password: "Пароль",
    donthaveAccount: "Не маєте акаунту?",
    name: "Ім'я",
    surname: "Прізвище",
    phone: "Телефон",
    confirmPassword: "Підтвердіть пароль",
    location: "Місцезнаходження",
    clickHere: "Натисніть тут",
    loginSuccessful: "Вхід успішний!",
    invalidCredentials: "Невірний емейл або пароль.",
    litlearn: "Вивчайте литовську інтерактивно та весело з іграми та щоденною практикою.",
    createAccount: "Створіть свій акаунт",
    alreadyHaveAccount: "Вже маєте акаунт?",
    loggingIn: "Вхід...",




  },
};

// CATEGORY TRANSLATIONS
export const categoriesUI: Record<number, { EN: string; UA: string }> = {
  1: { EN: "Family", UA: "Сім'я" },
  2: { EN: "Kitchen", UA: "Кухня" },
  3: { EN: "Bathroom", UA: "Ванна кімната" },
  4: { EN: "Town", UA: "Місто" },
  5: { EN: "Food", UA: "Їжа" },
  6: { EN: "Shop", UA: "Магазин" },

  
};
