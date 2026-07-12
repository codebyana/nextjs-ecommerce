'use client';

import { useState, useTransition, useRef } from 'react';
import { updateProduct, addProduct, uploadProductImage } from '@/actions/admin';
import styles from './ProductModal.module.css';
import Image from 'next/image';
import { useEffect } from 'react';
import CategoryModal from './CategoryModal';
import { safeParseJson } from '@/lib/utils';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any;
}

export default function ProductModal({ isOpen, onClose, product }: ProductModalProps) {
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
  const parsedSizes = safeParseJson(product?.sizes);
  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock ?? 0,
    category: product?.category || '',
    images: safeParseJson(product?.images),
    sizes: parsedSizes.length > 0 ? parsedSizes : (product?.category === 'Jaket' ? ['S', 'M', 'L', 'XL'] : ['OS']),
  });

  useEffect(() => {
    if (formData.category === 'Jaket') {
      if (formData.sizes.length === 0 || formData.sizes.includes('OS')) {
        setFormData(prev => ({
          ...prev,
          sizes: ['S', 'M', 'L', 'XL']
        }));
      }
    } else {
      if (formData.sizes.length > 0 && !formData.sizes.includes('OS')) {
        setFormData(prev => ({
          ...prev,
          sizes: ['OS']
        }));
      }
    }
  }, [formData.category]);

  const [categories, setCategories] = useState<Array<any>>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) return;
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      console.error('Failed to fetch categories', e);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    const result = await uploadProductImage(uploadData);
    if (result.success && result.url) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, result.url]
      }));
    } else {
      alert(result.message);
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    startTransition(async () => {
      let result;
      if (product) {
        result = await updateProduct(product.id, formData);
      } else {
        result = await addProduct(formData);
      }

      if (result.success) {
        onClose();
        // refresh categories in case product creation relied on a newly added category
        fetchCategories();
      } else {
        alert(result.message);
      }
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className={styles.closeBtn}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.imageSection}>
            <label className={styles.label}>Product Images</label>
            <div className={styles.imageGrid}>
              {formData.images.map((url: string, idx: number) => (
                <div key={idx} className={styles.imagePreview}>
                  <Image src={url} alt="Preview" width={80} height={100} objectFit="cover" />
                  <button type="button" onClick={() => removeImage(idx)} className={styles.removeImg}>&times;</button>
                </div>
              ))}
              <button 
                type="button" 
                className={styles.uploadTrigger}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? '...' : '+'}
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              style={{ display: 'none' }} 
              accept="image/*"
            />
          </div>

          <div className={styles.field}>
            <label>Product Title</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              required 
            />
          </div>

          <div className={styles.field}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Category</span>
              <button type="button" onClick={() => setIsCategoryModalOpen(true)} style={{ fontSize: '0.75rem' }}>
                Manage
              </button>
            </label>
            <select 
              value={formData.category} 
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {formData.category === 'Jaket' && (
            <div className={styles.field}>
              <label>Pilihan Ukuran (Sizes)</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {['S', 'M', 'L', 'XL', 'XXL'].map(size => {
                  const isChecked = formData.sizes.includes(size);
                  return (
                    <label key={size} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => {
                          setFormData(prev => {
                            const newSizes = prev.sizes.includes(size)
                              ? prev.sizes.filter((s: string) => s !== size)
                              : [...prev.sizes, size];
                            return { ...prev, sizes: newSizes };
                          });
                        }} 
                      />
                      <span>{size}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Price (IDR)</label>
              <input 
                type="number" 
                step="1"
                value={formData.price} 
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value, 10) || 0})} 
                required 
              />
            </div>
            <div className={styles.field}>
              <label>Stok (unit)</label>
              <input 
                type="number" 
                min="0"
                step="1"
                value={formData.stock} 
                onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value, 10) || 0})} 
                required 
              />
            </div>
          </div>


          <div className={styles.field}>
            <label>Description</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              rows={3}
              required 
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={isPending || uploading}>
              {isPending ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
        <CategoryModal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} onSaved={() => { fetchCategories(); setIsCategoryModalOpen(false); }} />
      </div>
    </div>
  );
}
