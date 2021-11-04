import * as yup from 'yup';
import { isNumericString } from '../../../services/utils';

export function getScoreValidation(maxScore) {
    return yup.string()
        .required('Please give a score')
        .test('is-float', 'Score should be a number', (val) => isNumericString(val))
        .test('smaller-than-max', `Max score is ${maxScore}`, (val) => parseFloat(val) <= maxScore);
}