import createHttpError from 'http-errors';

import { SORT_ORDER } from '../constants/constants.js';

import { calculatePaginationData } from '../utils/parsePaginationParams.js';
import { GlassTypesCollection } from '../db/models/glassTypeModel.js';

export const getAllGlassTypesService = async ({
  page = 1,
  perPage = 20,
  sortOrder = SORT_ORDER.ASC,
  sortBy = 'createdAt',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;
  const mongoFilter = {};

  if (filter.label) {
    mongoFilter.label = {
      $regex: filter.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      $options: 'i',
    };
  }

  const glassTypeCount = await GlassTypesCollection.countDocuments(mongoFilter);

  const glassTypes = await GlassTypesCollection.find(mongoFilter)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .populate('category', 'label')
    .lean();

  const paginationData = calculatePaginationData(glassTypeCount, page, perPage);

  return { glassTypes, ...paginationData };
};

export const addNewGlassTypeService = async ({
  label,
  category,
  thickness,
  temper,
}) => {
  const existGlassType = await GlassTypesCollection.findOne({ label });

  if (existGlassType) throw createHttpError(409, 'Glass type already exist!');

  return await GlassTypesCollection.create({
    label,
    category,
    thickness,
    temper,
  });
};

export const patchGlassTypeService = async (glassTypeId, updateData) => {
  const glassType = await GlassTypesCollection.findByIdAndUpdate(
    glassTypeId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!glassType) throw createHttpError(404, 'Glass type not found!');
  return glassType;
};

export const deleteGlassTypeService = async (glassTypeId) => {
  const glassType = await GlassTypesCollection.findByIdAndDelete(glassTypeId);
  if (!glassType) throw createHttpError(404, 'Glass type not found!');
};
