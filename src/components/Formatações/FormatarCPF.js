const FormatarCPF = (cpf) => {
    const mask = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    const value = cpf.split('');
    let maskedValue = [];
    let i = 0;

    mask.forEach((maskChar) => {
        if (maskChar instanceof RegExp) {
            if (value[i] && maskChar.test(value[i])) {
                maskedValue.push(value[i]);
                i++;
            } else {
                maskedValue.push('_');
            }
        } else {
            maskedValue.push(maskChar);
        }
    });
    return maskedValue.join('');
}
export default FormatarCPF;