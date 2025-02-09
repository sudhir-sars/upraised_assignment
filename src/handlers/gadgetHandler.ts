// src/controllers/gadgetController.ts
import { Request, Response } from 'express';
import { PrismaClient, GadgetStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { firstNames, lastNames } from '../utils';

const prisma = new PrismaClient();

//Generates a random codename using predefined names.
const generateCodename = (): string => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
};

//Generates a random mission success probability between 50% and 100%.
const generateSuccessProbability = (): number =>
  Math.floor(Math.random() * 51) + 50;

//Creates a new gadget.
export const createGadget = async (req: Request, res: Response) => {
  try {
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
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//Retrieves gadgets, optionally filtered by status.
export const getGadget = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const where = status ? { status: status as GadgetStatus } : {};
    const gadgets = await prisma.gadget.findMany({ where });

    const gadgetsWithProbability = gadgets.map((gadget) => ({
      ...gadget,
      missionSuccessProbability: `${generateSuccessProbability()}%`,
    }));
    res.json(gadgetsWithProbability);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//Marks a gadget as decommissioned.
export const deleteGadget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const decommissionedGadget = await prisma.gadget.update({
      where: { id },
      data: {
        status: GadgetStatus.Decommissioned,
        decommissionedAt: new Date(),
      },
    });
    res.json(decommissionedGadget);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Updates a gadget's details.
export const updateGadget = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const upadtedGadget = await prisma.gadget.update({
      where: { id },
      data,
    });

    res.json(upadtedGadget);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//Initiates a self-destruct sequence for a gadget.
export const selfDistruct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const confirmationCode = Math.floor(Math.random() * 900000) + 100000;

    res.json({
      message: `Self-destruct sequence initiated for gadget ${id}`,
      confirmationCode,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
