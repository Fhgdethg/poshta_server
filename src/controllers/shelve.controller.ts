import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

import shelveService from '../services/shelve.service.js';

import shelveRepository from '../repositories/shelve.repository.js';

import { IShelve } from '../types/shelve.types.js';

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

      const { newX, newY } =
        await shelveService.getNewCoordinates(maxShelvesCount);

      const newShelve = await shelveRepository.create({
        shelveID,
        shelveDimensions: { width, height, length },
        coordinates: {
          x: newX,
          y: newY,
        },
        products: [],
        percentBusyVolume: 0,
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
        return res.status(404).json({
          message: `Shelve with id = ${id} is not exist`,
          isShelveNotExist: true,
        });

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
