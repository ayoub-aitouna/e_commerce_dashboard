import { Request, Response, NextFunction } from 'express';
import db from '../models';
import { BadRequestError } from '../errors';

export const GetReference = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ref = await db.reference.findAll();
        res.status(200).json(ref);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Create '/reference',
export const PostReference = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { site, dns, basic_price, premuim_price, gold_price } = req.body;

        // Check if all properties are valid
        if (!site || !dns || !basic_price || !premuim_price || !gold_price)
            throw new BadRequestError({ message: 'Invalid reference properties' });
        const reference = await db.reference.create(req.body);
        res.status(201).json(reference);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// Update '/reference/:id'
export const UpdateReference = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { site, dns, basic_price, premuim_price, gold_price } = req.body;

        // Check if all properties are valid
        if (!site || !dns || !basic_price || !premuim_price || !gold_price)
            throw new BadRequestError({ message: 'Invalid reference properties' });
        const reference = await db.reference.findByPk(req.params.id);
        if (reference) {
            await reference.update(req.body);
            res.json({ message: 'Updated successfully' });
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// Delete '/reference/:id'
export const deleteReferece = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const reference = await db.reference.findByPk(req.params.id);
        if (!reference)
            return res.status(404).json({ message: 'Not found' });
        await db.reference.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// Search '/reference/Search'
export const SearchReference = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const searchQuery = req.query.searchQuery;
        const reference = await db.reference.findAll({
            where: {
                site: {
                    [db.Sequelize.Op.like]: `%${searchQuery}%`
                }
            }
        });
        res.status(200).json(reference);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// Get List Of dns '/reference/dns'
export const GetReferenceDns = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ref = await db.reference.findAll({
            attributes: ['dns']
        });
        res.status(200).json(ref);
    } catch (error) {
        console.error(error);
        next(error);
    }
};