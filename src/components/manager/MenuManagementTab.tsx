'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Search, 
  Sparkles, 
  Flame, 
  DollarSign, 
  Utensils 
} from 'lucide-react';
import { IMenuItem, ICategory } from '@/types';
import { dataStore, defaultCategories } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { VegBadge } from '@/components/common/VegBadge';

export const MenuManagementTab: React.FC = () => {
  const [items, setItems] = useState<IMenuItem[]>([]);
  const [categories, setCategories] = useState<ICategory[]>(defaultCategories);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IMenuItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState<number>(199);
  const [formCategory, setFormCategory] = useState('cat-starters');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formIsVeg, setFormIsVeg] = useState(true);
  const [formPrepTime, setFormPrepTime] = useState<number>(10);
  const [formIsAvailable, setFormIsAvailable] = useState(true);

  const loadMenu = () => {
    const list = dataStore.getMenuItems('cafe001');
    setItems([...list]);
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormDescription('');
    setFormPrice(199);
    setFormCategory('cat-starters');
    setFormImageUrl('https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop');
    setFormIsVeg(true);
    setFormPrepTime(10);
    setFormIsAvailable(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: IMenuItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDescription(item.description);
    setFormPrice(item.price);
    setFormCategory(item.category_id);
    setFormImageUrl(item.image_url);
    setFormIsVeg(item.is_veg);
    setFormPrepTime(item.prep_time_minutes);
    setFormIsAvailable(item.is_available);
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPrice) return;

    const catObj = categories.find((c) => c.id === formCategory);

    if (editingItem) {
      const updated: IMenuItem = {
        ...editingItem,
        name: formName,
        description: formDescription,
        price: Number(formPrice),
        category_id: formCategory,
        category_name: catObj?.name || 'Starters',
        image_url: formImageUrl || editingItem.image_url,
        is_veg: formIsVeg,
        prep_time_minutes: Number(formPrepTime),
        is_available: formIsAvailable,
      };
      dataStore.updateMenuItem(updated, 'cafe001');
    } else {
      dataStore.addMenuItem(
        {
          cafe_id: 'cafe001',
          name: formName,
          description: formDescription,
          price: Number(formPrice),
          category_id: formCategory,
          category_name: catObj?.name || 'Starters',
          image_url: formImageUrl || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800&auto=format&fit=crop',
          is_veg: formIsVeg,
          is_available: formIsAvailable,
          is_featured: false,
          prep_time_minutes: Number(formPrepTime),
          tags: ['New Item'],
        },
        'cafe001'
      );
    }

    loadMenu();
    setIsModalOpen(false);
  };

  const handleToggleAvailability = (itemId: string) => {
    dataStore.toggleItemAvailability(itemId, 'cafe001');
    loadMenu();
  };

  const handleDeleteItem = (itemId: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      dataStore.deleteMenuItem(itemId, 'cafe001');
      loadMenu();
    }
  };

  // Filter items
  const filteredItems = items.filter((it) => {
    const matchesCategory = activeCategory === 'all' || it.category_id === activeCategory;
    const matchesSearch =
      it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-coffee-950">
            Menu Catalog & Pricing
          </h2>
          <p className="text-xs text-coffee-600">
            Manage dishes, toggle availability (86 stock), and adjust prices in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-coffee-400" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-coffee-200 bg-white pl-9 pr-3 py-2 text-xs text-coffee-950 focus:border-amberGold focus:outline-none shadow-sm"
            />
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-coffee-950 px-4 py-2 text-xs font-bold text-cream-100 shadow hover:bg-amberGold transition"
          >
            <Plus className="h-4 w-4" />
            <span>Add Dish</span>
          </button>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex overflow-x-auto gap-2 border-b border-coffee-200/80 pb-2 no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
            activeCategory === 'all'
              ? 'bg-coffee-950 text-cream-100 shadow-sm'
              : 'bg-white text-coffee-700 hover:bg-coffee-100 border border-coffee-200'
          }`}
        >
          All Items ({items.length})
        </button>

        {categories.map((c) => {
          const count = items.filter((i) => i.category_id === c.id).length;
          return (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                activeCategory === c.id
                  ? 'bg-coffee-950 text-cream-100 shadow-sm'
                  : 'bg-white text-coffee-700 hover:bg-coffee-100 border border-coffee-200'
              }`}
            >
              {c.name} ({count})
            </button>
          );
        })}
      </div>

      {/* DISHES LIST TABLE / CARDS */}
      <div className="overflow-hidden rounded-2xl border border-coffee-200 bg-white shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-coffee-200 bg-coffee-50/60 text-coffee-700 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3.5">Dish Details</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Price (INR)</th>
                <th className="px-4 py-3.5">Dietary</th>
                <th className="px-4 py-3.5">Stock Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-100 text-coffee-900">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-cream-100/50 transition ${
                    !item.is_available ? 'bg-red-50/20 opacity-80' : ''
                  }`}
                >
                  {/* Photo & Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-coffee-100 border border-coffee-200">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="max-w-xs">
                        <p className="font-bold text-coffee-950 text-xs line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-coffee-500 line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 font-semibold text-coffee-700">
                    {item.category_name || 'Starters'}
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 font-extrabold text-coffee-950">
                    {formatCurrency(item.price)}
                  </td>

                  {/* Veg / Non-Veg */}
                  <td className="px-4 py-3">
                    <VegBadge isVeg={item.is_veg} size="sm" showLabel={true} />
                  </td>

                  {/* 1-Click Availability Toggle */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleAvailability(item.id)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                        item.is_available
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                      title="Click to toggle In-Stock / Sold Out status"
                    >
                      {item.is_available ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-emerald-600" />
                          <span>In Stock</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 text-red-600" />
                          <span>Sold Out (86)</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(item)}
                        className="rounded-lg p-1.5 text-coffee-600 hover:bg-coffee-100 hover:text-amberGold transition"
                        title="Edit dish details"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id, item.name)}
                        className="rounded-lg p-1.5 text-coffee-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete dish"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT DISH MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-coffee-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-xl font-bold text-coffee-950 mb-4 border-b border-coffee-100 pb-2">
              {editingItem ? 'Edit Dish Details' : 'Add New Dish to Menu'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-coffee-800 mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Charcoal Smoked Chicken Shawarma"
                  className="w-full rounded-xl border border-coffee-200 px-3 py-2 text-coffee-950 focus:border-amberGold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-coffee-800 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Appetizing description of ingredients and flavors..."
                  className="w-full rounded-xl border border-coffee-200 px-3 py-2 text-coffee-950 focus:border-amberGold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-coffee-800 mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full rounded-xl border border-coffee-200 px-3 py-2 text-coffee-950 focus:border-amberGold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-coffee-800 mb-1">
                    Prep Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formPrepTime}
                    onChange={(e) => setFormPrepTime(Number(e.target.value))}
                    className="w-full rounded-xl border border-coffee-200 px-3 py-2 text-coffee-950 focus:border-amberGold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-coffee-800 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-xl border border-coffee-200 px-3 py-2 text-coffee-950 focus:border-amberGold focus:outline-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-coffee-800 mb-1">
                    Dietary Classification
                  </label>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setFormIsVeg(true)}
                      className={`flex-1 rounded-xl py-2 font-bold text-xs border ${
                        formIsVeg
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-coffee-200 bg-white text-coffee-600'
                      }`}
                    >
                      Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormIsVeg(false)}
                      className={`flex-1 rounded-xl py-2 font-bold text-xs border ${
                        !formIsVeg
                          ? 'border-red-600 bg-red-50 text-red-800'
                          : 'border-coffee-200 bg-white text-coffee-600'
                      }`}
                    >
                      Non-Veg
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-coffee-800 mb-1">
                  Food Image URL
                </label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://... or /images/cafe/..."
                  className="w-full rounded-xl border border-coffee-200 px-3 py-2 text-coffee-950 focus:border-amberGold focus:outline-none"
                />
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-coffee-500">
                  <span>Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => setFormImageUrl('/images/cafe/rose_milk.jpeg')}
                    className="underline text-amberGold hover:text-amberGold-hover"
                  >
                    Rose Milk
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setFormImageUrl('/images/cafe/logo_3d.jpeg')}
                    className="underline text-amberGold hover:text-amberGold-hover"
                  >
                    Shawarma Logo
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-coffee-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-coffee-300 px-4 py-2 text-xs font-semibold text-coffee-700 hover:bg-coffee-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-coffee-950 px-5 py-2 text-xs font-bold text-cream-100 hover:bg-amberGold transition"
                >
                  {editingItem ? 'Save Changes' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
