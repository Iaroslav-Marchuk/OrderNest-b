import createHttpError from 'http-errors';

import { SORT_ORDER } from '../constants/constants.js';

import { calculatePaginationData } from '../utils/parsePaginationParams.js';
import { GlassCategoriesCollection } from '../db/models/glassCategoryModel.js';

export const getAllGlassCategoriesService = async ({
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

  const glassCategoryCount =
    await GlassCategoriesCollection.countDocuments(mongoFilter);

  const glassCategories = await GlassCategoriesCollection.find(mongoFilter)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit)
    .lean();

  const paginationData = calculatePaginationData(
    glassCategoryCount,
    page,
    perPage,
  );

  return { glassCategories, ...paginationData };
};

export const addNewGlassCategoryService = async ({ label, isLaminated }) => {
  const existGlassCategory = await GlassCategoriesCollection.findOne({
    label,
  });

  if (existGlassCategory)
    throw createHttpError(409, 'Glass category already exists!');

  return await GlassCategoriesCollection.create({
    label,
    isLaminated,
  });
};

export const patchGlassCategoryService = async (
  glassCategoryId,
  updateData,
) => {
  const glassCategory = await GlassCategoriesCollection.findByIdAndUpdate(
    glassCategoryId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!glassCategory) throw createHttpError(404, 'Glass category not found!');
  return glassCategory;
};

export const deleteGlassCategoryService = async (glassCategoryId) => {
  const glassCategory =
    await GlassCategoriesCollection.findByIdAndDelete(glassCategoryId);
  if (!glassCategory) throw createHttpError(404, 'Glass category not found!');
};
