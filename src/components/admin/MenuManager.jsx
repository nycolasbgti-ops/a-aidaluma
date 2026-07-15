import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../../supabaseClient'
import { fmt } from '../../utils/price'

// ── Helpers ──────────────────────────────────────────────────

const toSlug = (name) =>
  name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const uploadImage = async (file) => {
  const ext      = file.name.split('.').pop().toLowerCase()
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const path     = `products/${fileName}`

  const { error } = await supabase.storage
    .from('menu-images')
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('menu-images')
    .getPublicUrl(path)

  return publicUrl
}

const EMPTY_CAT  = { name: '', icon: '🍕', order_position: 0, is_pizza: false }
const EMPTY_PROD = { name: '', description: '', category_id: '', priceType: 'sized', priceUnique: '', priceP: '', priceM: '', priceG: '', image_url: '', active: true, order_position: 0 }

// ── Sub-components ────────────────────────────────────────────

function SectionTitle({ children }) {
  return <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{children}</p>
}

function ToggleRow({ label, sub, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0 ${value ? 'bg-[#FF3B30]' : 'bg-[#3A3A3C]'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${value ? 'left-6' : 'left-0.5'}`} />
      </button>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs text-gray-500 block mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = "w-full bg-[#242424] rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:ring-2 focus:ring-[#FF3B30] transition-all text-sm"

// ── Category Form ─────────────────────────────────────────────

function CategoryForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(
    initial
      ? { name: initial.name, icon: initial.icon, order_position: initial.order_position, is_pizza: initial.is_pizza }
      : { ...EMPTY_CAT }
  )
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-4">
      <Field label="Nome da categoria *">
        <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
          placeholder="Ex: Pastéis, Porções" className={inputCls} />
      </Field>

      <Field label="Ícone (emoji) *">
        <input type="text" value={form.icon} onChange={e => set('icon', e.target.value)}
          placeholder="🍕" className={`${inputCls} text-2xl text-center`} maxLength={4} />
      </Field>

      <Field label="Posição na barra (número menor = aparece primeiro)">
        <input type="number" value={form.order_position} onChange={e => set('order_position', e.target.value)}
          min={0} className={inputCls} />
      </Field>

      <div className="bg-[#242424] rounded-xl p-4">
        <ToggleRow
          label="Categoria de Pizza"
          sub="Ativa o modal de montagem com Meio a Meio e Borda Recheada"
          value={form.is_pizza}
          onChange={v => set('is_pizza', v)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onCancel}
          className="flex-1 py-3.5 bg-[#242424] rounded-2xl text-sm font-semibold text-gray-400 active:scale-95 transition-all">
          Cancelar
        </button>
        <button onClick={() => onSave(form)} disabled={saving || !form.name.trim()}
          className="flex-1 py-3.5 bg-[#FF3B30] rounded-2xl text-sm font-bold active:scale-95 transition-all disabled:opacity-50">
          {saving ? 'Salvando...' : initial ? 'Salvar' : 'Criar Categoria'}
        </button>
      </div>
    </div>
  )
}

// ── Product Form ──────────────────────────────────────────────

function ProductForm({ initial, categories, defaultCategoryId, onSave, onCancel, saving }) {
  const fileInputRef = useRef()
  const [uploading, setUploading] = useState(false)
  const [preview,   setPreview]   = useState(initial?.image_url || '')
  const [uploadErr, setUploadErr] = useState('')

  const initForm = () => {
    if (!initial) return { ...EMPTY_PROD, category_id: defaultCategoryId || categories[0]?.id || '' }
    const hasSized = initial.prices?.unique === undefined
    return {
      name:         initial.name,
      description:  initial.description || '',
      category_id:  initial.category_id,
      priceType:    hasSized ? 'sized' : 'unique',
      priceUnique:  initial.prices?.unique ?? '',
      priceP:       initial.prices?.P ?? '',
      priceM:       initial.prices?.M ?? '',
      priceG:       initial.prices?.G ?? '',
      image_url:    initial.image_url || '',
      active:       initial.active ?? true,
      order_position: initial.order_position ?? 0,
    }
  }

  const [form, setForm] = useState(initForm)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const selectedCat = categories.find(c => c.id === form.category_id)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setUploadErr('')
    try {
      const url = await uploadImage(file)
      setPreview(url)
      set('image_url', url)
    } catch (err) {
      setUploadErr('Erro no upload: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Field label="Categoria *">
        <select value={form.category_id} onChange={e => set('category_id', e.target.value)}
          className={inputCls}>
          <option value="">Selecione...</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
      </Field>

      <Field label="Nome do produto *">
        <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
          placeholder="Ex: 01 - Mussarela" className={inputCls} />
      </Field>

      <Field label="Descrição">
        <textarea value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="Ingredientes, destaques..." rows={3}
          className={`${inputCls} resize-none`} />
      </Field>

      {/* Tipo de preço */}
      <div>
        <SectionTitle>Preço</SectionTitle>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { v: 'sized',  label: 'Por Tamanho', sub: 'P / M / G' },
            { v: 'unique', label: 'Preço Único',  sub: 'Um valor só' },
          ].map(opt => (
            <button key={opt.v} onClick={() => set('priceType', opt.v)}
              className={`py-2.5 px-4 rounded-xl text-left transition-all border ${
                form.priceType === opt.v
                  ? 'bg-[#FF3B30]/15 border-[#FF3B30]'
                  : 'bg-[#242424] border-transparent text-gray-400'
              }`}>
              <p className="font-semibold text-sm">{opt.label}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{opt.sub}</p>
            </button>
          ))}
        </div>

        {form.priceType === 'unique' ? (
          <input type="number" value={form.priceUnique} onChange={e => set('priceUnique', e.target.value)}
            placeholder="0,00" step="0.01" min="0" className={inputCls} />
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'priceP', label: 'P — Pequena' },
              { key: 'priceM', label: 'M — Média'   },
              { key: 'priceG', label: 'G — Grande'  },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-[11px] text-gray-500 block mb-1">{label}</label>
                <input type="number" value={form[key]} onChange={e => set(key, e.target.value)}
                  placeholder="0,00" step="0.01" min="0"
                  className="w-full bg-[#242424] rounded-xl px-3 py-2.5 text-white text-sm outline-none focus:ring-2 focus:ring-[#FF3B30] transition-all placeholder-gray-600" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload de imagem */}
      <div>
        <SectionTitle>Imagem do Produto</SectionTitle>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

        {preview ? (
          <div className="relative">
            <img src={preview} alt="preview" className="w-full h-36 object-cover rounded-2xl" />
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl
                         text-sm font-semibold text-white opacity-0 hover:opacity-100 transition-opacity active:opacity-100">
              {uploading ? 'Enviando...' : 'Trocar imagem'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="w-full h-28 bg-[#242424] rounded-2xl border-2 border-dashed border-white/10
                       flex flex-col items-center justify-center gap-1.5 active:bg-[#2C2C2E] transition-colors">
            {uploading ? (
              <div className="w-6 h-6 border-2 border-[#FF3B30] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs text-gray-500">Toque para adicionar imagem</span>
              </>
            )}
          </button>
        )}
        {uploadErr && <p className="text-red-400 text-xs mt-1">{uploadErr}</p>}
      </div>

      {/* Posição e ativo */}
      <Field label="Posição na lista (número menor = aparece primeiro)">
        <input type="number" value={form.order_position} onChange={e => set('order_position', e.target.value)}
          min={0} className={inputCls} />
      </Field>

      <div className="bg-[#242424] rounded-xl p-4">
        <ToggleRow
          label="Produto Ativo"
          sub="Desative para ocultar do cardápio sem excluir"
          value={form.active}
          onChange={v => set('active', v)}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onCancel}
          className="flex-1 py-3.5 bg-[#242424] rounded-2xl text-sm font-semibold text-gray-400 active:scale-95 transition-all">
          Cancelar
        </button>
        <button
          onClick={() => onSave(form)}
          disabled={saving || uploading || !form.name.trim() || !form.category_id}
          className="flex-1 py-3.5 bg-[#FF3B30] rounded-2xl text-sm font-bold active:scale-95 transition-all disabled:opacity-50">
          {saving ? 'Salvando...' : initial ? 'Salvar' : 'Criar Produto'}
        </button>
      </div>
    </div>
  )
}

// ── Main MenuManager ──────────────────────────────────────────

export default function MenuManager() {
  const [screen,      setScreen]      = useState('categories')  // 'categories' | 'products' | 'cat-form' | 'prod-form'
  const [categories,  setCategories]  = useState([])
  const [products,    setProducts]    = useState([])
  const [activeCat,   setActiveCat]   = useState(null)
  const [editingCat,  setEditingCat]  = useState(null)  // null = criar novo
  const [editingProd, setEditingProd] = useState(null)
  const [saving,      setSaving]      = useState(false)
  const [error,       setError]       = useState('')
  const [loading,     setLoading]     = useState(true)

  // ── Data fetching ──────────────────────────────────────────
  const loadCategories = async () => {
    const { data, error } = await supabase
      .from('categories').select('*').order('order_position')
    if (error) { setError(error.message); return }
    setCategories(data || [])
  }

  const loadProducts = async (catId) => {
    if (!catId) return
    const { data, error } = await supabase
      .from('products').select('*').eq('category_id', catId).order('order_position')
    if (error) { setError(error.message); return }
    setProducts(data || [])
  }

  useEffect(() => {
    loadCategories().finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (activeCat) loadProducts(activeCat.id)
  }, [activeCat])

  // ── Save category ──────────────────────────────────────────
  const saveCategory = async (form) => {
    setSaving(true)
    setError('')
    try {
      const payload = {
        name:           form.name.trim(),
        slug:           toSlug(form.name),
        icon:           form.icon.trim() || '🍽️',
        order_position: parseInt(form.order_position) || 0,
        is_pizza:       form.is_pizza,
      }
      if (editingCat) {
        const { error } = await supabase.from('categories').update(payload).eq('id', editingCat.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('categories').insert({ ...payload, active: true })
        if (error) throw error
      }
      await loadCategories()
      setScreen('categories')
      setEditingCat(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Toggle category active ─────────────────────────────────
  const toggleCatActive = async (cat) => {
    await supabase.from('categories').update({ active: !cat.active }).eq('id', cat.id)
    await loadCategories()
  }

  // ── Delete category ────────────────────────────────────────
  const deleteCategory = async (cat) => {
    const ok = window.confirm(
      `Excluir a categoria "${cat.name}"?\n\n⚠️ ATENÇÃO: todos os produtos desta categoria serão excluídos permanentemente junto com ela (exclusão em cascata).\n\nEsta ação não pode ser desfeita.`
    )
    if (!ok) return
    setError('')
    const { error } = await supabase.from('categories').delete().eq('id', cat.id)
    if (error) { setError(error.message); return }
    setCategories(prev => prev.filter(c => c.id !== cat.id))
    // Se estava visualizando produtos desta categoria, volta para a lista
    if (activeCat?.id === cat.id) { setActiveCat(null); setScreen('categories') }
  }

  // ── Save product ───────────────────────────────────────────
  const saveProduct = async (form) => {
    setSaving(true)
    setError('')
    try {
      const prices = form.priceType === 'unique'
        ? { unique: parseFloat(form.priceUnique) || 0 }
        : {
            P: parseFloat(form.priceP) || 0,
            M: parseFloat(form.priceM) || 0,
            G: parseFloat(form.priceG) || 0,
          }

      const cat = categories.find(c => c.id === form.category_id)
      const is_sweet = /doces?/i.test(cat?.name || '')

      const payload = {
        category_id:    form.category_id,
        name:           form.name.trim(),
        description:    form.description.trim() || null,
        prices,
        is_sweet,
        image_url:      form.image_url || null,
        active:         form.active,
        order_position: parseInt(form.order_position) || 0,
      }

      if (editingProd) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingProd.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
      }

      await loadProducts(form.category_id)
      // If category changed, update activeCat
      const newCat = categories.find(c => c.id === form.category_id)
      if (newCat) setActiveCat(newCat)
      setScreen('products')
      setEditingProd(null)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Toggle product active ──────────────────────────────────
  const toggleProdActive = async (prod) => {
    await supabase.from('products').update({ active: !prod.active }).eq('id', prod.id)
    await loadProducts(activeCat?.id)
  }

  // ── Delete product ─────────────────────────────────────────
  const deleteProduct = async (prod) => {
    const ok = window.confirm(`Excluir o produto "${prod.name}"?\n\nEsta ação não pode ser desfeita.`)
    if (!ok) return
    setError('')
    const { error } = await supabase.from('products').delete().eq('id', prod.id)
    if (error) { setError(error.message); return }
    setProducts(prev => prev.filter(p => p.id !== prod.id))
  }

  // ── Render helpers ─────────────────────────────────────────
  const BackButton = ({ label, onClick }) => (
    <button onClick={onClick}
      className="flex items-center gap-1.5 text-sm text-gray-400 mb-5 active:text-white transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      {label}
    </button>
  )

  const formatPrices = (prices) => {
    if (!prices) return '—'
    if (prices.unique !== undefined) return fmt(prices.unique)
    const parts = []
    if (prices.P !== undefined) parts.push(`P: ${fmt(prices.P)}`)
    if (prices.M !== undefined) parts.push(`M: ${fmt(prices.M)}`)
    if (prices.G !== undefined) parts.push(`G: ${fmt(prices.G)}`)
    return parts.join(' · ')
  }

  // ── Screens ────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-[#FF3B30] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Category form
  if (screen === 'cat-form') {
    return (
      <div>
        <BackButton label="Categorias" onClick={() => { setScreen('categories'); setEditingCat(null) }} />
        <h3 className="text-lg font-bold mb-5">{editingCat ? 'Editar Categoria' : 'Nova Categoria'}</h3>
        {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 rounded-xl px-4 py-2">{error}</p>}
        <CategoryForm
          initial={editingCat}
          onSave={saveCategory}
          onCancel={() => { setScreen('categories'); setEditingCat(null) }}
          saving={saving}
        />
      </div>
    )
  }

  // Product form
  if (screen === 'prod-form') {
    return (
      <div>
        <BackButton label={activeCat?.name || 'Produtos'} onClick={() => { setScreen('products'); setEditingProd(null) }} />
        <h3 className="text-lg font-bold mb-5">{editingProd ? 'Editar Produto' : 'Novo Produto'}</h3>
        {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 rounded-xl px-4 py-2">{error}</p>}
        <ProductForm
          initial={editingProd}
          categories={categories}
          defaultCategoryId={activeCat?.id}
          onSave={saveProduct}
          onCancel={() => { setScreen('products'); setEditingProd(null) }}
          saving={saving}
        />
      </div>
    )
  }

  // Product list
  if (screen === 'products' && activeCat) {
    return (
      <div>
        <BackButton label="Categorias" onClick={() => setScreen('categories')} />
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold">{activeCat.icon} {activeCat.name}</h3>
            <p className="text-xs text-gray-500">{products.length} produto(s)</p>
          </div>
          <button
            onClick={() => { setEditingProd(null); setScreen('prod-form') }}
            className="px-4 py-2 bg-[#FF3B30] rounded-full text-sm font-bold active:scale-95 transition-all">
            + Produto
          </button>
        </div>

        {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 rounded-xl px-4 py-2">{error}</p>}

        {products.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl block mb-3">📦</span>
            <p className="text-gray-500 text-sm">Nenhum produto nesta categoria.</p>
            <button
              onClick={() => { setEditingProd(null); setScreen('prod-form') }}
              className="mt-4 px-5 py-2.5 bg-[#1A1A1A] rounded-full text-sm font-semibold text-gray-300 active:scale-95 transition-all">
              Criar primeiro produto
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {products.map(prod => (
              <div key={prod.id}
                className={`bg-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3 ${!prod.active ? 'opacity-40' : ''}`}>
                {/* Imagem */}
                <div className="w-14 h-14 bg-[#242424] rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {prod.image_url
                    ? <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                    : <span className="text-2xl">🍕</span>
                  }
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-white leading-snug truncate">{prod.name}</p>
                  <p className="text-xs text-[#FF9500] mt-0.5">{formatPrices(prod.prices)}</p>
                  {!prod.active && <span className="text-[10px] text-gray-600">● Inativo</span>}
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleProdActive(prod)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors ${
                      prod.active ? 'bg-green-500/15 text-green-400' : 'bg-[#2C2C2E] text-gray-500'
                    }`}
                    title={prod.active ? 'Desativar' : 'Ativar'}
                  >
                    {prod.active ? '●' : '○'}
                  </button>
                  <button
                    onClick={() => { setEditingProd(prod); setScreen('prod-form') }}
                    className="w-8 h-8 bg-[#2C2C2E] rounded-full flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteProduct(prod)}
                    className="w-8 h-8 bg-red-500/15 rounded-full flex items-center justify-center active:bg-red-500/30 transition-colors"
                    title="Excluir produto">
                    <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Category list (default)
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold">Categorias</h3>
          <p className="text-xs text-gray-500">{categories.length} categoria(s)</p>
        </div>
        <button
          onClick={() => { setEditingCat(null); setScreen('cat-form') }}
          className="px-4 py-2 bg-[#FF3B30] rounded-full text-sm font-bold active:scale-95 transition-all">
          + Categoria
        </button>
      </div>

      {error && <p className="text-red-400 text-sm mb-4 bg-red-500/10 rounded-xl px-4 py-2">{error}</p>}

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl block mb-3">🗂️</span>
          <p className="text-gray-500 text-sm">Nenhuma categoria ainda.</p>
          <p className="text-gray-600 text-xs mt-1">Execute o SQL de setup para criar as categorias iniciais.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className={`bg-[#1A1A1A] rounded-2xl flex items-center ${!cat.active ? 'opacity-40' : ''}`}>
              {/* Category row */}
              <button
                onClick={() => { setActiveCat(cat); setScreen('products') }}
                className="flex-1 flex items-center gap-3 p-4 active:opacity-70 transition-opacity text-left">
                <span className="text-2xl w-8 text-center">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white">{cat.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {cat.is_pizza ? '🍕 Pizza' : '📋 Simples'} · Ordem {cat.order_position}
                  </p>
                </div>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Actions */}
              <div className="flex items-center gap-1 pr-3">
                <button
                  onClick={() => toggleCatActive(cat)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                    cat.active ? 'bg-green-500/15 text-green-400' : 'bg-[#2C2C2E] text-gray-500'
                  }`}
                  title={cat.active ? 'Desativar' : 'Ativar'}
                >
                  {cat.active ? '●' : '○'}
                </button>
                <button
                  onClick={() => { setEditingCat(cat); setScreen('cat-form') }}
                  className="w-7 h-7 bg-[#2C2C2E] rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => deleteCategory(cat)}
                  className="w-7 h-7 bg-red-500/15 rounded-full flex items-center justify-center active:bg-red-500/30 transition-colors"
                  title="Excluir categoria">
                  <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 bg-[#1A1A1A] rounded-2xl p-4 border border-yellow-500/20">
        <p className="text-xs text-yellow-400 font-semibold mb-1">⚠️ Sobre itens inativos</p>
        <p className="text-xs text-gray-500 leading-relaxed">
          Itens desativados (●○) ficam ocultos no cardápio. Para gerenciar itens ocultos, acesse
          <span className="text-gray-400"> Supabase Dashboard → Table Editor</span>.
        </p>
      </div>
    </div>
  )
}
