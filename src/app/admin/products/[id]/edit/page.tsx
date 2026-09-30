"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Trash2, Upload, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CASE_MATERIALS } from "@/lib/constants";
import { toast } from "sonner";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [bRes, cRes, pRes] = await Promise.all([
          fetch("/api/admin/brands"),
          fetch("/api/admin/categories"),
          fetch(`/api/admin/products/${id}`),
        ]);

        const bData = await bRes.json();
        const cData = await cRes.json();
        const pData = await pRes.json();

        if (!pRes.ok || !pData.product) {
          toast.error("Product not found");
          router.push("/admin/products");
          return;
        }

        setBrands(bData.brands || []);
        setCategories(cData.categories || []);

        const prod = pData.product;
        setFormData({
          name: prod.name || "",
          sku: prod.sku || "",
          categoryId: prod.categoryId || "",
          brandId: prod.brandId || "",
          phoneModelId: prod.phoneModelId || "",
          description: prod.description || "",
          shortDescription: prod.shortDescription || "",
          basePrice: prod.basePrice?.toString() || "",
          compareAtPrice: prod.compareAtPrice?.toString() || "",
          costPrice: prod.costPrice?.toString() || "",
          material: prod.material || CASE_MATERIALS[0],
          color: prod.color || "Obsidian Black",
          finish: prod.finish || "3D Ergonomic Grip",
          magSafeCompatible: prod.magSafeCompatible ?? true,
          warrantyInfo: prod.warrantyInfo || "1 Year Fit & MagSafe Guarantee",
          status: prod.status || "PUBLISHED",
        });

        const prodImgs = prod.images?.map((img: any) => img.url) || [];
        setImages(prodImgs.length > 0 ? prodImgs : ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800"]);
      } catch {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, router]);

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
    if (images.length === 1) {
      toast.error("At least 1 product image is required");
      return;
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : null,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
        images: images.filter((img) => img.trim() !== ""),
      };

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to update product");
        setIsSubmitting(false);
      } else {
        toast.success("Product updated successfully!");
        router.push("/admin/products");
      }
    } catch {
      toast.error("Network error updating product");
      setIsSubmitting(false);
    }
  };

  // Find models for selected brand
  const selectedBrandObj = brands.find((b) => b.id === formData.brandId);
  const availableModels = selectedBrandObj?.series?.flatMap((s: any) => s.models) || [];

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-400">
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/products")}
            className="border-zinc-800 text-zinc-300 hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-black text-white">Edit Product Case</h1>
            <p className="text-xs text-zinc-400">Update product specifications, images and compatibility</p>
          </div>
        </div>
        <Button type="submit" variant="accent" size="md" isLoading={isSubmitting} className="font-bold">
          <Save className="w-4 h-4 mr-2" /> Save Product Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Basic Info & Specs (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3">
              1. Basic Information
            </h3>

            <Input
              label="Product Title *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Kevlar Aramid Shield Case"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="SKU Code *"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="e.g. CS-KEV-17PM-BLK"
                required
              />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Category *
                </label>
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
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                Full Product Overview *
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description of protection, materials, MagSafe strength..."
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-white focus:border-brand-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* COMPATIBILITY & BRAND HIERARCHY */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3">
              2. Smartphone Compatibility
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Phone Brand *
                </label>
                <select
                  name="brandId"
                  value={formData.brandId}
                  onChange={(e) => {
                    const bId = e.target.value;
                    const bObj = brands.find((b) => b.id === bId);
                    const fModel = bObj?.series?.[0]?.models?.[0]?.id || "";
                    setFormData((prev) => ({ ...prev, brandId: bId, phoneModelId: fModel }));
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Compatible Phone Model *
                </label>
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
          </div>

          {/* PRICING */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3">
              3. Pricing (BDT ৳)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Base Price (৳) *"
                name="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={handleChange}
                placeholder="2450"
                required
              />
              <Input
                label="Compare Price (৳)"
                name="compareAtPrice"
                type="number"
                value={formData.compareAtPrice}
                onChange={handleChange}
                placeholder="2850"
              />
              <Input
                label="Cost Price (৳)"
                name="costPrice"
                type="number"
                value={formData.costPrice}
                onChange={handleChange}
                placeholder="1400"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Images, Specifications & Status (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* IMAGE UPLOAD & GALLERY */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand-500" /> 4. Product Gallery
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

            {/* Image Preview & URL Inputs */}
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

          {/* SPECIFICATIONS & TOGGLES */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-3">
              5. Specs & Features
            </h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                Case Material *
              </label>
              <select
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full h-11 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white focus:border-brand-500 focus:outline-none"
              >
                {CASE_MATERIALS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Default Color Name"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="e.g. Obsidian Black"
            />

            <label className="flex items-center gap-3 p-3.5 rounded-xl border border-zinc-800 bg-zinc-950 cursor-pointer">
              <input
                type="checkbox"
                name="magSafeCompatible"
                checked={formData.magSafeCompatible}
                onChange={handleChange}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-brand-500 focus:ring-brand-500"
              />
              <span className="text-xs font-bold text-white">MagSafe Compatible (Built-in N52 Magnet)</span>
            </label>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
                Publish Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-11 rounded-lg border border-zinc-800 bg-zinc-950 px-3 text-sm text-white focus:border-brand-500 focus:outline-none"
              >
                <option value="PUBLISHED">Published (Visible in Shop)</option>
                <option value="DRAFT">Draft (Hidden from Shop)</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
