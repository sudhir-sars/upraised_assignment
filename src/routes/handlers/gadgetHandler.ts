// src/controllers/gadgetController.ts
import { Request, Response, } from 'express';
import { PrismaClient, GadgetStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { firstNames, lastNames } from '../utils';

const prisma = new PrismaClient();


// Helper: Generate random codename from a list
const generateCodename = (): string => {

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
};



export const createGadget = async (req: Request, res: Response) => {
  
    const { name } = req.body;
    const codename = generateCodename();
    const newGadget = await prisma.gadget.create({
      data: {
        id: uuidv4(),
        name: name || codename, 
        status: GadgetStatus.Available
      }
    });
    res.status(201).json(newGadget);
  
};

