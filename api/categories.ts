/**
 * Category API services
 */

import { apiClient } from './client';
import type { Category } from '../types';

/**
 * Get all categories with their themes and confessions
 */
export const getCategories = async (): Promise<Category[]> => {
  const categories = await apiClient.get<Category[]>('category', '/category');

  // Fetch themes for each category using theme_by_category endpoint
  const categoriesWithThemes = await Promise.all(
    categories.map(async (category) => {
      try {
        const themes = await apiClient.get<any[]>('theme', '/theme_by_category', { category_id: category.id });

        // For each theme, fetch its confessions using confession_by_theme endpoint
        const themesWithConfessions = await Promise.all(
          themes.map(async (theme) => {
            try {
              const confessions = await apiClient.get<any[]>('confession', '/confession_by_theme', { theme_id: theme.id });
              return {
                ...theme,
                _confession: confessions || []
              };
            } catch (error) {
              console.error(`Failed to fetch confessions for theme ${theme.id}:`, error);
              return {
                ...theme,
                _confession: []
              };
            }
          })
        );

        return {
          ...category,
          _theme_of_category_2: themesWithConfessions
        };
      } catch (error) {
        console.error(`Failed to fetch themes for category ${category.id}:`, error);
        return {
          ...category,
          _theme_of_category_2: []
        };
      }
    })
  );

  return categoriesWithThemes;
};

/**
 * Get single category by ID
 */
export const getCategory = async (id: number): Promise<Category> => {
  return apiClient.get<Category>('category', `/category/${id}`);
};

/**
 * Create new category
 */
export const createCategory = async (data: { name: string }): Promise<Category> => {
  return apiClient.post<Category>('category', '/category', data);
};

/**
 * Update category
 */
export const updateCategory = async (id: number, data: { name: string }): Promise<Category> => {
  return apiClient.patch<Category>('category', `/category/${id}`, data);
};

/**
 * Delete category
 */
export const deleteCategory = async (id: number): Promise<void> => {
  return apiClient.delete<void>('category', `/category/${id}`);
};
