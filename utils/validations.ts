import Vuelidate from "vuelidate";

export const validateEmail = validate => {
    let errors:Array<string> = []
    if (!validate.$dirty) return errors
    !validate.required && errors.push('メールアドレスを入力してください')
    !validate.email && errors.push('メールアドレスの形式で入力してください')
    return errors
}

export const validatePassword = validate => {
    let errors:Array<string> = []
    let minlen:number|undefined = validate.$params.minLength ? validate.$params.minLength.min : undefined;
    if (!validate.$dirty) return errors
    !validate.required && errors.push('パスワードを入力してください')
    if(minlen && (<string> validate.$model).length < minlen)
        errors.push(`パスワードは${minlen}文字以上にしてください`)
    return errors
}

export const validatePasswordConfirm = validate => {
    let errors:Array<string> = []
    if (!validate.$dirty) return errors
    !validate.required && errors.push('パスワードを再度入力してください')
    if(!validate.sameAs) errors.push('パスワードが一致しません')
    return errors
}

export const validateName = (validate) => {
    let errors:Array<string> = []
    let maxlen:number|undefined = validate.$params.maxLength ? validate.$params.maxLength.max : undefined;
    if (!validate.$dirty) return errors
    !validate.required && errors.push('名前を入力してください')
    if(maxlen && (<string> validate.$model).length > maxlen)
        errors.push(`名前は${maxlen}文字以下にしてください`)
    return errors
}