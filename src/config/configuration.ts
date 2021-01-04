export default () => ({
  translation: {
    papagoTranslateUrl: process.env.PAPAGO_TRANSLATE_URL,
    papagoClientId: process.env.PAPAGO_CLIENT_ID,
    papagoClientSecret: process.env.PAPAGO_CLIENT_SECRET,

    kakaoTranslateUrl: process.env.KAKAO_TRANSLATE_URL,
    kakaoApiKey: process.env.KAKAO_API_KEY,

    googleKeyFileName: process.env.GOOGLE_KEY_FILE_NAME,
    googleProjectId: process.env.GOOGLE_PROJECT_ID,
    googleLocation: process.env.GOOGLE_LOCATION,
  },
})
