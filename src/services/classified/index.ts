
import { getApprovedClassifieds, getClassifiedsByStatus, getUserClassifieds } from './getClassifieds';
import { updateClassifiedStatus } from './updateClassifiedStatus';
import { deleteClassified } from './deleteClassified';
import { createClassified } from './createClassified';
import { addClassifiedImages } from './addClassifiedImages';

export const classifiedService = {
  getApprovedClassifieds,
  getClassifiedsByStatus,
  getUserClassifieds,
  updateClassifiedStatus,
  deleteClassified,
  createClassified,
  addClassifiedImages
};
