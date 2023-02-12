const validationRegExp = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
export const emailValidation = (email:string): boolean => {
    return validationRegExp.test(email);
}