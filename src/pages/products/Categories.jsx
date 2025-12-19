import React, { useState } from "react";
import { useCategories } from "../../hooks/useCategories";

const Categories = () => {
  const { data: categoriesData, isLoading, error, refetch } = useCategories();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    discount_percentage: ''
  });

  const categories = categoriesData?.categories || [];

  const handleAddCategory = (e) => {
    e.preventDefault();
    // TODO: Implement add category API call
    console.log('Add category:', newCategory);
    setShowAddForm(false);
    setNewCategory({ name: '', discount_percentage: '' });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error loading categories</h3>
          <p>{error.message}</p>
          <button onClick={() => refetch()} className="btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="card">
        <div className="categories-header">
          <h3>Categories Management</h3>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn"
          >
            {showAddForm ? 'Cancel' : 'Add Category'}
          </button>
        </div>

        {showAddForm && (
          <div className="add-category-form">
            <h4>Add New Category</h4>
            <form onSubmit={handleAddCategory}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Category Name *"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  required
                />
                <input
                  type="number"
                  placeholder="Discount % (optional)"
                  min="0"
                  max="100"
                  value={newCategory.discount_percentage}
                  onChange={(e) => setNewCategory({...newCategory, discount_percentage: e.target.value})}
                />
                <button type="submit" className="btn">Add Category</button>
              </div>
            </form>
          </div>
        )}

        {categories.length === 0 ? (
          <div className="no-categories">
            <p>No categories found</p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <div key={category.category_id} className="category-card">
                <div className="category-info">
                  <h4>{category.name}</h4>
                  <div className="category-details">
                    <span className="category-id">ID: {category.category_id}</span>
                    {category.discount_percentage && (
                      <span className="category-discount">
                        {category.discount_percentage}% discount
                      </span>
                    )}
                    <span className="size-group">Size Group: {category.size_group_id}</span>
                  </div>
                </div>
                <div className="category-actions">
                  <button className="btn btn-small btn-edit">Edit</button>
                  <button className="btn btn-small btn-delete">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="categories-summary">
          <p>Total Categories: <strong>{categories.length}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Categories;
