import { Request, Response } from 'express';

class EmptyController {
  async rootHandler(req: Request, res: Response) {
    try {
      return res.send('Server work!!!');
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export default new EmptyController();
