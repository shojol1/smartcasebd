"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, ShieldCheck, Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CASE_MATERIALS } from "@/lib/constants";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    categoryId: "",
    brandId: "",
    phoneModelId: "",
    description: "",
    shortDescription: "",
    basePrice: "",
    compareAtPrice: "",
    costPrice: "",
    material: CASE_MATERIALS[0],
    color: "Obsidian Black",
    finish: "3D Ergonomic Grip",
    magSafeCompatible: true,
    warrantyInfo: "1 Year Fit & MagSafe Guarantee",
    status: "PUBLISHED",
  });

  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80",
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bRes, cRes] = await Promise.all([
          fetch("/api/admin/brands"),
          fetch("/api/admin/categories"),
        ]);
        const bData = await bRes.json();
        const cData = await cRes.json();

        setBrands(bData.brands || []);
        setCategories(cData.categories || []);

        // Default initial selections
        const firstBrand = bData.brands?.[0];
        const firstModel = firstBrand?.series?.[0]?.models?.[0]?.id;
        const firstCategory = cData.categories?.[0]?.id;

        setFormData((prev) => ({
          ...prev,
          ...(firstBrand && { brandId: firstBrand.id }),
          ...(firstModel && { phoneModelId: firstModel }),
          ...(firstCategory && { categoryId: firstCategory }),
        }));
      } catch {
        toast.error("Failed to load dependency data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle local file upload (Convert file to Base64 Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setImages((prev) => [...prev, result]);
          toast.success("Local image uploaded!");
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = ""; // Reset file input
  };

  const handleAddImageUrl = () => {
    setImages((prev) => [...prev, "https://images.unsplash.com/photo-1541877206-e066060c5db6?w=800"]);
  };

  const handleImageChange = (index: number, value: string) => {
    const updated = [...images];
    updated[index] = value;
    setImages(updated);
  };

  const handleRemoveImage = (index: number) => {
    if (images.length === 1) return;
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sku.trim() || !formData.basePrice || !formData.categoryId) {
      toast.error("Required fields or category missing");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          basePrice: parseFloat(formData.basePrice),
          compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
          costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
          images,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create product");
      } else {
        toast.success(`Product ${formData.name} created!`);
        router.push("/admin/products");
      }
    } catch {
      toast.error("Network error creating product");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find models for selected brand
  const selectedBrandObj = brands.find((b) => b.id === formData.brandId);
  const availableModels = selectedBrandObj?.series?.flatMap((s: any) => s.models) || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Create Flagship Product</h1>
            <p className="text-xs text-zinc-400">Assign category, phone compatibility, material, pricing & MagSafe details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT FORM (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          {/* BASIC INFORMATION */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">1. Basic Product Overview</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Case Product Title *" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Carbon Shield Kevlar Case" />
              <Input label="Product SKU *" name="sku" value={formData.sku} onChange={handleChange} placeholder="e.g. CS-KEV-17PM" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Product Category *</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full h-11 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white focus:border-brand-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Short Overview</label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Ultra-thin 0.85mm Kevlar Case with MagSafe for iPhone 17 Pro Max."
                className="w-full h-11 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Detailed Description *</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Crafted from 1500D aerospace-grade real Aramid Fiber. Features zero signal interference, 3D grip texture..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* COMPATIBILITY & MATERIAL */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">2. Phone Model Compatibility & Material</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Target Phone Brand *</label>
                <select
                  name="brandId"
                  value={formData.brandId}
                  onChange={(e) => {
                    handleChange(e);
                    const bObj = brands.find((b) => b.id === e.target.value);
                    const mId = bObj?.series?.[0]?.models?.[0]?.id || "";
                    setFormData((prev) => ({ ...prev, phoneModelId: mId }));
                  }}
                  className="w-full h-11 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white focus:border-brand-500 focus:outline-none"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Compatible Phone Model *</label>
                <select
                  name="phoneModelId"
                  value={formData.phoneModelId}
                  onChange={handleChange}
                  className="w-full h-11 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white focus:border-brand-500 focus:outline-none"
                >
                  {availableModels.map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Material *</label>
                <select
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  className="w-full h-11 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white focus:border-brand-500 focus:outline-none"
                >
                  {CASE_MATERIALS.map((mat) => (
                    <option key={mat} value={mat}>
                      {mat}
                    </option>
                  ))}
                </select>
              </div>

              <Input label="Default Color Name" name="color" value={formData.color} onChange={handleChange} placeholder="Obsidian Black" />
            </div>

            <label className="flex items-center gap-2 pt-2 cursor-pointer">
              <input
                type="checkbox"
                name="magSafeCompatible"
                checked={formData.magSafeCompatible}
                onChange={handleChange}
                className="w-4 h-4 text-brand-500 rounded focus:ring-brand-500"
              />
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-400" /> Integrated N52 MagSafe Magnet Array
              </span>
            </label>
          </div>

          {/* IMAGE URL & FILE UPLOAD GALLERY */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand-500" /> 3. Product Image Gallery
              </h3>
            </div>

            {/* Local Upload & URL Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-brand-500 bg-brand-950/40 hover:bg-brand-950/70 text-brand-400 text-xs font-bold cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload Local File</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleAddImageUrl}
                className="flex items-center justify-center gap-2 p-3 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-xs font-bold transition-colors"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Add Image URL</span>
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {images.map((url, idx) => (
                <div key={idx} className="p-3 rounded-xl border border-zinc-800 bg-zinc-950 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <img src={url} alt={`Preview ${idx + 1}`} className="w-12 h-12 object-cover rounded-lg bg-zinc-900 border border-zinc-800 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        {idx === 0 ? "★ Thumbnail Image" : `Image ${idx + 1}`}
                      </p>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        placeholder="Image URL or Base64 data..."
                        className="w-full h-8 rounded border border-zinc-800 bg-zinc-900 px-2 text-xs text-zinc-300 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PRICING & SAVE (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 sticky top-24">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">4. Pricing & Publishing</h3>

            <Input label="Selling Price (BDT) *" name="basePrice" type="number" value={formData.basePrice} onChange={handleChange} placeholder="2450" />
            <Input label="Compare-At Price (BDT)" name="compareAtPrice" type="number" value={formData.compareAtPrice} onChange={handleChange} placeholder="2850" />
            <Input label="Cost Price (Admin Only)" name="costPrice" type="number" value={formData.costPrice} onChange={handleChange} placeholder="1200" />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">Publish Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-11 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="PUBLISHED">Published (Visible on Site)</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <Button type="submit" variant="accent" size="lg" isLoading={isSubmitting} className="w-full font-bold shadow-md">
              <Save className="w-4 h-4 mr-2" /> Save Product & Initial Stock
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
