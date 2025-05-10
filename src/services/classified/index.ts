
// Re-export all classified service functions
import { getApprovedClassifieds, getClassifiedsByStatus, getUserClassifieds } from './getClassifieds';
import { createClassified } from './createClassified';
import { updateClassifiedStatus } from './updateClassifiedStatus';
import { addClassifiedImages } from './addClassifiedImages';
import { deleteClassified } from './deleteClassified';

export const classifiedService = {
  getApprovedClassifieds,
  getClassifiedsByStatus,
  getUserClassifieds,
  createClassified,
  updateClassifiedStatus,
  addClassifiedImages,
  deleteClassified
};
