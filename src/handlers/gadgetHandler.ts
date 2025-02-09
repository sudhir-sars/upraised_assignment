// src/controllers/gadgetController.ts
import { Request, Response } from 'express';
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

//Helper: Generate random mission probability
const generateSuccessProbability = (): number =>
  Math.floor(Math.random() * 51) + 50;

export const createGadget = async (req: Request, res: Response) => {
  const { name } = req.body;
  const codename = generateCodename();
  const newGadget = await prisma.gadget.create({
    data: {
      id: uuidv4(),
      name: name || codename,
      status: GadgetStatus.Available,
    },
  });
  res.status(201).json(newGadget);
};

export const getGadget = async (req: Request, res: Response) => {
  const { status } = req.query;
  const where = status ? { status: status as GadgetStatus } : {};
  const gadgets = await prisma.gadget.findMany({ where });

  const gadgetsWithProbability = gadgets.map((gadget) => ({
    ...gadget,
    missionSuccessProbability: `${generateSuccessProbability()}%`,
  }));
  res.json(gadgetsWithProbability);
};

export const deleteGadget = async (req: Request, res: Response) => {
  const { id } = req.params;

  const decommissionedGadget = await prisma.gadget.update({
    where: { id },
    data: {
      status: GadgetStatus.Decommissioned,
      decommissionedAt: new Date(),
    },
  });
  res.json(decommissionedGadget);
};

export const updateGadget = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  const upadtedGadget = await prisma.gadget.update({
    where: { id },
    data,
  });

  res.json(upadtedGadget);
};

export const selfDistruct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const confirmationCode = Math.floor(Math.random() * 900000) + 100000;

  res.json({
    message: `Self-destruct sequence initiated for gadget ${id}`,
    confirmationCode,
  });
};
