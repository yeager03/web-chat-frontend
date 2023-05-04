type Pattern = {
  email: RegExp;
  fullName: RegExp;
  password: RegExp;
  image: RegExp;
  audio: RegExp;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (): Pattern => ({
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  fullName: /^[а-яА-Яa-zA-Z]{2,}$/,
  password: /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
  image: /image\/(png|jpg|jpeg|svg|web|gif|jfif)/gm,
  audio:
    /audio\/(mp3|mpeg|wav|wma|aac|flac|ogg|m4a|aiff|alac|amr|ape|au|mpc|tta|wv|opus)/gm,
});
