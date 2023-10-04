import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import shelveService from '../services/shelve.service.js';

import shelveRepository from '../repositories/shelve.repository.js';
import userRepository from '../repositories/user.repository.js';

import { IShelve, IShelveExtremes } from '../types/shelve.types.js';

class ShelveController {
  async addShelve(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty())
        res.status(400).json({
          message: 'Data is not correct',
          errors: errors.array(),
        });

      const { shelveID, width, height, length, maxShelvesCount } = req.body;

      const savedShelve: IShelve | null | any = await shelveRepository.findOne<{
        shelveID: number;
      }>({
        shelveID,
      });

      if (savedShelve?.shelveID)
        return res
          .status(404)
          .json({ message: `Shelve with id ${shelveID} is already exist` });

      const [{ maxY, maxX }]: IShelveExtremes[] =
        await shelveRepository.findExtremesByExtremumField({
          maxY: { $max: '$coordinates.y' },
          maxX: { $max: '$coordinates.x' },
        });

      const isExtremumFindSuccess = Boolean(maxY && maxX);

      const newX =
        isExtremumFindSuccess && maxX >= maxShelvesCount ? 1 : maxX + 1;
      const newY =
        isExtremumFindSuccess && maxX >= maxShelvesCount ? maxY + 1 : maxY;

      const usersIDs = await userRepository.findAllIDs();

      const newShelve = await shelveRepository.create({
        shelveID,
        shelveDimensions: { width, height, length },
        coordinates: {
          x: newX,
          y: newY,
        },
        products: [],
        users: usersIDs,
      });

      res.send(newShelve);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async getAllShelves(req: Request, res: Response) {
    try {
      const allShelves = await shelveRepository.getAll();

      return res.send(allShelves);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async getAllShelvesIDs(req: Request, res: Response) {
    try {
      const allShelvesIDs = await shelveService.getShelvesIDs();

      return res.send(allShelvesIDs);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async getShelveByID(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const shelve = await shelveRepository.getByID(Number(id));

      if (!shelve)
        return res
          .status(404)
          .json({ message: `Shelve with id = ${id} is not exist` });

      return res.send(shelve);
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async updateShelveFields(req: Request, res: Response) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty())
        res.status(400).json({
          message: 'Data is not correct',
          errors: errors.array(),
        });

      const { id } = req.params;
      const { body } = req;

      const repositoryBody = shelveService.getUpdateRepositoryBody(body);

      await shelveRepository.updateByFields(Number(id), repositoryBody);

      return res.send();
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async deleteShelve(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const shelveDeleteResult = await shelveRepository.deleteByID(Number(id));

      if (!shelveDeleteResult.deletedCount)
        return res
          .status(404)
          .json({ message: `Shelve with id ${id} is not exist` });

      return res.send(shelveDeleteResult);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new ShelveController();
