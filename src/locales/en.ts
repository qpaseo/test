// ✅ common 객체를 직접 export
const en = {
  appTitle: "My App",
  welcome: "Welcome",
  logout: "Log out",
  login: "Log in",
  signup: "Sign up",
  profile: "Profile",
  main: "Main",
  states: "States",
  language: "Language",
  mainPage: {
    back: "Back",
    title: "Today's Menu",
    subtitle: "What would you like to have today?",
    getRecommendation: "Get Recommendation",
    historyTitle: "Recommendation History",
    empty: "No recommended meals yet",
    firstRecommend: "Get first recommendation",
    recommendedFor: "{{name}} recommendation",
  },
  statesPage: {
    mainState: "Main State",
    stateList: "My Status List",
    setMainPending: "Changing main state...",
    setMainSuccess: "Main state updated!",
    setMainError: "Failed to update main state.",
    listTitle: "My States",
    addState: "Add State",
    empty: "No states registered yet",
    createFirst: "Create first state",
    setMainButton: "Set as main",
    editButton: "Edit",
    deleteButton: "Delete",
    deleteConfirm: "Are you sure you want to delete this?",
    editTitle: "Edit State",
    name: "Name",
    description: "Description",
    extraInfo: "Additional Info",
    cancel: "Cancel",
    save: "Save",
    editPending: "Updating state...",
    editSuccess: "State updated!",
    editError: "Failed to update state.",
    create: {
      title: "Create State",
      submit: "Create",
      loading: "Creating...",
      pending: "Creating state...",
      success: "State created!",
      error: "Failed to create state.",
    },
  },
  form: {
    name: "State Name",
    description: "State Description",
    info: "Recommendation Criteria",
    setMain: "Set this as main state",
  },
  placeholder: {
    name: "Ex: Diet",
    description: "Ex: A diet for weight loss",
    info: "Ex: Foods that are low-calorie and nutrient-rich",
  },
  profilePage: {
    title: "Profile Settings",
    email: "Email",
    name: "Name",
    foodTypes: "Preferred Ingredients",
    foodCategories: "Preferred Food Category",
    language: "Language",
    selectPlaceholder: "Please select",

    // 식재료 옵션
    foodTypesOptions: {
      seafood: "Seafood",
      meat: "Meat",
      vegetable: "Vegetables",
    },

    // 음식 카테고리 옵션
    foodCategoriesOptions: {
      korean: "Korean",
      western: "Western",
      chinese: "Chinese",
    },

    // 언어 옵션
    languageOptions: {
      korean: "한국어",
      english: "English",
    },

    // 버튼
    saveButton: "Save Changes",
    saving: "Saving...",

    // 토스트 메시지
    updatePending: "Updating profile...",
    updateSuccess: "Profile updated successfully!",
    updateError: "Failed to update profile.",

    // 성공 메시지
    successMessage: "Profile updated successfully.",
    errorMessage: "Failed to update profile.",
  },
};

export default en;
