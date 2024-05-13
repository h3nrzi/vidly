import express from 'express';

import { Genre, validateGenre } from '../models/genre';
import auth from '../Middlewares/auth';
import admin from '../Middlewares/admin';
import mongoose from 'mongoose';
const router = express.Router();



router.get('/', async (req, res) => {
    // throw new Error("could not get the genres!")
    const genres = await Genre.find().sort('name')
    res.json(genres);
});


router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('شناسه نامعتبر است.')

    const genre = await Genre.findById(req.params.id)
    if (!genre)
        return res.status(404).send('ژانر با شناسه ی داده شده پیدا نشد!');

    return res.send(genre);
});

router.post('/', auth, async (req, res) => {
    const { error } = validateGenre(req.body);

    if (error)
        return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name })
    genre = await genre.save()

    return res.status(201).send(genre);
});

router.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body);

    if (error)
        return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
    )

    if (!genre)
        return res.status(404).send('ژانر با شناسه ی داده شده پیدا نشد!');

    return res.send(genre);
});

router.delete('/:id', auth, admin, async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id)

    if (!genre)
        return res.status(404).send('ژانر با شناسه ی داده شده پیدا نشد!');

    return res.send(genre);
});

export default router;