import otpGenerator from "otp-generator";
const generateCode = (
  length: number | string,
  digits: boolean,
  lowerCaseAlphabets: boolean,
  upperCaseAlphabets: boolean,
  specialChars: boolean
): string => {
   let lengthRandom = Math.floor(Math.random() * 4)
   if(lengthRandom == 0){
     lengthRandom = 2
   }

  const text = otpGenerator.generate(length == "random" ? lengthRandom : length as number, {
    digits,
    lowerCaseAlphabets,
    upperCaseAlphabets,
    specialChars,
  });
  return text;
};

export default generateCode;