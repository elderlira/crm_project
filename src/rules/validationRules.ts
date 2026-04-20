export type Rule = (v:any) => boolean | string

export const validationRules = {

    required: (message: string): Rule => (v: any) =>
        (v !== null && v !== undefined && v !== '') || message,
    min: (length: number) => (v: string): boolean | string => (v && v.length >= length) || `O mínimo de ${length} caracteres`,
    max: (length: number) => (v: string): boolean | string => (v && v.length <= length) || `O máximo de ${length} caracteres`,
    email: (v: string): boolean | string => /.+@.+\..+/.test(v) || 'E-mail inválido ',
    phoneNumber: (v :string): boolean | string => /^[0-9]+$/.test(v) || 'Somente números',

}

export type ValidationRulesType = typeof validationRules