import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeContext';

vi.mock('../api/config', () => ({
  api: {
    baseURL: 'http://localhost:3000',
    endpoints: { products: '/api/products', suppliers: '/api/suppliers' },
  },
}));

import ProductForm from '../components/entity/product/ProductForm';

const mockSuppliers = [
  { supplierId: 1, name: 'Supplier A' },
  { supplierId: 2, name: 'Supplier B' },
];

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

describe('ProductForm accessibility', () => {
  const defaultProps = {
    product: undefined,
    suppliers: mockSuppliers,
    onClose: vi.fn(),
    onSave: vi.fn(),
  };

  it('dialog has role="dialog" and aria-modal', () => {
    renderWithTheme(<ProductForm {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('dialog has an accessible title via aria-labelledby', () => {
    renderWithTheme(<ProductForm {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    const labelledById = dialog.getAttribute('aria-labelledby');
    expect(labelledById).toBeTruthy();
    const titleElement = document.getElementById(labelledById!);
    expect(titleElement).toBeInTheDocument();
    expect(titleElement?.textContent).toMatch(/add new product/i);
  });

  it('all form inputs have associated labels', () => {
    renderWithTheme(<ProductForm {...defaultProps} />);
    expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sku/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/unit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/supplier/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/discount/i)).toBeInTheDocument();
  });

  it('shows edit title when product is provided', () => {
    const product = {
      productId: 1,
      name: 'Test Product',
      description: 'Test desc',
      price: 10,
      sku: 'TST-001',
      unit: 'each',
      imgName: 'test.png',
      supplierId: 1,
    };
    renderWithTheme(<ProductForm {...defaultProps} product={product} />);
    const dialog = screen.getByRole('dialog');
    const labelledById = dialog.getAttribute('aria-labelledby');
    const titleElement = document.getElementById(labelledById!);
    expect(titleElement?.textContent).toMatch(/edit product/i);
  });

  it('cancel button is accessible', () => {
    renderWithTheme(<ProductForm {...defaultProps} />);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();
    expect(cancelButton).toHaveAttribute('type', 'button');
  });

  it('submit button is accessible', () => {
    renderWithTheme(<ProductForm {...defaultProps} />);
    const submitButton = screen.getByRole('button', { name: /create/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});
