import { body, param, query } from 'express-validator';

export const validirajId = () => [
    param('id').isInt().withMessage('ID mora biti broj!')
];

export const validirajFilm = () => [
    body('title').notEmpty().trim().escape().withMessage('Naziv filma je obavezan!'),
    body('year').isInt().withMessage('Godina mora biti broj!'),
    body('genre').notEmpty().trim().escape().withMessage('Žanr je obavezan!'),
    body('director').notEmpty().trim().escape().withMessage('Redatelj je obavezan!')
];

export const validirajGlumca = () => [
    body('name').notEmpty().trim().escape().withMessage('Ime glumca je obavezno!'),
    body('birthYear').isInt().withMessage('Godina rođenja mora biti broj!')
];

export const validirajGodinuFilma = () => [
    query('min_year').optional().isInt().withMessage('Min_year mora biti broj!'),
    query('max_year').optional().isInt().withMessage('Max_year mora biti broj!'),
    query('min_year')
        .custom((value, { req }) => {
        if(req.query.max_year && value >= req.query.max_year){
            throw new Error('min_year mora biti manji od max_year');
        }
        return true;
        })
];

export const validirajImeGlumca = () => [
    query('name').optional().isString().withMessage('Ime mora biti string!')
];